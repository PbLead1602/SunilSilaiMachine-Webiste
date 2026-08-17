/*
 * Imports SINGER India products assigned to the official Sewing Machines
 * category (including its machine-related subcategories).
 *
 * Run: node scripts/import-singer-catalogue.mjs
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brand = "SINGER";
const categoryId = 168;
const apiRoot = "https://shop.singerindia.com/wp-json/wc/store/v1/products";
const sourceCategoryUrl = "https://shop.singerindia.com/product-category/sewing-machines/";
const verifiedAt = new Date().toISOString().slice(0, 10);
const dataPath = path.join(root, "data", "imported-product-catalogue.json");
const imageRoot = path.join(root, "public", "images", "product images");
const reportPath = path.join(root, "reports", "singer-catalogue-import-report.md");
const unavailable = "Not available from verified source";
const imagePathsByHash = new Map();
const stats = { discovered: 0, added: 0, updated: 0, skipped: 0, stored: 0, reused: 0, missing: 0, removedOrphans: 0, failures: [] };

const singerCategories = {
  184: { category: "accessories", type: "Accessories" },
  170: { category: "domestic-machines", type: "Artisan" },
  209: { category: "domestic-machines", type: "Electronic / Embroidery" },
  232: { category: "industrial-machines", type: "Industrial" },
  169: { category: "domestic-machines", type: "Straight Stitch" },
  181: { category: "domestic-machines", type: "Zigzag" },
};

function standardSpecifications() {
  return {
    speed: unavailable, needleType: unavailable, needles: unavailable, threads: unavailable,
    stitchLength: unavailable, stitchWidth: unavailable, presserFootLift: unavailable,
    feedMechanism: unavailable, motor: unavailable, lubrication: unavailable,
    voltage: unavailable, power: unavailable, dimensions: unavailable, weight: unavailable,
    warranty: unavailable,
  };
}

function slug(value = "") {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "model";
}

function filenamePart(value = "") {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "Model";
}

function productKey(product) {
  return `${product.brand}`.toUpperCase() + ":" + `${product.modelNumber ?? product.name}`.toUpperCase().replace(/[^A-Z0-9]+/g, "");
}

function text(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#8211;|&#x2013;/gi, "–")
    .replace(/&#8217;|&#x2019;/gi, "'")
    .replace(/&#039;|&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function listItems(html = "") {
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => text(match[1]))
    .filter((item) => item && !/^contents\s*:/i.test(item) && item.length <= 220)
    .filter((item, index, values) => values.indexOf(item) === index)
    .slice(0, 12);
}

function specificationValues(source = "") {
  const specs = standardSpecifications();
  const clean = text(source);
  const capture = (pattern) => clean.match(pattern)?.[1];
  const speed = capture(/(?:max(?:imum)?\s*)?(?:sewing\s*)?speed[^0-9]{0,35}(\d{3,5}\s*(?:rpm|r\.p\.m|stitches?\s*(?:per|\/)\s*(?:min|minute)))/i)
    ?? capture(/(\d{3,5}\s*(?:rpm|r\.p\.m))/i);
  const needle = capture(/(?:needle(?:\s+(?:type|system))?)[^A-Z0-9]{0,35}([A-Z]{1,6}[X×x-]?\d+[A-Z0-9#X×x-]*)/i);
  const stitchLength = capture(/(?:max(?:imum)?\s*)?stitch\s*length[^0-9]{0,25}(\d+(?:\.\d+)?\s*mm)/i);
  const stitchWidth = capture(/(?:zig\s*zag\s*)?stitch\s*width[^0-9]{0,25}(\d+(?:\.\d+)?\s*mm)/i);
  const lift = capture(/(?:presser\s*(?:foot)?\s*lift)[^0-9]{0,35}(\d+(?:\.\d+)?\s*mm)/i);
  const voltage = capture(/(?:voltage|power)[^0-9]{0,35}(\d{2,3}\s*V)/i);
  const power = capture(/(?:power|motor)[^0-9]{0,35}(\d+(?:\.\d+)?\s*(?:W|watt|HP))/i);
  const weight = capture(/(?:weight)[^0-9]{0,30}(\d+(?:\.\d+)?\s*(?:kg|kgs))/i);
  const warranty = capture(/(?:warranty)[^0-9]{0,30}(\d+\s*(?:year|years|month|months))/i);
  if (speed) specs.speed = speed;
  if (needle) specs.needleType = needle;
  if (stitchLength) specs.stitchLength = stitchLength;
  if (stitchWidth) specs.stitchWidth = stitchWidth;
  if (lift) specs.presserFootLift = lift;
  if (voltage) specs.voltage = voltage;
  if (power) specs.power = power;
  if (weight) specs.weight = weight;
  if (warranty) specs.warranty = warranty;
  return specs;
}

function classification(product) {
  const categoryIds = product.categories?.map((category) => category.id) ?? [];
  const child = categoryIds.find((id) => id !== categoryId && singerCategories[id]);
  const fromCategory = child ? singerCategories[child] : undefined;
  const title = text(product.title?.rendered ?? "");
  if (fromCategory?.category === "accessories") {
    if (/bobbin|shuttle|needle|disc|belt|gear|motor|case|assembly|foot/i.test(title)) return { category: "spare-parts", type: "Spare Part" };
    return fromCategory;
  }
  if (fromCategory) return fromCategory;
  if (/motor/i.test(title)) return { category: "garment-machinery", type: "Motor" };
  if (/over.?lock|interlock/i.test(title)) return { category: "overlock-interlock", type: "Overlock" };
  return { category: "domestic-machines", type: "Domestic" };
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "SunilSilaiMachineCatalogBot/1.0 (catalogue import)", accept: "application/json" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return { data: await response.json(), headers: response.headers };
}

async function singerProducts() {
  const first = await fetchJson(`${apiRoot}?category=${categoryId}&per_page=100&page=1`);
  const pages = Number(first.headers.get("x-wp-totalpages") ?? "1");
  const batches = [first.data];
  for (let page = 2; page <= pages; page += 1) batches.push((await fetchJson(`${apiRoot}?category=${categoryId}&per_page=100&page=${page}`)).data);
  return batches.flat();
}

async function recursiveFiles(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return (await Promise.all(entries.map((entry) => entry.isDirectory()
      ? recursiveFiles(path.join(directory, entry.name))
      : [path.join(directory, entry.name)]))).flat();
  } catch { return []; }
}

async function preloadImages() {
  for (const file of await recursiveFiles(imageRoot)) {
    if (!/\.jpe?g$/i.test(file)) continue;
    if (file.startsWith(path.join(imageRoot, "singer") + path.sep)) continue;
    const input = await readFile(file);
    imagePathsByHash.set(createHash("sha256").update(input).digest("hex"), `/${path.relative(path.join(root, "public"), file).replaceAll(path.sep, "/")}`);
  }
}

async function featuredImage(product) {
  return product.images?.[0]?.src ?? "";
}

async function saveImage(modelNumber, type, imageUrl, productUrl) {
  if (!imageUrl) {
    stats.missing += 1;
    return { image: "", notes: "No clean primary image was available from the official product record." };
  }
  try {
    const response = await fetch(imageUrl, { headers: { "user-agent": "SunilSilaiMachineCatalogBot/1.0 (catalogue import)" } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const input = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(input, { failOn: "none" }).metadata();
    const jpeg = await sharp(input, { failOn: "none" })
      .rotate()
      .flatten({ background: "#FAF8F5" })
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
      .toColourspace("srgb")
      .jpeg({ quality: 93, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toBuffer();
    const hash = createHash("sha256").update(jpeg).digest("hex");
    const longSide = Math.max(metadata.width ?? 0, metadata.height ?? 0);
    const qualityNote = longSide < 1600
      ? `Official source image is ${longSide}px on its long side; preserved without artificial detail generation.`
      : "Official image converted to sRGB JPEG.";
    const existing = imagePathsByHash.get(hash);
    if (existing) {
      stats.reused += 1;
      return { image: existing, notes: `Reused an identical processed official image. ${qualityNote}` };
    }
    const folder = path.join(imageRoot, "singer", slug(type));
    await mkdir(folder, { recursive: true });
    const filename = `${filenamePart(brand)}_${filenamePart(type)}_${filenamePart(modelNumber)}.jpg`;
    const target = path.join(folder, filename);
    await writeFile(target, jpeg);
    const image = `/${path.relative(path.join(root, "public"), target).replaceAll(path.sep, "/")}`;
    imagePathsByHash.set(hash, image);
    stats.stored += 1;
    return { image, notes: qualityNote };
  } catch (error) {
    stats.missing += 1;
    const reason = error instanceof Error ? error.message : String(error);
    stats.failures.push({ modelNumber, productUrl, imageUrl, reason });
    return { image: "", notes: `Official image could not be downloaded: ${reason}` };
  }
}

async function mapLimit(items, limit, worker) {
  const results = Array(items.length);
  let cursor = 0;
  async function runner() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(items.length, limit) }, runner));
  return results;
}

async function main() {
  await preloadImages();
  const sourceProducts = await singerProducts();
  stats.discovered = sourceProducts.length;
  const current = JSON.parse(await readFile(dataPath, "utf8"));
  const existing = new Map(current.products.map((item) => [productKey(item), item]));
  const collected = await mapLimit(sourceProducts, 5, async (source) => {
    const originalName = text(source.name ?? source.slug);
    const name = /^singer\b/i.test(originalName) ? originalName.replace(/^singer\b/i, "SINGER") : `SINGER ${originalName}`;
    // The public SINGER product title is the dependable customer-facing model
    // label. Internal store SKUs are retained by the source but are not used as
    // a model number when they differ from that published product label.
    const modelNumber = originalName.replace(/^singer\s*/i, "").trim();
    const { category, type } = classification(source);
    const imageUrl = await featuredImage(source);
    const stored = await saveImage(modelNumber, type, imageUrl, source.permalink);
    const sourceContent = source.description ?? "";
    const sourceExcerpt = text(source.short_description ?? "");
    const description = text(sourceContent) || sourceExcerpt || `This SINGER model is listed on the manufacturer’s official India shop. Contact Sunil Silai Machine for current availability, configuration guidance, price, EMI options, and delivery details.`;
    const features = listItems(sourceContent);
    const record = {
      slug: `singer-${slug(modelNumber)}`,
      name,
      brand,
      modelNumber,
      category,
      subcategory: type,
      series: type,
      variant: "",
      productType: type,
      image: stored.image,
      gallery: stored.image ? [stored.image] : [],
      shortDescription: sourceExcerpt || `Official SINGER ${type.toLowerCase()} listing. Contact Sunil Silai Machine for product guidance and price.`,
      description,
      features: features.length ? features : ["Official SINGER India product listing"],
      applications: [],
      specifications: specificationValues(sourceContent),
      source: { officialSource: true, sourceType: "official SINGER India product API", url: source.permalink, brochureUrl: "", lastVerifiedAt: verifiedAt, verificationStatus: "official" },
      importNotes: stored.notes,
    };
    return record;
  });

  const incomingByKey = new Map();
  for (const item of collected) {
    const key = productKey(item);
    if (incomingByKey.has(key)) { stats.skipped += 1; continue; }
    incomingByKey.set(key, item);
  }
  const imported = [...incomingByKey.values()].map((item) => {
    const previous = existing.get(productKey(item));
    if (!previous) { stats.added += 1; return item; }
    stats.updated += 1;
    return {
      ...item,
      image: previous.image || item.image,
      gallery: previous.gallery?.length ? previous.gallery : item.gallery,
      shortDescription: previous.shortDescription || item.shortDescription,
      description: previous.description || item.description,
      features: previous.features?.length ? previous.features : item.features,
      applications: previous.applications?.length ? previous.applications : item.applications,
    };
  });
  const nonSinger = current.products.filter((item) => item.brand.toUpperCase() !== brand);
  const products = [...nonSinger, ...imported].sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
  await writeFile(dataPath, `${JSON.stringify({ ...current, generatedAt: new Date().toISOString(), products }, null, 2)}\n`);

  const referencedImages = new Set(imported.map((product) => product.image).filter(Boolean));
  for (const file of await recursiveFiles(path.join(imageRoot, "singer"))) {
    if (!/\.jpe?g$/i.test(file)) continue;
    const webPath = `/${path.relative(path.join(root, "public"), file).replaceAll(path.sep, "/")}`;
    if (!referencedImages.has(webPath)) {
      await unlink(file);
      stats.removedOrphans += 1;
    }
  }

  const report = [
    "# SINGER Catalogue Import Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Official category: ${sourceCategoryUrl}`,
    "",
    `- Discovered official category records: ${stats.discovered}`,
    `- New products added: ${stats.added}`,
    `- Existing products updated: ${stats.updated}`,
    `- Duplicate products skipped: ${stats.skipped}`,
    `- JPEGs stored: ${stats.stored}`,
    `- Existing JPEGs reused: ${stats.reused}`,
    `- Missing official images: ${stats.missing}`,
    `- Interim non-sewing/orphan JPEGs removed: ${stats.removedOrphans}`,
    "",
    "## Source-backed records",
    ...imported.map((product) => `- ${product.name} — ${product.source.url}`),
    ...(stats.failures.length ? ["", "## Source failures", ...stats.failures.map((failure) => `- ${failure.modelNumber}: ${failure.reason}`)] : []),
    "",
  ].join("\n");
  await writeFile(reportPath, report);
  console.log(JSON.stringify({ ...stats, imported: imported.length, reportPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

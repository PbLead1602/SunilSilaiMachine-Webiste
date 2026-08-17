/*
 * Imports the public Answer Sewing product range from its official Wix sitemap.
 *
 * Run: node scripts/import-answer-catalogue.mjs
 *
 * It preserves source-backed model names, stores only official product images,
 * and leaves technical fields explicit when the manufacturer has not published
 * them on the product page.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brand = "ANSWER";
const verifiedAt = new Date().toISOString().slice(0, 10);
const sitemapUrl = "https://www.answersew.com/store-products-sitemap.xml";
const productRoot = path.join(root, "public", "images", "product images", "answer");
const cataloguePath = path.join(root, "data", "imported-product-catalogue.json");
const indexPath = path.join(root, "data", "product-image-index.csv");
const reportPath = path.join(root, "reports", "answer-catalogue-import-report.md");
const unavailable = "Not available from verified source";

const stats = { discovered: 0, added: 0, updated: 0, skipped: 0, imagesStored: 0, imagesReused: 0, imagesMissing: 0, failures: [] };
const imagePathsByHash = new Map();

const specifications = () => ({
  speed: unavailable,
  needleType: unavailable,
  needles: unavailable,
  threads: unavailable,
  stitchLength: unavailable,
  stitchWidth: unavailable,
  presserFootLift: unavailable,
  feedMechanism: unavailable,
  motor: unavailable,
  lubrication: unavailable,
  voltage: unavailable,
  power: unavailable,
  dimensions: unavailable,
  weight: unavailable,
  warranty: unavailable,
});

function slug(value = "") {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "model";
}

function filenamePart(value = "") {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "Model";
}

function productKey(item) {
  return `${item.brand}`.toUpperCase() + ":" + `${item.modelNumber ?? item.name}`.toUpperCase().replace(/[^A-Z0-9]+/g, "");
}

function categoryFor(name) {
  if (/over\s*lock/i.test(name)) return "overlock-interlock";
  if (/motor/i.test(name)) return "garment-machinery";
  return "domestic-machines";
}

function productTypeFor(name) {
  if (/over\s*lock/i.test(name)) return "Overlock";
  if (/motor/i.test(name)) return "Motor";
  if (/hand operated/i.test(name)) return "Hand-operated Domestic";
  if (/head/i.test(name)) return "Domestic Sewing Head";
  if (/heavy duty/i.test(name)) return "Heavy Duty Domestic";
  return "Domestic";
}

function featuresFor(name) {
  const features = ["Official Answer product listing"];
  if (/heavy duty/i.test(name)) features.push("Heavy-duty model");
  if (/hand operated/i.test(name)) features.push("Hand-operated configuration");
  if (/head/i.test(name)) features.push("Machine head configuration");
  if (/motor/i.test(name)) features.push("Motor configuration");
  if (/over\s*lock/i.test(name)) features.push("Overlock configuration");
  return features;
}

function applicationsFor(category) {
  if (category === "overlock-interlock") return ["Garment edge finishing"];
  if (category === "garment-machinery") return ["Sewing-machine drive setup"];
  return ["Home sewing", "Small tailoring setups"];
}

function decode(value = "") {
  return value
    .replace(/\\u003c/gi, "<")
    .replace(/\\u003e/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'");
}

function plainText(value = "") {
  return decode(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function metaContent(html, property) {
  const tag = (html.match(/<meta\b[^>]*>/gi) ?? []).find((candidate) => {
    const named = candidate.match(/(?:property|name)=(?:"([^"]*)"|'([^']*)')/i);
    return (named?.[1] ?? named?.[2] ?? "").toLowerCase() === property.toLowerCase();
  });
  const content = tag?.match(/content=(?:"([^"]*)"|'([^']*)')/i);
  return plainText(content?.[1] ?? content?.[2] ?? "");
}

function publishedDescription(html, name) {
  const candidates = [...html.matchAll(/"description"\s*:\s*"((?:\\.|[^"\\])*)"/g)]
    .map((match) => plainText(match[1]))
    .filter((candidate) => candidate.length >= 35 && candidate.length <= 900 && !/wix|cookie|privacy policy/i.test(candidate));
  const named = candidates.find((candidate) => candidate.toLowerCase().includes(name.toLowerCase().replace(/^answer\s+/i, "").split(" ")[0]));
  return named ?? metaContent(html, "og:description");
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "SunilSilaiMachineCatalogBot/1.0 (catalogue import)", accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

function sourceImageUrl(url) {
  const match = url.match(/^(https:\/\/static\.wixstatic\.com\/media\/[^/]+)(?:\/v1\/.*)?$/i);
  return match?.[1] ?? url;
}

async function recursiveImages(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => entry.isDirectory()
      ? recursiveImages(path.join(directory, entry.name))
      : [path.join(directory, entry.name)]));
    return files.flat();
  } catch { return []; }
}

async function preloadImageHashes() {
  for (const file of await recursiveImages(productRoot)) {
    if (!/\.jpe?g$/i.test(file)) continue;
    const buffer = await readFile(file);
    imagePathsByHash.set(createHash("sha256").update(buffer).digest("hex"), `/${path.relative(path.join(root, "public"), file).replaceAll(path.sep, "/")}`);
  }
}

async function storeImage(modelNumber, productType, sourceUrl) {
  try {
    const response = await fetch(sourceImageUrl(sourceUrl), { headers: { "user-agent": "SunilSilaiMachineCatalogBot/1.0 (catalogue import)" } });
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
    const existing = imagePathsByHash.get(hash);
    const longSide = Math.max(metadata.width ?? 0, metadata.height ?? 0);
    const notes = longSide < 1600
      ? `Official source image is ${longSide}px on its long side; preserved without artificial detail generation.`
      : "Official image converted to sRGB JPEG.";
    if (existing) {
      stats.imagesReused += 1;
      return { image: existing, notes: `Reused an identical processed official image. ${notes}` };
    }
    const folder = path.join(productRoot, slug(productType));
    await mkdir(folder, { recursive: true });
    const filename = `${filenamePart(brand)}_${filenamePart(productType)}_${filenamePart(modelNumber)}.jpg`;
    const destination = path.join(folder, filename);
    await writeFile(destination, jpeg);
    const image = `/${path.relative(path.join(root, "public"), destination).replaceAll(path.sep, "/")}`;
    imagePathsByHash.set(hash, image);
    stats.imagesStored += 1;
    return { image, notes };
  } catch (error) {
    stats.imagesMissing += 1;
    const reason = error instanceof Error ? error.message : String(error);
    stats.failures.push({ modelNumber, sourceUrl, reason });
    return { image: "", notes: `Official image could not be downloaded: ${reason}` };
  }
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<image:loc>([^<]+)<\/image:loc>[\s\S]*?<\/url>/g)]
    .map((match) => ({ productUrl: match[1].trim(), imageUrl: match[2].trim() }));
}

function csvCell(value = "") {
  const text = String(value).replace(/\r?\n/g, " ");
  return /[",]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function main() {
  await preloadImageHashes();
  const sourceProducts = parseSitemap(await fetchText(sitemapUrl))
    .sort((a, b) => Number(/-1$/.test(a.productUrl)) - Number(/-1$/.test(b.productUrl)));
  stats.discovered = sourceProducts.length;
  const current = JSON.parse(await readFile(cataloguePath, "utf8"));
  const existingByKey = new Map(current.products.map((item) => [productKey(item), item]));
  const answerRows = [];

  for (const source of sourceProducts) {
    let html = "";
    try { html = await fetchText(source.productUrl); } catch (error) { stats.failures.push({ productUrl: source.productUrl, reason: String(error) }); }
    const fallback = decodeURIComponent(new URL(source.productUrl).pathname.split("/").pop() ?? "").replaceAll("-", " ");
    const pageTitle = metaContent(html, "og:title").replace(/\s*\|\s*Answer Silai Machine\s*$/i, "") || fallback;
    const name = pageTitle.replace(/^answer(?:['â€™]s)?\s+/i, (matched) => matched.includes("'") || matched.includes("â€™") ? "Answer's " : "Answer ").trim();
    const modelNumber = name.replace(/^answer(?:['â€™]s)?\s+/i, "").trim();
    const category = categoryFor(name);
    const productType = productTypeFor(name);
    const key = productKey({ brand, modelNumber, name });
    if (answerRows.some(({ product }) => productKey(product) === key)) {
      stats.skipped += 1;
      continue;
    }
    const existing = existingByKey.get(key);
    const stored = await storeImage(modelNumber, productType, source.imageUrl);
    const descriptionFromSource = publishedDescription(html, name);
    const record = {
      slug: `answer-${slug(modelNumber)}`,
      name,
      brand,
      modelNumber,
      category,
      subcategory: productType,
      series: modelNumber,
      variant: "",
      productType,
      image: stored.image,
      gallery: stored.image ? [stored.image] : [],
      shortDescription: `Official Answer ${productType.toLowerCase()} model. Contact Sunil Silai Machine for price, availability, and configuration guidance.`,
      description: descriptionFromSource || `This Answer model is listed on the manufacturer’s official product page. Contact Sunil Silai Machine for current availability, compatible configuration, price, EMI options, and delivery details.`,
      features: featuresFor(name),
      applications: applicationsFor(category),
      specifications: specifications(),
      source: { officialSource: true, sourceType: "official product page", url: source.productUrl, brochureUrl: "", lastVerifiedAt: verifiedAt, verificationStatus: "official" },
      importNotes: stored.notes,
    };
    if (existing) {
      const merged = { ...record, ...existing, image: existing.image || record.image, gallery: existing.gallery?.length ? existing.gallery : record.gallery, source: record.source, importNotes: record.importNotes };
      existingByKey.set(key, merged);
      stats.updated += 1;
      answerRows.push({ product: merged, action: "Updated" });
    } else {
      existingByKey.set(key, record);
      stats.added += 1;
      answerRows.push({ product: record, action: "Added" });
    }
  }

  const nonAnswer = current.products.filter((item) => item.brand.toUpperCase() !== brand);
  const answerProducts = answerRows.map((row) => row.product).sort((a, b) => a.name.localeCompare(b.name));
  const allProducts = [...nonAnswer, ...answerProducts];
  await writeFile(cataloguePath, `${JSON.stringify({ ...current, generatedAt: new Date().toISOString(), products: allProducts }, null, 2)}\n`);

  const index = await readFile(indexPath, "utf8");
  const header = index.split(/\r?\n/)[0];
  const retained = index.split(/\r?\n/).slice(1).filter((line) => line && !line.startsWith(`${brand},`));
  const rows = answerRows.map(({ product, action }) => [
    brand,
    product.category,
    product.series,
    product.name,
    product.modelNumber,
    product.variant,
    product.image ? path.basename(product.image) : "",
    product.image,
    product.source.url,
    product.source.sourceType,
    product.source.verificationStatus,
    action,
    product.importNotes,
  ].map(csvCell).join(","));
  await writeFile(indexPath, `${[header, ...retained, ...rows].join("\n")}\n`);

  const report = [
    "# ANSWER Catalogue Import Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Official sitemap: ${sitemapUrl}`,
    "",
    `- Discovered official models: ${stats.discovered}`,
    `- New products added: ${stats.added}`,
    `- Existing products updated: ${stats.updated}`,
    `- Duplicate products skipped: ${stats.skipped}`,
    `- JPEGs stored: ${stats.imagesStored}`,
    `- Existing JPEGs reused: ${stats.imagesReused}`,
    `- Missing official images: ${stats.imagesMissing}`,
    "",
    "## Source-backed models",
    ...answerRows.map(({ product, action }) => `- ${action}: ${product.name} — ${product.source.url}`),
    ...(stats.failures.length ? ["", "## Source failures", ...stats.failures.map((failure) => `- ${failure.modelNumber ?? failure.productUrl}: ${failure.reason}`)] : []),
    "",
  ].join("\n");
  await writeFile(reportPath, report);
  console.log(JSON.stringify({ ...stats, productCount: answerProducts.length, reportPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
 * Official sewing-machine catalogue importer.
 *
 * It intentionally keeps unavailable technical fields explicit instead of
 * guessing them. Images are downloaded only from manufacturer/dealer sources,
 * converted to sRGB JPEG, and never generated or reconstructed.
 *
 * Run: node scripts/import-product-catalogue.mjs
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicImageRoot = path.join(root, "public", "images", "product images");
const dataRoot = path.join(root, "data");
const reportRoot = path.join(root, "reports");
const verifiedAt = new Date().toISOString().slice(0, 10);
const requestedBrands = ["ZOJE", "JACK", "USHA", "GEMINY", "QMach", "SONEX", "MODI", "NIRMA"];
const unavailable = "Not available from verified source";
const imageHashes = new Map();
const imageStats = { stored: 0, reused: 0, missing: 0, failures: [] };

const standardSpecifications = () => ({
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

function decode(value = "") {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#8211;", "–")
    .replaceAll("&#8217;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&#039;", "'")
    .replaceAll("&nbsp;", " ");
}

function text(html = "") {
  return decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function slug(value = "") {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "model";
}

function filenamePart(value = "") {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "Model";
}

function compact(value = "") {
  return value.toUpperCase().replace(/[^A-Z0-9]+/g, "");
}

function modelFromName(name, brand) {
  return name
    .replace(new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i"), "")
    .replace(/^(sewing\s+machine|machine)\s+/i, "")
    .replace(/\s+(sewing\s+machine|machine)$/i, "")
    .trim();
}

function categoryFor(value = "") {
  const normalized = value.toLowerCase();
  if (/overlock|interlock|coverstitch|flatlock|surger/.test(normalized)) return "overlock-interlock";
  if (/template|pattern|bartack|button|zigzag|cutting|iron|press|motor|automatic|special|chainstitch|bag closer|embroidery/.test(normalized)) return "garment-machinery";
  if (/domestic|straight stitch|memory craft|family|tailor|classic|deluxe|foot operated|hand operated|household/.test(normalized)) return "domestic-machines";
  return "industrial-machines";
}

function machineTypeFor(category, title) {
  const normalized = `${category} ${title}`.toLowerCase();
  if (/overlock/.test(normalized)) return "Overlock";
  if (/interlock|coverstitch|flatlock/.test(normalized)) return "Interlock";
  if (/zigzag/.test(normalized)) return "Zigzag";
  if (/buttonhole/.test(normalized)) return "Buttonhole";
  if (/button/.test(normalized)) return "Button Attach";
  if (/bartack/.test(normalized)) return "Bartack";
  if (/template/.test(normalized)) return "Template";
  if (/pattern/.test(normalized)) return "Pattern";
  if (/cutting/.test(normalized)) return "Cutting";
  if (/motor/.test(normalized)) return "Motor";
  if (/heavy|top feed/.test(normalized)) return "Heavy Duty";
  if (/domestic|straight stitch|family|tailor|classic|deluxe/.test(normalized)) return "Domestic";
  return "Lockstitch";
}

function pickSpecificationValues(sourceText = "") {
  const specs = standardSpecifications();
  const cleaned = sourceText.replace(/\s+/g, " ");
  const speed = cleaned.match(/(?:max(?:imum)?\s*(?:sewing\s*)?speed|speed)[^0-9]{0,45}(\d{3,5})\s*(?:rpm|r\.p\.m|sti\/min|stitches?\s*(?:per|\/)\s*(?:min|minute))/i) ?? cleaned.match(/(\d{3,5})\s*(?:rpm|r\.p\.m|sti\/min)/i);
  const needle = cleaned.match(/(?:needle(?:\s+system|\s+type)?)[^A-Z0-9]{0,35}([A-Z]{1,5}[×Xx-]?\d+[A-Z0-9#×Xx-]*)/i);
  const power = cleaned.match(/(\d{2,3}\s*V)\s*\/\s*(\d{2,4}\s*W)/i);
  const voltage = cleaned.match(/(?:voltage|power)[^0-9]{0,25}(\d{2,3}\s*V)/i);
  const stitchLength = cleaned.match(/(?:max(?:imum)?\s*)?stitch\s*length[^0-9]{0,25}(\d+(?:\.\d+)?\s*mm)/i);
  const stitchWidth = cleaned.match(/(?:zig\s*zag\s*)?stitch\s*width[^0-9]{0,25}(\d+(?:\.\d+)?\s*mm)/i);
  const lift = cleaned.match(/(?:presser\s*(?:foot)?\s*lift)[^0-9]{0,35}(\d+(?:\.\d+)?\s*mm)/i);
  const weight = cleaned.match(/(?:weight)[^0-9]{0,30}(\d+(?:\.\d+)?\s*(?:kg|kgs))/i);
  if (speed) specs.speed = `${speed[1]} rpm`;
  if (needle) specs.needleType = needle[1];
  if (power) { specs.voltage = power[1]; specs.power = power[2]; }
  else if (voltage) specs.voltage = voltage[1];
  if (stitchLength) specs.stitchLength = stitchLength[1];
  if (stitchWidth) specs.stitchWidth = stitchWidth[1];
  if (lift) specs.presserFootLift = lift[1];
  if (weight) specs.weight = weight[1];
  return specs;
}

async function fetchWithRetry(url, type = "text") {
  let failure;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "SunilSilaiMachineCatalogBot/1.0 (catalogue import)", accept: type === "json" ? "application/json,text/plain,*/*" : "text/html,application/xhtml+xml,*/*" } });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return type === "json" ? response.json() : response.text();
    } catch (error) {
      failure = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 650));
    }
  }
  throw new Error(`${url}: ${failure instanceof Error ? failure.message : String(failure)}`);
}

function absolute(url, base) {
  try { return new URL(url, base).toString(); } catch { return ""; }
}

function imageUrlsFromHtml(html, base) {
  const matches = [...html.matchAll(/<(?:img|source)[^>]+(?:src|data-src|srcset)=["']([^"']+)["'][^>]*>/gi)].flatMap((match) => match[1].split(",").map((entry) => entry.trim().split(/\s+/)[0]));
  return [...new Set(matches.map((item) => absolute(item, base)).filter((item) => /\.(?:jpg|jpeg|png|webp)(?:[?#].*)?$/i.test(item) && !/logo|icon|flag|ewm|wechat|youtube|facebook|instagram/i.test(item)))];
}

function primaryImageFromHtml(html, base, hint = "") {
  const productImage = html.match(/<img\b(?=[^>]*\bwp-post-image\b)[^>]*>/i)?.[0];
  if (productImage) {
    const srcset = productImage.match(/srcset=["']([^"']+)["']/i)?.[1]?.split(",").at(-1)?.trim().split(/\s+/)[0];
    const src = srcset ?? productImage.match(/src=["']([^"']+)["']/i)?.[1];
    if (src) return absolute(src, base);
  }
  const candidates = imageUrlsFromHtml(html, base);
  const key = compact(hint);
  return candidates.find((item) => key && compact(item).includes(key)) ?? candidates[0] ?? "";
}

async function imageFor({ brand, category, modelNumber, imageUrl, sourceUrl }) {
  if (!imageUrl) {
    imageStats.missing += 1;
    return { image: "", note: "No clean image URL was available from the verified source." };
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
    if (imageHashes.has(hash)) {
      imageStats.reused += 1;
      return { image: imageHashes.get(hash), note: "Reused an identical processed official image." };
    }
    const brandFolder = slug(brand);
    const typeFolder = slug(machineTypeFor(category, modelNumber));
    const directory = path.join(publicImageRoot, brandFolder, typeFolder);
    await mkdir(directory, { recursive: true });
    const filename = `${filenamePart(brand)}_${filenamePart(machineTypeFor(category, modelNumber))}_${filenamePart(modelNumber)}.jpg`;
    const destination = path.join(directory, filename);
    await writeFile(destination, jpeg);
    const webPath = `/${path.relative(path.join(root, "public"), destination).replaceAll(path.sep, "/")}`;
    imageHashes.set(hash, webPath);
    imageStats.stored += 1;
    const longSide = Math.max(metadata.width ?? 0, metadata.height ?? 0);
    return { image: webPath, note: longSide < 1600 ? `Official source image is ${longSide}px on its long side; preserved without artificial detail generation.` : "Official image converted to sRGB JPEG." };
  } catch (error) {
    imageStats.missing += 1;
    const reason = error instanceof Error ? error.message : String(error);
    imageStats.failures.push({ brand, modelNumber, sourceUrl, imageUrl, reason });
    return { image: "", note: `Image could not be downloaded from the source: ${reason}` };
  }
}

function record({ brand, name, modelNumber, category, series = "", variant = "", productType = "", shortDescription = "", description = "", features = [], applications = [], specifications, image = "", sourceUrl, sourceType, officialSource, verificationStatus, brochureUrl = "", notes = "" }) {
  const cleanModel = modelNumber || modelFromName(name, brand) || name;
  const machineType = productType || machineTypeFor(category, `${name} ${cleanModel}`);
  return {
    slug: `${slug(brand)}-${slug(cleanModel)}`,
    name: name.startsWith(brand) ? name : `${brand} ${name}`,
    brand,
    modelNumber: cleanModel,
    category,
    subcategory: machineType,
    series: series || cleanModel,
    variant,
    productType: machineType,
    image,
    gallery: image ? [image] : [],
    shortDescription: shortDescription || `Verified ${brand} ${machineType.toLowerCase()} model. Contact Sunil Silai Machine for availability and specification guidance.`,
    description: description || `This ${brand} model is listed by the verified source. Contact Sunil Silai Machine for current availability, compatible configuration, price, EMI options, and delivery details.`,
    features: features.length ? features : ["Verified model listing"],
    applications,
    specifications: specifications ?? standardSpecifications(),
    source: { officialSource, sourceType, url: sourceUrl, brochureUrl, lastVerifiedAt: verifiedAt, verificationStatus },
    importNotes: notes,
  };
}

async function mapLimit(items, limit, worker) {
  const results = [];
  let next = 0;
  async function runner() {
    while (next < items.length) {
      const current = next;
      next += 1;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
  return results;
}

async function importGeminy() {
  const sections = [
    ["industrial-machines", "industrial-machines"],
    ["domestic-machines", "domestic-machines"],
    ["semi-industrial-sewing-machine", "industrial-machines"],
  ];
  const links = new Map();
  for (const [section, category] of sections) {
    const base = `https://www.geminy.in/${section}`;
    const html = await fetchWithRetry(base);
    for (const match of html.matchAll(/href=["'](?:\.\/)?([^"'#?]+)["']/gi)) {
      const href = match[1];
      if (!/geminy|three-star|premier|gem-8100/i.test(href) || /industrial-machines|domestic-machines|semi-industrial/i.test(href)) continue;
      const productUrl = absolute(href, base);
      if (!productUrl || !new URL(productUrl).hostname.endsWith("geminy.in")) continue;
      links.set(productUrl, category);
    }
  }
  return mapLimit([...links.entries()], 4, async ([url, category]) => {
    const fallbackName = path.basename(new URL(url).pathname).replaceAll("-", " ");
    try {
      const html = await fetchWithRetry(url);
      const heading = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "") || text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/\s*[–-]\s*Geminy.*$/i, "");
      const name = heading || fallbackName;
      const modelNumber = modelFromName(name, "Geminy");
      const sourceText = text(html);
      const sourceImage = primaryImageFromHtml(html, url, modelNumber);
      const media = await imageFor({ brand: "Geminy", category, modelNumber, imageUrl: sourceImage, sourceUrl: url });
      return record({ brand: "Geminy", name, modelNumber, category: categoryFor(`${category} ${name}`), shortDescription: sourceText.slice(0, 330), description: sourceText.slice(0, 1200), specifications: pickSpecificationValues(sourceText), image: media.image, sourceUrl: url, sourceType: "official product page", officialSource: true, verificationStatus: "official", notes: media.note });
    } catch (error) {
      return record({ brand: "Geminy", name: fallbackName, modelNumber: modelFromName(fallbackName, "Geminy"), category, sourceUrl: url, sourceType: "official product page", officialSource: true, verificationStatus: "official", notes: `Source page could not be fetched during import: ${error instanceof Error ? error.message : String(error)}` });
    }
  });
}

async function importQmach() {
  const url = "https://www.qmach.net/shop";
  const html = await fetchWithRetry(url);
  const items = [];
  for (const match of html.matchAll(/<div\s+data-slug=["']([^"']+)["'][\s\S]*?<a\s+href=["']([^"']+)["'][\s\S]*?data-image-info=["']([^"']+)["']/gi)) {
    const [, itemSlug, productUrl, encodedImage] = match;
    let imageUrl = "";
    try {
      const info = JSON.parse(decode(encodedImage));
      const uri = info?.imageData?.uri ?? "";
      imageUrl = uri ? `https://static.wixstatic.com/media/${uri.split("/v1/")[0]}` : "";
    } catch { /* record stays usable even when Wix changes its image format */ }
    const cardEnd = html.indexOf("</li>", match.index);
    const card = html.slice(match.index, cardEnd > 0 ? cardEnd : match.index + 4000);
    const name = decode(card.match(/aria-label=["']([^"']+?)\s+gallery["']/i)?.[1] ?? itemSlug.replaceAll("-", " ")).replace(/\.\s*(best seller|new arrival)$/i, "").trim();
    items.push({ name, itemSlug, productUrl, imageUrl });
  }
  const unique = [...new Map(items.map((item) => [item.itemSlug, item])).values()];
  return mapLimit(unique, 4, async (item) => {
    const modelNumber = modelFromName(item.name, "QMach");
    const category = categoryFor(item.name);
    const media = await imageFor({ brand: "QMach", category, modelNumber, imageUrl: item.imageUrl, sourceUrl: item.productUrl });
    return record({ brand: "QMach", name: item.name, modelNumber, category, shortDescription: `Official QMach shop listing: ${item.name}.`, image: media.image, sourceUrl: item.productUrl, sourceType: "official product page", officialSource: true, verificationStatus: "official", notes: media.note });
  });
}

async function importUsha() {
  const endpoints = [
    "https://www.ushasew.com/wp-json/wc/store/v1/products?per_page=100",
    "https://www.ushasew.com/wp-json/wp/v2/product?per_page=100",
  ];
  let items = [];
  for (const endpoint of endpoints) {
    try {
      const result = await fetchWithRetry(endpoint, "json");
      if (Array.isArray(result) && result.length) { items = result; break; }
    } catch { /* Try the next public endpoint. */ }
  }
  if (!items.length) throw new Error("USHA public product API returned no parseable products.");
  return mapLimit(items, 4, async (item) => {
    const name = text(item.name ?? item.title?.rendered ?? "USHA model");
    const productUrl = item.permalink ?? item.link ?? `https://www.ushasew.com/${item.slug ?? slug(name)}/`;
    const description = text(item.description ?? item.content?.rendered ?? item.short_description ?? "");
    const categories = (item.categories ?? []).map((category) => category.name ?? category).join(" ");
    const imageUrl = item.images?.[0]?.src ?? item.images?.[0]?.thumbnail ?? item.yoast_head_json?.og_image?.[0]?.url ?? "";
    const modelNumber = modelFromName(name, "USHA");
    const category = categoryFor(`${categories} ${name}`);
    const media = await imageFor({ brand: "USHA", category, modelNumber, imageUrl, sourceUrl: productUrl });
    return record({ brand: "USHA", name, modelNumber, category, shortDescription: description.slice(0, 330), description: description.slice(0, 1800), specifications: pickSpecificationValues(description), image: media.image, sourceUrl: productUrl, sourceType: "official product API", officialSource: true, verificationStatus: "official", notes: media.note });
  });
}

async function importJack() {
  const homepage = "https://www.jack-sewing.com/index.html";
  const html = await fetchWithRetry(homepage);
  const found = new Map();
  for (const match of html.matchAll(/(?:href=["'])((?:\.\.\/)?(?:lockstitch|overlock|interlock|heavy-duty|postbed|zigzag|special|template|ironing|automatic|motors)\/jack-[^"']+?\/index\.html)["']/gi)) {
    const rel = match[1].replace(/^(?:\.\.\/)+/, "");
    const [section] = rel.split("/");
    found.set(rel, { section, url: `https://www.jack-sewing.com/${rel}` });
  }
  return mapLimit([...found.values()], 4, async ({ section, url }) => {
    const fallbackModel = path.basename(path.dirname(new URL(url).pathname)).replace(/^jack-/i, "");
    const category = categoryFor(`${section} ${fallbackModel}`);
    try {
      const page = await fetchWithRetry(url);
      const heading = text(page.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "") || fallbackModel;
      const name = heading.replace(/^Jack\s+/i, "");
      const modelNumber = modelFromName(name, "JACK");
      const sourceText = text(page);
      const sourceImage = primaryImageFromHtml(page, url, compact(modelNumber));
      const media = await imageFor({ brand: "JACK", category, modelNumber, imageUrl: sourceImage, sourceUrl: url });
      return record({ brand: "JACK", name, modelNumber, category, shortDescription: `Official JACK ${section.replaceAll("-", " ")} model.`, description: sourceText.slice(0, 1500), specifications: pickSpecificationValues(sourceText), image: media.image, sourceUrl: url, sourceType: "official product page", officialSource: true, verificationStatus: "official", notes: media.note });
    } catch (error) {
      return record({ brand: "JACK", name: fallbackModel, modelNumber: fallbackModel, category, sourceUrl: url, sourceType: "official product page", officialSource: true, verificationStatus: "official", notes: `Source page could not be fetched during import: ${error instanceof Error ? error.message : String(error)}` });
    }
  });
}

const zojeCategoryUrls = ["straight", "overlock", "cover", "twin", "special", "heavy", "automation", "zigzag", "../products_2", "../products_4"];

async function importZoje() {
  const found = new Map();
  for (const section of zojeCategoryUrls) {
    const url = section.startsWith("..") ? `https://www.zoje.com/${section.replace("../", "")}/` : `https://www.zoje.com/products/${section}/`;
    const html = await fetchWithRetry(url);
    for (const match of html.matchAll(/href=["'](\/products\/(?:straight|overlock|cover|twin|special|heavy|automation|zigzag)\/[^"']+?\.html)["']/gi)) found.set(match[1], `https://www.zoje.com${match[1]}`);
  }
  return mapLimit([...found.values()], 4, async (url) => {
    const page = await fetchWithRetry(url);
    const routeModel = path.basename(new URL(url).pathname, ".html");
    const sourceText = text(page);
    const firstColumn = [...page.matchAll(/<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => text(match[1])).filter((value) => compact(value).startsWith(compact(routeModel).slice(0, 3))).slice(0, 30);
    const variants = [...new Set(firstColumn.length ? firstColumn : [routeModel])];
    const section = new URL(url).pathname.split("/")[2] ?? "special";
    const category = categoryFor(`${section} ${routeModel}`);
    // ZOJE product pages often include a global promotional image before the
    // machine media. Use an image only when its source name identifies the
    // requested series; an unmatched graphic must never be assigned to a
    // different model.
    const sourceImage = imageUrlsFromHtml(page, url).find((candidate) => compact(candidate).includes(compact(routeModel))) ?? "";
    const media = await imageFor({ brand: "ZOJE", category, modelNumber: routeModel, imageUrl: sourceImage, sourceUrl: url });
    return variants.map((variant) => record({ brand: "ZOJE", name: `${variant} ${machineTypeFor(category, `${section} ${variant}`)}`, modelNumber: variant, category, series: routeModel, variant: variant === routeModel ? "" : variant, shortDescription: `Official ZOJE ${section} series model.`, description: "Official ZOJE product listing. Configuration-dependent parameters should be confirmed against the linked source before purchase.", specifications: pickSpecificationValues(sourceText), image: media.image, sourceUrl: url, sourceType: "official product page", officialSource: true, verificationStatus: "official", notes: media.note }));
  }).then((groups) => groups.flat());
}

const sonexFallback = {
  "Button Hole & Button Stitch": ["SX 818D", "SX 373", "SX 1377D", "SX 781EF", "SX 1790", "SX 9820"],
  "Cutting Machine": ["SX-110S", "SX-90DS", "SX-DB-1", "SX-CZD-3A-EASTMAN", "SX-103-KM"],
  "Multi Needle": ["SX 8842D", "SX 1509P-D", "SX 1508P-D", "SX 4408PMD", "SX 1408P-D", "SX 1411PSF", "SX-2000C", "SX 1404PMD", "SX-1412P"],
  "Double Needle Lockstitch Machine": ["SX-20528", "SX-20518", "SX 8420D/SX 8450D", "SX 8720D", "SX 8750D", "SX-842-3/5"],
  "Bartack & Pattern": ["SX 1965", "SX 1965-EJ", "SX 430D"],
  "Inter Lock Machine": ["SX 664D-35BB-UT", "SX-F858K", "SX-F007-W122-356", "SX 720", "SX-500D-05", "F1"],
  "Heavy Duty": ["SX U 1191-7SS", "SX 1341-7AT", "SX 1341", "SX 0358D-CQ", "SX 341", "SX 335H", "H8", "SX-0303D", "SX 0303", "SX 202"],
  "Single Needle Lockstitch": ["B-3 Computerised 3 Function High Speed Direct Drive Single Needle Lockstitch UBT", "B1-Q High Speed Direct Drive Single Needle Lockstitch Sewing Machine", "S1-2 High Speed Direct Drive Single Needle Lockstitch Sewing Machine (With Auto Trimmer)", "B2-Q High Speed Direct Drive Single Needle Lockstitch Sewing Machine (With Auto Trimmer)", "S1 High Speed Direct Drive Single Needle Lockstitch Sewing Machine", "B22", "B20", "SX-9100", "SX-5200D"],
  "Over Lock Machine": ["SX 6804D/5D", "SX 786-4D", "SX 786-5D", "H8A-5H", "SX-786-6D", "H7-4EUT"],
  "Special Machine": ["SX 1790", "SX 9820", "SX-1903ASS", "SX-1900ASS", "SX-1850", "SX-1508P", "SX-1302 5W", "SX-1302 4W", "SX-928 PL", "SX-783"],
  Zigzag: ["SX 6530D", "SX 2284D", "SX 1530D"],
};

async function importSonex() {
  const url = "https://sonexnew.sonexsewingmachine.com/about-us/";
  let collections = sonexFallback;
  try {
    const html = await fetchWithRetry(url);
    const parsed = {};
    for (const match of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi)) {
      const productType = text(match[1]);
      const models = [...match[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((item) => text(item[1])).filter((name) => name && name.length <= 160);
      if (models.length) parsed[productType] = models;
    }
    if (Object.keys(parsed).length) collections = parsed;
  } catch { /* Use names recorded from the official category page during discovery. */ }
  return Object.entries(collections).flatMap(([productType, models]) => models.map((name) => record({ brand: "SONEX", name, modelNumber: modelFromName(name, "SONEX"), category: categoryFor(productType), productType, shortDescription: `Official SONEX ${productType.toLowerCase()} listing.`, description: "This SONEX model is listed on the manufacturer’s official product-category page. Technical specifications and a standalone official image were not available on that page at import time.", sourceUrl: url, sourceType: "official manufacturer category page", officialSource: true, verificationStatus: "official", notes: "No model-specific clean official image available; no substitute image was used." })));
}

function importModi() {
  const source = "https://www.navbharatmachine.com/household-and-semi-industrial-machine?lang=hi";
  return [
    record({ brand: "MODI", name: "Link Model", modelNumber: "Link Model", category: "domestic-machines", productType: "Domestic", shortDescription: "Dealer-listed Modi Link straight-stitch machine.", description: "Dealer documentation describes a heavy-duty straight-stitch machine with forward/reverse feed and a closed shuttle race. Verify current configuration before sale.", features: ["Straight stitch", "Forward and reverse feed", "Closed shuttle race"], sourceUrl: "https://www.navbharatmachine.com/product-page/modi-link-model", sourceType: "dealer product page", officialSource: false, verificationStatus: "dealer-verified", notes: "One reliable dealer source; needs manufacturer confirmation." }),
    record({ brand: "MODI", name: "Zigzag Gear Sewing Machine", modelNumber: "Zigzag Gear", category: "garment-machinery", productType: "Zigzag", shortDescription: "Dealer-listed Modi zigzag gear machine.", sourceUrl: source, sourceType: "dealer category page", officialSource: false, verificationStatus: "unverified", notes: "Needs manual manufacturer verification; no clean model-specific source image was used." }),
    record({ brand: "MODI", name: "Overlock Sewing Machine", modelNumber: "Overlock", category: "overlock-interlock", productType: "Overlock", shortDescription: "Dealer-listed Modi overlock machine.", sourceUrl: source, sourceType: "dealer category page", officialSource: false, verificationStatus: "unverified", notes: "Needs manual manufacturer verification; no clean model-specific source image was used." }),
  ];
}

function canonicalKey(product) {
  const label = `${product.modelNumber || ""} ${product.name || ""}`
    .toLowerCase()
    .replace(new RegExp(product.brand.toLowerCase(), "g"), "")
    .replace(/sewing\s*machine|machine|series|model|lockstitch|direct\s*drive|high\s*speed|single\s*needle|industrial|official/g, "")
    .replace(/[^a-z0-9]+/g, "");
  return `${product.brand.toLowerCase()}|${label}`;
}

function dedupe(products) {
  const merged = new Map();
  for (const product of products) {
    const key = canonicalKey(product);
    const current = merged.get(key);
    if (!current) { merged.set(key, product); continue; }
    const richer = current.image ? current : product;
    const secondary = richer === current ? product : current;
    merged.set(key, { ...richer, features: [...new Set([...richer.features, ...secondary.features])], applications: [...new Set([...richer.applications, ...secondary.applications])], importNotes: [richer.importNotes, secondary.importNotes].filter(Boolean).join(" | ") });
  }
  return [...merged.values()].sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
}

function csvEscape(value) {
  const textValue = String(value ?? "");
  return /[",\n]/.test(textValue) ? `"${textValue.replaceAll('"', '""')}"` : textValue;
}

async function ensureFolders() {
  await Promise.all([dataRoot, reportRoot, ...requestedBrands.map((brand) => path.join(publicImageRoot, slug(brand)))].map((directory) => mkdir(directory, { recursive: true })));
  for (const brand of requestedBrands) {
    const directory = path.join(publicImageRoot, slug(brand));
    for (const machineType of ["domestic", "lockstitch", "overlock", "interlock", "zigzag", "bartack", "buttonhole", "template", "pattern", "heavy-duty", "cutting", "special-purpose"]) await mkdir(path.join(directory, machineType), { recursive: true });
  }
}

async function main() {
  await ensureFolders();
  const tasks = [
    ["ZOJE", importZoje], ["JACK", importJack], ["USHA", importUsha], ["Geminy", importGeminy], ["QMach", importQmach], ["SONEX", importSonex], ["MODI", importModi],
  ];
  const collected = [];
  const failures = [];
  for (const [brand, importer] of tasks) {
    process.stdout.write(`Importing ${brand}...\n`);
    try { collected.push(...await importer()); }
    catch (error) { failures.push({ brand, reason: error instanceof Error ? error.message : String(error) }); }
  }
  const products = dedupe(collected);
  const payload = { generatedAt: new Date().toISOString(), products };
  await writeFile(path.join(dataRoot, "imported-product-catalogue.json"), `${JSON.stringify(payload, null, 2)}\n`);
  const indexRows = [["Brand", "Category", "Series", "Model Name", "Model Number", "Variant", "Image Filename", "Local Image Path", "Official Product URL", "Source Type", "Verification Status", "Added / Updated / Skipped", "Notes"]];
  for (const product of products) indexRows.push([product.brand, product.category, product.series, product.name, product.modelNumber, product.variant, product.image ? path.basename(product.image) : "", product.image, product.source.url, product.source.sourceType, product.source.verificationStatus, "Added", product.importNotes]);
  await writeFile(path.join(dataRoot, "product-image-index.csv"), `${indexRows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`);
  const byBrand = Object.fromEntries(requestedBrands.map((brand) => [brand, products.filter((product) => product.brand.toLowerCase() === brand.toLowerCase())]));
  const report = [
    "# Product Import Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "| Brand | Discovered / imported | JPEGs mapped | Missing official images | Verification notes |",
    "| --- | ---: | ---: | ---: | --- |",
    ...requestedBrands.map((brand) => {
      const records = byBrand[brand]; const images = records.filter((record) => record.image).length; const missing = records.length - images;
      const note = brand === "NIRMA" ? "No reliable sewing-machine source found; no products added." : records.some((record) => record.source.verificationStatus !== "official") ? "Includes records needing manual verification." : "Official source records.";
      return `| ${brand} | ${records.length} | ${images} | ${missing} | ${note} |`;
    }),
    "",
    `Total product records: ${products.length}`,
    `JPEG files stored: ${imageStats.stored}`,
    `Identical images reused: ${imageStats.reused}`,
    `Image download failures / unavailable source images: ${imageStats.missing}`,
    `Source failures: ${failures.length}`,
    "",
    "## Source failures",
    ...(failures.length ? failures.map((failure) => `- ${failure.brand}: ${failure.reason}`) : ["- None"]),
    "",
    "## Image failures",
    ...(imageStats.failures.length ? imageStats.failures.map((failure) => `- ${failure.brand} ${failure.modelNumber}: ${failure.reason} (${failure.imageUrl})`) : ["- None"]),
    "",
    "## Verification policy",
    "- `official`: official manufacturer page or public first-party product API.",
    "- `dealer-verified`: a dealer source was available, but no official product source was located.",
    "- `unverified`: retained only because a relevant dealer category listed the model; requires manual confirmation.",
    "- Nirma has no product records because no reliable sewing-machine source was located.",
  ].join("\n");
  await writeFile(path.join(reportRoot, "product-import-report.md"), `${report}\n`);
  console.log(JSON.stringify({ records: products.length, imageStats, failures }, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });

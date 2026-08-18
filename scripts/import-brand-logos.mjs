import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const outputDirectory = path.join(projectRoot, "public", "images", "brand-logos");
const suppliedLogoDirectory = path.join(outputDirectory, "source");
const manifestPath = path.join(projectRoot, "data", "brand-logo-manifest.json");

const sources = [
  { brand: "ZOJE", file: "zoje.webp", url: "https://www.zoje.com/static/images/logor.svg", sourceType: "official website" },
  { brand: "JACK", file: "jack.webp", localSource: "jack-user-supplied.png", sourceType: "user-supplied logo artwork" },
  { brand: "USHA", file: "usha.webp", url: "https://www.ushasew.com/wp-content/uploads/2018/08/logo.png", sourceType: "official website" },
  { brand: "NIRMA", file: "nirma.webp", localSource: "nirma-user-supplied.png", sourceType: "user-supplied logo artwork" },
  { brand: "MODI", file: "modi.webp", localSource: "modi-user-supplied.png", sourceType: "user-supplied logo artwork" },
  { brand: "GEMINY", file: "geminy.webp", url: "https://www.geminy.in/wp-content/uploads/2022/08/geminy-1.png", sourceType: "official website" },
  { brand: "QMach", file: "qmach.webp", url: "https://static.wixstatic.com/media/49c2a6_7c696230d4a14108b9f3f4496642efaa~mv2.png", sourceType: "official website" },
  { brand: "MESSER", file: "messer.webp", url: "https://in.messer-cutting.com/typo3conf/ext/messer_cutting_systems_global_web_styles/Resources/Public/Images/MCS_Logo_rgb.svg", sourceType: "official website" },
  { brand: "ANSWER", file: "answer.webp", url: "https://static.wixstatic.com/media/49c2a6_760a6609927243ec9459e68d26733e1b~mv2.png", sourceType: "official website" },
  { brand: "SINGER", file: "singer.webp", url: "https://shop.singerindia.com/wp-content/uploads/sites/2/2025/09/Untitled-1.png", sourceType: "official website" },
];

function fallbackWordmark(brand) {
  return Buffer.from(`
    <svg width="1200" height="480" viewBox="0 0 1200 480" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="480" fill="#FAF8F5"/>
      <text x="600" y="272" text-anchor="middle" fill="#2F241F" font-family="Arial, sans-serif" font-size="126" font-weight="700" letter-spacing="4">${brand}</text>
    </svg>
  `);
}

async function sourceBuffer(source) {
  if (source.localSource) return readFile(path.join(suppliedLogoDirectory, source.localSource));

  const response = await fetch(source.url, { headers: { "user-agent": "Sunil-Silai-Machine catalogue asset importer" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  if (!source.pageDataUri) return Buffer.from(await response.arrayBuffer());

  const html = await response.text();
  const match = html.match(/data:image\/png;base64,([A-Za-z0-9+/=]{100,})/);
  if (!match) throw new Error("No usable trademark image was found on the source page.");
  return Buffer.from(match[1], "base64");
}

async function createLogo(source) {
  let input;
  let fallback = false;
  try {
    input = await sourceBuffer(source);
  } catch (error) {
    if (!source.fallbackText) throw error;
    input = fallbackWordmark(source.fallbackText);
    fallback = true;
  }

  const target = path.join(outputDirectory, source.file);
  await sharp(input, { density: 300, limitInputPixels: false })
    .trim({ background: { r: 250, g: 248, b: 245, alpha: 0 } })
    .resize({ width: 1600, height: 640, fit: "contain", background: { r: 250, g: 248, b: 245, alpha: 0 }, withoutEnlargement: false })
    .webp({ quality: 96, effort: 6, smartSubsample: true })
    .toFile(target);

  const metadata = await sharp(target).metadata();
  return {
    brand: source.brand,
    localPath: `/images/brand-logos/${source.file}`,
    sourceUrl: source.url ?? `Local source: /images/brand-logos/source/${source.localSource}`,
    sourceType: source.sourceType,
    processing: "Trimmed and rendered as a 1600px-wide transparent WebP without altering the logo artwork.",
    dimensions: `${metadata.width}x${metadata.height}`,
    verificationStatus: fallback ? "fallback-wordmark" : "source-verified",
  };
}

await mkdir(outputDirectory, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });
const manifest = [];

for (const source of sources) {
  process.stdout.write(`Processing ${source.brand} logo... `);
  const result = await createLogo(source);
  manifest.push(result);
  process.stdout.write(`${result.dimensions}\n`);
}

await writeFile(manifestPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), logos: manifest }, null, 2)}\n`);
console.log(`Saved ${manifest.length} local brand logos to ${outputDirectory}`);

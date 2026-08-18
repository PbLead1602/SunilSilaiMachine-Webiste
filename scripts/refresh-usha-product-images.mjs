/*
 * Conservatively prepares the already-mapped, clean USHA machine photographs
 * for product cards and zoom views. It intentionally does not use generative
 * reconstruction: model labels, colours, and machine parts remain untouched.
 *
 * Run: node scripts/refresh-usha-product-images.mjs
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assetDirectory = path.join(root, "public", "images", "product images", "usha");
const reportPath = path.join(root, "data", "usha-image-refresh-report.json");
const sourcePackage = "D:\\projects\\sunil silai machine website\\images\\product images\\usha";

async function imageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return imageFiles(target);
    return /\.(?:jpe?g|png|webp)$/i.test(entry.name) ? [target] : [];
  }));
  return files.flat();
}

const files = await imageFiles(assetDirectory);
const results = [];

for (const file of files) {
  const input = await readFile(file);
  const metadata = await sharp(input).metadata();
  const sourceLongSide = Math.max(metadata.width ?? 0, metadata.height ?? 0);
  const output = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", kernel: sharp.kernel.lanczos3, withoutEnlargement: false })
    .sharpen({ sigma: 0.45, m1: 0.15, m2: 0.05 })
    .toColourspace("srgb")
    .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

  await writeFile(file, output);
  const refreshed = await sharp(output).metadata();
  results.push({
    path: `/${path.relative(path.join(root, "public"), file).replaceAll(path.sep, "/")}`,
    sourceDimensions: `${metadata.width}x${metadata.height}`,
    outputDimensions: `${refreshed.width}x${refreshed.height}`,
    sourceLongSide,
  });
}

await writeFile(reportPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  sourcePackage,
  strategy: "Retained the existing clean, model-matched product images; upscaled with Lanczos3, applied a restrained detail pass, converted to sRGB, and encoded as JPEG at quality 95 without generating or altering machine details.",
  imageCount: results.length,
  images: results,
}, null, 2)}\n`);

console.log(`Refreshed ${results.length} USHA product images at ${assetDirectory}`);

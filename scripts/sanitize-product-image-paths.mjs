/* Normalizes generated product JPEG file names for predictable Next image optimization. */
import { access, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const dataFile = path.join(root, "data", "imported-product-catalogue.json");
const data = JSON.parse(await readFile(dataFile, "utf8"));
const pathMap = new Map();

function asciiFilename(filename) {
  const extension = path.extname(filename).toLowerCase() || ".jpg";
  const stem = path.basename(filename, path.extname(filename))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "product";
  return `${stem}${extension}`;
}

async function fileExists(file) { try { await access(file); return true; } catch { return false; } }

for (const product of data.products) {
  if (!product.image || pathMap.has(product.image)) continue;
  const oldPath = product.image;
  const oldFile = path.join(publicRoot, ...oldPath.replace(/^\//, "").split("/"));
  const newName = asciiFilename(path.basename(oldFile));
  const newFile = path.join(path.dirname(oldFile), newName);
  const newPath = `/${path.relative(publicRoot, newFile).replaceAll(path.sep, "/")}`;
  if (oldFile !== newFile && await fileExists(oldFile)) {
    if (!(await fileExists(newFile))) await rename(oldFile, newFile);
    pathMap.set(oldPath, newPath);
  } else pathMap.set(oldPath, oldPath);
}

for (const product of data.products) {
  if (product.image) product.image = pathMap.get(product.image) ?? product.image;
  product.gallery = product.gallery.map((image) => pathMap.get(image) ?? image);
}

data.sanitizedImagePathsAt = new Date().toISOString();
await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ renamed: [...pathMap.entries()].filter(([from, to]) => from !== to).length }, null, 2));

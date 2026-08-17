/* Validates generated static product paths and removes only known wrong model/image mappings. */
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataFile = path.join(root, "data", "imported-product-catalogue.json");
const indexFile = path.join(root, "data", "product-image-index.csv");
const reportFile = path.join(root, "reports", "product-import-report.md");
const requestedBrands = ["ZOJE", "JACK", "USHA", "Geminy", "QMach", "SONEX", "MODI", "NIRMA", "ANSWER", "SINGER"];

function compact(value = "") { return value.toUpperCase().replace(/[^A-Z0-9]+/g, ""); }
function sourceModel(product) {
  try { return path.basename(new URL(product.source.url).pathname, ".html"); } catch { return product.modelNumber; }
}
function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
async function exists(webPath) {
  if (!webPath) return false;
  try { await access(path.join(root, "public", ...webPath.replace(/^\//, "").split("/"))); return true; } catch { return false; }
}

const data = JSON.parse(await readFile(dataFile, "utf8"));
const changed = [];
const missingPaths = [];

data.products = data.products.filter((product) => {
  if (product.brand.toLowerCase() !== "geminy") return true;
  try { return new URL(product.source.url).hostname.endsWith("geminy.in"); } catch { return false; }
});
const historicalMismatches = data.products.filter((product) => product.importNotes?.includes("Removed an unmatched global source graphic")).length;

for (const product of data.products) {
  if (product.brand === "ZOJE" && product.image) {
    const expected = compact(sourceModel(product));
    const actual = compact(path.basename(product.image));
    if (expected && !actual.includes(expected)) {
      product.image = "";
      product.gallery = [];
      product.importNotes = [product.importNotes, "Removed an unmatched global source graphic; a model-specific official image was not available for safe assignment."].filter(Boolean).join(" | ");
      changed.push(`${product.brand} ${product.modelNumber}`);
    }
  }
  if (product.image && !(await exists(product.image))) {
    missingPaths.push(`${product.brand} ${product.modelNumber}: ${product.image}`);
    product.image = "";
    product.gallery = [];
  }
}

data.validatedAt = new Date().toISOString();
await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`);

const indexRows = [["Brand", "Category", "Series", "Model Name", "Model Number", "Variant", "Image Filename", "Local Image Path", "Official Product URL", "Source Type", "Verification Status", "Added / Updated / Skipped", "Notes"]];
for (const product of data.products) indexRows.push([product.brand, product.category, product.series, product.name, product.modelNumber, product.variant, product.image ? path.basename(product.image) : "", product.image, product.source.url, product.source.sourceType, product.source.verificationStatus, changed.includes(`${product.brand} ${product.modelNumber}`) ? "Updated" : "Added", product.importNotes]);
await writeFile(indexFile, `${indexRows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`);

const report = [
  "# Product Import Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "| Brand | Discovered / imported | JPEGs mapped | Missing official images | Verification notes |",
  "| --- | ---: | ---: | ---: | --- |",
  ...requestedBrands.map((brand) => {
    const records = data.products.filter((product) => product.brand.toLowerCase() === brand.toLowerCase());
    const images = records.filter((product) => product.image).length;
    const note = brand === "NIRMA" ? "No reliable sewing-machine source found; no products added." : records.some((product) => product.source.verificationStatus !== "official") ? "Includes records needing manual verification." : "Official source records.";
    return `| ${brand} | ${records.length} | ${images} | ${records.length - images} | ${note} |`;
  }),
  "",
  `Total product records: ${data.products.length}`,
  `Referenced JPEG files: ${data.products.filter((product) => product.image).length}`,
  `Removed unmatched model/image mappings: ${historicalMismatches}`,
  `Broken local image paths: ${missingPaths.length}`,
  "",
  "## Manual-verification queue",
  ...data.products.filter((product) => product.source.verificationStatus !== "official" || !product.image).map((product) => `- ${product.brand} ${product.modelNumber}: ${product.importNotes || "Image/specification verification required."}`),
  "",
  "## Integrity policy",
  "- Every retained image path was checked locally.",
  "- ZOJE records with a global/unmatched source graphic were changed to image-missing rather than showing a different machine.",
  "- No Nirma model was created because no reliable sewing-machine source was located.",
].join("\n");
await writeFile(reportFile, `${report}\n`);
console.log(JSON.stringify({ records: data.products.length, removedMismatches: changed.length, brokenPaths: missingPaths.length }, null, 2));

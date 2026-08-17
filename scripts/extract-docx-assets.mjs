import AdmZip from "adm-zip";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const source = resolve(process.argv[2] ?? "../project details.docx");
const destination = resolve(process.argv[3] ?? "public/imported-docx-assets");
const archive = new AdmZip(source);
const entries = archive.getEntries().filter((entry) => entry.entryName.startsWith("word/media/") && !entry.isDirectory);
await mkdir(destination, { recursive: true });
await Promise.all(entries.map((entry) => writeFile(resolve(destination, basename(entry.entryName)), entry.getData())));
console.log(`Extracted ${entries.length} media files to ${destination}`);

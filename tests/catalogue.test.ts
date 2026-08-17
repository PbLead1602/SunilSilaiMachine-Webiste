import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { categories, products } from "../lib/business";
import { productMatches } from "../lib/catalogue-utils";

describe("catalogue seed data", () => {
  it("maps every product to an existing category", () => {
    const slugs = new Set(categories.map((category) => category.slug));
    expect(products.every((product) => slugs.has(product.category))).toBe(true);
  });
  it("does not fabricate a public price", () => {
    expect(products.every((product) => !("price" in product))).toBe(true);
  });
  it("has unique product slugs after the import merge", () => {
    expect(new Set(products.map((product) => product.slug)).size).toBe(products.length);
  });
  it("references only local image files that exist", () => {
    const referenced = products.flatMap((product) => [product.image, ...product.gallery].filter(Boolean) as string[]);
    expect(referenced.every((image) => existsSync(path.join(process.cwd(), "public", image.replace(/^\//, ""))))).toBe(true);
  });
  it("searches imported model numbers", () => {
    const model = products.find((product) => product.modelNumber && /^B9500-13/i.test(product.modelNumber));
    expect(model).toBeDefined();
    expect(productMatches(model!, "B9500-13")).toBe(true);
  });
});

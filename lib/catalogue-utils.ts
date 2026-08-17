import type { Product } from "@/lib/types";

export function productSearchText(product: Product) {
  return [
    product.name,
    product.brand,
    product.modelNumber,
    product.category,
    product.subcategory,
    product.series,
    product.variant,
    product.shortDescription,
    product.description,
    ...product.features,
    ...product.applications,
    ...Object.values(product.specifications ?? {}),
  ].filter(Boolean).join(" ").toLowerCase();
}

export function productMatches(product: Product, query: string) {
  return !query.trim() || productSearchText(product).includes(query.trim().toLowerCase());
}

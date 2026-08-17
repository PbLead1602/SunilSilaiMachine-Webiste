import type { MetadataRoute } from "next";
import { catalogueBrandPages, products } from "@/lib/business";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "hi", "mr"];
  const pages = ["", "/shop", "/finance", "/services", "/about", "/contact", "/compare"];
  return [
    ...locales.flatMap((locale) => pages.map((page) => ({ url: absoluteUrl(`/${locale}${page}`), lastModified: new Date(), changeFrequency: "weekly" as const, priority: page ? 0.7 : 1 }))),
    ...locales.flatMap((locale) => catalogueBrandPages.map((brand) => ({ url: absoluteUrl(`/${locale}/brands/${brand.toLowerCase()}`), lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 }))),
    ...locales.flatMap((locale) => products.map((product) => ({ url: absoluteUrl(`/${locale}/product/${product.slug}`), lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }))),
  ];
}

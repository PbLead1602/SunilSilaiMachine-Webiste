import type { Metadata } from "next";
import { CatalogueClient } from "@/components/catalogue-client";
import { SectionHeading } from "@/components/section-heading";
import { categories, products } from "@/lib/business";
import { isLocale, t, ui } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Shop sewing machines, spare parts & accessories", description: "Browse domestic and industrial sewing machines, accessories, parts, and garment machinery in Akola." };

export default async function ShopPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string }> }) {
  const { locale } = await params; const { category } = await searchParams;
  if (!isLocale(locale)) notFound(); const copy = t(locale); const labels = ui(locale);
  return <div className="shell py-10 sm:py-14"><SectionHeading eyebrow={labels.allProducts} title={copy.categories} text={labels.localSource} /><CatalogueClient products={products} categories={categories} locale={locale} initialCategory={category ?? ""} /></div>;
}

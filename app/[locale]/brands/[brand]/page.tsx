import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueClient } from "@/components/catalogue-client";
import { SectionHeading } from "@/components/section-heading";
import { catalogueBrandPages, categories, products } from "@/lib/business";
import { isLocale, ui } from "@/lib/i18n";

function brandFromSlug(value: string) {
  return catalogueBrandPages.find((brand) => brand.toLowerCase() === value.toLowerCase());
}

export function generateStaticParams() { return catalogueBrandPages.map((brand) => ({ brand: brand.toLowerCase() })); }

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand } = await params;
  const name = brandFromSlug(brand);
  return name ? { title: `${name} sewing machines`, description: `Browse verified ${name} sewing-machine models available for enquiry at Sunil Silai Machine.` } : {};
}

export default async function BrandPage({ params }: { params: Promise<{ locale: string; brand: string }> }) {
  const { locale, brand } = await params;
  if (!isLocale(locale)) notFound();
  const selectedBrand = brandFromSlug(brand);
  if (!selectedBrand) notFound();
  const copy = ui(locale);
  const brandProducts = products.filter((product) => product.brand.toLowerCase() === selectedBrand.toLowerCase());
  const representedCategories = categories.filter((category) => brandProducts.some((product) => product.category === category.slug));
  const text = locale === "hi" ? { title: "\u0909\u0924\u094d\u092a\u093e\u0926", available: "\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0915\u0948\u091f\u0932\u0949\u0917 \u092e\u0949\u0921\u0932 \u092a\u0942\u091b\u0924\u093e\u091b \u0915\u0947 \u0932\u093f\u090f \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0902\u0964", none: "\u0907\u0938 \u092c\u094d\u0930\u093e\u0902\u0921 \u0915\u0947 \u0932\u093f\u090f \u0905\u092d\u0940 \u0915\u094b\u0908 \u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u0909\u0924\u094d\u092a\u093e\u0926 \u092e\u0949\u0921\u0932 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964" } : locale === "mr" ? { title: "\u0909\u0924\u094d\u092a\u093e\u0926\u0928\u0947", available: "\u092a\u0921\u0924\u093e\u0933\u0932\u0947\u0932\u0940 \u0915\u0945\u091f\u0932\u0949\u0917 \u092e\u0949\u0921\u0947\u0932 \u091a\u094c\u0915\u0936\u0940\u0938\u093e\u0920\u0940 \u0909\u092a\u0932\u092c\u094d\u0927 \u0906\u0939\u0947\u0924\u0964", none: "\u092f\u093e \u092c\u094d\u0930\u0901\u0921\u0938\u093e\u0920\u0940 \u0938\u0927\u094d\u092f\u093e \u0915\u094b\u0923\u0924\u0947\u0939\u0940 \u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u0909\u0924\u094d\u092a\u093e\u0926\u0928 \u092e\u0949\u0921\u0947\u0932 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u093e\u0939\u0940\u0924\u0964" } : { title: "products", available: "verified catalogue models available for enquiry.", none: "No reliable product models are currently available for this brand." };

  return <div className="shell py-10 sm:py-14">
    <SectionHeading eyebrow={copy.brand} title={`${selectedBrand} ${text.title}`} text={brandProducts.length ? `${brandProducts.length} ${text.available}` : text.none} />
    <CatalogueClient products={brandProducts} categories={representedCategories} locale={locale} initialBrand={selectedBrand} />
  </div>;
}

import { Search } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/business";
import { productMatches } from "@/lib/catalogue-utils";
import { isLocale, t, ui } from "@/lib/i18n";

export default async function SearchPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  const { q = "" } = await searchParams;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);
  const labels = ui(locale);
  const matches = products.filter((product) => productMatches(product, q));

  return <div className="shell py-10 sm:py-12"><p className="eyebrow">{labels.search}</p><h1 className="mt-3 font-display text-4xl font-semibold">{labels.search}</h1><p className="mt-3 max-w-full break-words text-stone-600">{q ? `${labels.search}: “${q}”` : labels.searchPlaceholder}</p>{matches.length ? <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">{matches.map((product) => <ProductCard product={product} locale={locale} key={product.slug} />)}</div> : <div className="surface mt-8 p-7 text-center sm:p-10"><Search className="mx-auto size-7 text-clay" /><h2 className="mt-4 font-display text-xl font-semibold">{copy.noResults}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{labels.helpChoice}</p><Link className="button-primary mt-5 w-full sm:w-auto" href={`/${locale}/shop`}>{labels.browse}</Link></div>}</div>;
}

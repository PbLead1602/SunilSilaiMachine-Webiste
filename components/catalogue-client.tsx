"use client";

import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { productMatches } from "@/lib/catalogue-utils";
import { ui } from "@/lib/i18n";
import { categoryName, siteCopy } from "@/lib/site-copy";
import type { Category, Locale, Product } from "@/lib/types";

export function CatalogueClient({ products, categories, locale, initialCategory = "", initialBrand = "" }: { products: Product[]; categories: Category[]; locale: Locale; initialCategory?: string; initialBrand?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [filterOpen, setFilterOpen] = useState(false);
  const filtered = useMemo(() => products.filter((product) => {
    const term = query.toLowerCase();
    return (!category || product.category === category) && (!brand || product.brand === brand) && productMatches(product, term);
  }), [brand, category, products, query]);
  const brands = [...new Set(products.map((product) => product.brand))].sort();
  const reset = () => { setQuery(""); setCategory(""); setBrand(""); };
  const copy = ui(locale);
  const text = siteCopy(locale);

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[290px_minmax(0,1fr)]">
      <aside className={`${filterOpen ? "block" : "hidden"} surface h-fit min-w-0 max-w-full p-5 sm:p-6 lg:block`}>
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-lg font-semibold">{copy.filter}</h2><button className="min-h-10 text-xs font-semibold text-clay" onClick={reset}>{copy.clearAll}</button></div>
        <fieldset className="mt-7 min-w-0">
          <legend className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500">{copy.category}</legend>
          <div className="mt-4 space-y-2">{categories.map((item) => <label key={item.slug} className="flex min-w-0 cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-sm leading-6 hover:bg-canvas"><input className="mt-1 shrink-0" type="radio" name="category" checked={category === item.slug} onChange={() => setCategory(item.slug)} /><span className="min-w-0">{categoryName(locale, item.slug, item.name)}</span></label>)}</div>
        </fieldset>
        <div className="mt-7 min-w-0 border-t border-line pt-7"><label className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500" htmlFor="brand-filter">{copy.brand}</label><select id="brand-filter" value={brand} onChange={(event) => setBrand(event.target.value)} className="mt-4 min-h-14 w-full min-w-0 rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"><option value="">{copy.allBrands}</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></div>
        <p className="mt-7 rounded-2xl bg-[#f6efe5] p-4 text-xs leading-6 text-stone-600 sm:p-5">{copy.helpChoice}</p>
      </aside>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <label className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-full border border-line bg-white px-5 focus-within:ring-2 focus-within:ring-gold"><Search className="size-5 shrink-0 text-stone-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder={copy.searchPlaceholder} />{query && <button className="shrink-0" onClick={() => setQuery("")} aria-label={copy.clearAll}><X className="size-5" /></button>}</label>
          <button onClick={() => setFilterOpen(!filterOpen)} className="button-secondary w-full shrink-0 px-5 md:w-auto lg:hidden"><SlidersHorizontal className="size-5" />{copy.filter}</button>
          <button className="hidden min-h-14 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-stone-600 lg:inline-flex">{text.featuredSort} <ChevronDown className="size-5" /></button>
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-2"><p className="text-sm leading-6 text-stone-500"><strong className="text-ink">{filtered.length}</strong> {copy.productsAvailable}</p>{(query || category || brand) && <button onClick={reset} className="min-h-10 text-sm font-semibold text-clay">{copy.reset}</button>}</div>
        {filtered.length > 0 ? <div className="mt-7 grid min-w-0 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">{filtered.map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}</div> : <div className="surface mt-7 p-7 text-center sm:p-12"><p className="font-display text-xl font-semibold">{copy.noProducts}</p><button onClick={reset} className="button-secondary mt-5">{copy.browse}</button></div>}
      </div>
    </div>
  );
}

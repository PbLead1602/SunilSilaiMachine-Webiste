"use client";

import { Scale, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "@/lib/business";
import { ui } from "@/lib/i18n";
import { categoryName, siteCopy } from "@/lib/site-copy";
import type { Locale, Product } from "@/lib/types";

export function ComparePage({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState<Product[]>([]);

  useEffect(() => {
    const slugs = JSON.parse(localStorage.getItem("sunil-silai-compare") ?? "[]") as string[];
    setSelected(products.filter((product) => slugs.includes(product.slug)));
  }, []);

  function clear() {
    localStorage.removeItem("sunil-silai-compare");
    setSelected([]);
  }

  const text = siteCopy(locale).compare;

  if (!selected.length) return <div className="surface mt-8 p-7 text-center sm:p-10"><Scale className="mx-auto size-8 text-clay" /><h2 className="mt-4 font-display text-2xl font-semibold">{text.emptyTitle}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{text.emptyText}</p><Link className="button-primary mt-6" href={`/${locale}/shop`}>{text.browse}</Link></div>;

  const rows: [string, (product: Product) => string][] = [
    [text.category, (product) => categoryName(locale, product.category, product.category.replaceAll("-", " "))],
    [text.description, (product) => product.shortDescription],
    [text.features, (product) => product.features.join(" · ")],
    [text.applications, (product) => product.applications.join(" · ")],
    [text.pricing, () => ui(locale).enquirePrice],
  ];

  return (
    <div className="mt-8 min-w-0 max-w-full overflow-hidden rounded-3xl border border-line bg-white">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-line p-5 sm:flex-row sm:items-center"><p className="text-sm leading-6 text-stone-600">{text.selected.replace("{count}", String(selected.length))}</p><button className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-semibold text-clay" onClick={clear}><Trash2 className="size-4" />{text.clear}</button></div>
      <div className="responsive-scroll" aria-label={text.tableTitle} tabIndex={0}>
        <table className="min-w-[680px] w-full text-left text-sm">
          <thead><tr className="bg-[#fffdfa]"><th className="w-40 p-4 font-semibold sm:w-44 sm:p-5">{text.tableTitle}</th>{selected.map((product) => <th className="min-w-56 p-4 font-display text-base font-semibold sm:p-5" key={product.slug}>{product.name}<span className="mt-1 block text-xs font-normal text-clay">{product.brand}</span></th>)}</tr></thead>
          <tbody>{rows.map(([label, value]) => <tr className="border-t border-line" key={label}><th className="p-4 font-semibold text-stone-600 sm:p-5">{label}</th>{selected.map((product) => <td className="p-4 leading-6 text-stone-600 sm:p-5" key={product.slug}>{value(product)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

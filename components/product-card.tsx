"use client";

import { Check, Eye, Heart, ImageOff, Scale, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ui } from "@/lib/i18n";
import { categoryName } from "@/lib/site-copy";
import type { Locale, Product } from "@/lib/types";
import { whatsappUrl } from "@/lib/utils";

const key = "sunil-silai-compare";
const wishKey = "sunil-silai-wishlist";

function updateList(storageKey: string, slug: string) {
  const current = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as string[];
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug].slice(-4);
  localStorage.setItem(storageKey, JSON.stringify(next));
  return next;
}

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(false);
  const copy = ui(locale);
  const variantLabel = locale === "hi" ? "\u092a\u094d\u0930\u0915\u093e\u0930 / \u0935\u0947\u0930\u093f\u090f\u0902\u091f" : locale === "mr" ? "\u092a\u094d\u0930\u0915\u093e\u0930 / \u0935\u094d\u0939\u0947\u0930\u093f\u090f\u0902\u091f" : "Type / variant";
  const variant = product.variant || product.productType;
  const labels = locale === "hi" ? { model: "\u092e\u0949\u0921\u0932", imagePending: "\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u092e\u0949\u0921\u0932 - \u0906\u0927\u093f\u0915\u093e\u0930\u093f\u0915 \u091b\u0935\u093f \u092a\u094d\u0930\u0924\u0940\u0915\u094d\u0937\u093f\u0924" } : locale === "mr" ? { model: "\u092e\u0949\u0921\u0947\u0932", imagePending: "\u092a\u0921\u0924\u093e\u0933\u0932\u0947\u0932\u0947 \u092e\u0949\u0921\u0947\u0932 - \u0905\u0927\u093f\u0915\u0943\u0924 \u092a\u094d\u0930\u0924\u093f\u092e\u093e \u092a\u094d\u0930\u0924\u0940\u0915\u094d\u0937\u0947\u0924" } : { model: "Model", imagePending: "Verified model - official image pending" };

  useEffect(() => {
    setSaved((JSON.parse(localStorage.getItem(wishKey) ?? "[]") as string[]).includes(product.slug));
    setCompared((JSON.parse(localStorage.getItem(key) ?? "[]") as string[]).includes(product.slug));
  }, [product.slug]);

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-3xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[1.25] overflow-hidden bg-[#f4f0eb] sm:aspect-[1.02]">
        {product.image ? <Image
          src={product.image}
          alt={product.name}
          fill
          quality={90}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-3 transition duration-500 group-hover:scale-105 sm:p-4"
        /> : <div className="flex h-full items-center justify-center p-5 text-center"><div className="max-w-full"><ImageOff className="mx-auto size-8 text-clay" /><p className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">{labels.model}</p><p className="mt-1 break-words text-base font-semibold leading-6 text-ink">{product.modelNumber ?? product.name}</p>{variant && <><p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">{variantLabel}</p><p className="mt-1 break-words text-sm font-semibold leading-5 text-ink">{variant}</p></>}<p className="mt-4 text-xs font-semibold leading-5 text-stone-600">{labels.imagePending}</p></div></div>}
        <div className="absolute left-3 top-3 flex max-w-[calc(100%-6rem)] gap-2 sm:left-4 sm:top-4">
          {product.badge && <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-ink backdrop-blur sm:px-3 sm:py-1.5 sm:text-sm">{product.badge}</span>}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2 sm:right-4 sm:top-4 sm:gap-3">
          <button aria-label={copy.saved} onClick={() => { const next = updateList(wishKey, product.slug); setSaved(next.includes(product.slug)); }} className="rounded-full bg-white/95 p-2.5 text-ink shadow-sm transition hover:text-clay sm:p-3">
            {saved ? <Heart className="size-5 fill-clay text-clay" /> : <Heart className="size-5" />}
          </button>
          <button aria-label={copy.compare} onClick={() => { const next = updateList(key, product.slug); setCompared(next.includes(product.slug)); }} className="rounded-full bg-white/95 p-2.5 text-ink shadow-sm transition hover:text-clay sm:p-3">
            {compared ? <Check className="size-5 text-clay" /> : <Scale className="size-5" />}
          </button>
        </div>
      </div>
      <div className="min-w-0 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase leading-5 tracking-[0.08em] text-clay sm:text-sm sm:tracking-[0.1em]">{product.brand} · {categoryName(locale, product.category, product.category.replaceAll("-", " "))}</p>
        <h3 className="mt-3 font-display text-lg font-semibold leading-7 text-ink sm:min-h-14">{product.name}</h3>
        {product.modelNumber && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-stone-500">{labels.model}: {product.modelNumber}</p>}
        {!product.image && variant && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-stone-500">{variantLabel}: {variant}</p>}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500 sm:min-h-14">{product.shortDescription}</p>
        <div className="mt-4 flex flex-col items-start justify-between gap-2 border-t border-line pt-4 sm:mt-5 sm:pt-5 sm:flex-row sm:gap-3">
          <span className="flex items-center gap-2 text-xs font-semibold text-stone-600"><ShieldCheck className="size-4 shrink-0 text-clay" /> {copy.emi}</span>
          <span className="text-sm font-bold text-ink">{copy.enquirePrice}</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2.5 md:mt-5 md:grid-cols-2 md:gap-3">
          <Link href={`/${locale}/product/${product.slug}`} className="button-secondary px-4 text-xs"><Eye className="size-4" />{copy.details}</Link>
          <a href={whatsappUrl(`Hello Sunil Silai Machine, I am interested in ${product.brand} ${product.modelNumber ?? product.name}. Please share price, availability, specifications, EMI options and delivery details.`)} className="button-primary px-4 text-xs">{copy.enquiry}</a>
        </div>
      </div>
    </article>
  );
}

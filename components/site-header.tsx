"use client";

import { Heart, Languages, Menu, Phone, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { business } from "@/lib/business";
import { localeLabels, locales, ui } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { whatsappUrl } from "@/lib/utils";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const copy = ui(locale);
  const nav = [[copy.home, ""], [copy.shop, "/shop"], [copy.domestic, "/shop?category=domestic-machines"], [copy.industrial, "/shop?category=industrial-machines"], [copy.services, "/services"], [copy.finance, "/finance"], [copy.about, "/about"], [copy.contact, "/contact"]];

  const switchLocale = (nextLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`);
      setOpen(false);
    }
  };

  const languageOptions = locales.map((item) => <option key={item} value={item}>{localeLabels[item]}</option>);

  return (
    <header className="sticky top-0 z-40 max-w-full border-b border-line bg-canvas/95 backdrop-blur">
      <div className="bg-ink text-white">
        <div className="shell flex min-h-10 flex-col justify-center gap-1 py-1.5 text-xs font-semibold sm:min-h-12 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="min-w-0 leading-5">{copy.utility}</span>
          <a className="w-fit max-w-full leading-5 hover:text-gold" href={whatsappUrl("Hello Sunil Silai Machine, I would like some assistance.")}>WhatsApp: {business.whatsapp}</a>
        </div>
      </div>

      <div className="shell header-main flex min-h-[76px] items-center py-3 sm:min-h-24 sm:py-4 lg:min-h-[116px] 2xl:h-40 2xl:py-0">
        <Link href={`/${locale}`} className="group flex min-w-0 flex-1 items-center gap-2 sm:gap-3" aria-label="Sunil Silai Machine home">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-[#ddc59f] bg-white p-0.5 shadow-card transition duration-300 group-hover:-translate-y-0.5 group-hover:border-gold sm:size-[72px] sm:rounded-2xl lg:size-[92px] 2xl:size-[125px] 2xl:p-1">
            <Image src={business.logo} alt="Sunil Silai Machine logo" width={113} height={113} className="size-full rounded-[10px] object-contain 2xl:rounded-xl" priority />
          </span>
          <span className="min-w-0 font-display text-[clamp(16px,4.8vw,21px)] font-semibold leading-[1.05] tracking-tight text-ink sm:whitespace-nowrap sm:text-[clamp(23px,3.4vw,30px)] lg:text-[clamp(28px,3vw,34px)] 2xl:flex 2xl:h-[100px] 2xl:items-center 2xl:text-[clamp(32px,2.5vw,38px)]">Sunil Silai Machine</span>
        </Link>

        <form onSubmit={submitSearch} className="hidden min-w-0 w-full 2xl:block">
          <label className="flex h-16 items-center gap-3 rounded-full border border-line bg-white px-6 focus-within:ring-2 focus-within:ring-gold" aria-label="Search catalogue">
            <Search className="size-5 shrink-0 text-stone-400" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-stone-400" placeholder={copy.searchPlaceholder} />
            <button className="shrink-0 text-sm font-semibold text-clay" type="submit">{copy.search}</button>
          </label>
        </form>

        <div className="hidden shrink-0 items-center gap-2 2xl:flex 2xl:justify-self-end">
          <label className="flex items-center rounded-full border border-line bg-white px-4 py-3"><Languages className="size-[18px] shrink-0 text-clay" strokeWidth={2.25} /><select aria-label="Language" value={locale} onChange={(event) => switchLocale(event.target.value as Locale)} className="max-w-28 bg-transparent px-1 text-sm outline-none">{languageOptions}</select></label>
          <Link href={`/${locale}/compare`} aria-label={copy.saved} className="inline-flex rounded-full p-4 hover:bg-white"><Heart className="size-[18px]" strokeWidth={2.25} /></Link>
          <a aria-label="Call Sunil Silai Machine" href={`tel:${business.phone.replace(/\s/g, "")}`} className="button-primary px-6"><Phone className="size-5" />{copy.call}</a>
        </div>
      </div>

      <div className="shell grid gap-2.5 border-t border-line py-3 2xl:hidden">
        <form onSubmit={submitSearch} className="flex min-h-12 min-w-0 overflow-hidden rounded-full border border-line bg-white focus-within:ring-2 focus-within:ring-gold">
          <Search className="ml-4 mt-3.5 size-5 shrink-0 text-stone-400" />
          <input type="search" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchPlaceholder} aria-label="Search catalogue" />
          <button className="shrink-0 px-4 text-sm font-semibold text-clay" type="submit">{copy.search}</button>
        </form>
        <div className="flex min-w-0 flex-wrap items-stretch gap-2">
          <label className="flex min-h-12 min-w-28 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink">
            <Languages className="size-[14px] shrink-0 text-clay" strokeWidth={2.25} />
            <select aria-label="Language" value={locale} onChange={(event) => switchLocale(event.target.value as Locale)} className="min-w-0 flex-1 bg-transparent outline-none">{languageOptions}</select>
          </label>
          <Link href={`/${locale}/compare`} aria-label={copy.saved} title={copy.saved} className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-white hover:bg-[#fffdfa]"><Heart className="size-[18px]" strokeWidth={2.25} /></Link>
          <a aria-label="Call Sunil Silai Machine" title={copy.call} href={`tel:${business.phone.replace(/\s/g, "")}`} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-3 text-sm font-semibold text-white shadow-card hover:bg-[#4a3830]"><Phone className="size-5 shrink-0" /><span className="hidden sm:inline">{copy.call}</span></a>
          <button onClick={() => setOpen(!open)} className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-white" aria-label="Toggle menu" aria-controls="mobile-navigation" aria-expanded={open}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </div>

      <nav className="hidden border-t border-line 2xl:block">
        <div className="shell flex h-16 items-center gap-5"><div className="flex min-w-0 items-center gap-5">{nav.map(([label, href]) => <Link className="whitespace-nowrap text-xs font-semibold text-stone-600 transition hover:text-clay" href={`/${locale}${href}`} key={label}>{label}</Link>)}</div><Link className="ml-auto whitespace-nowrap text-xs font-semibold text-clay" href={`/${locale}/compare`}>{copy.compare}</Link></div>
      </nav>

      {open && <div id="mobile-navigation" className="border-t border-line bg-canvas 2xl:hidden"><nav className="shell grid gap-2 py-5">{nav.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-xl px-4 py-3.5 text-sm font-semibold hover:bg-white" href={`/${locale}${href}`} key={label}>{label}</Link>)}</nav></div>}
    </header>
  );
}

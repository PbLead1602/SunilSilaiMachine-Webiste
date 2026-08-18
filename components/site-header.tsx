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
        <div className="shell flex min-h-9 items-center justify-between gap-2 py-1 text-[9px] font-semibold leading-4 sm:min-h-12 sm:gap-3 sm:py-1.5 sm:text-xs sm:leading-5">
          <span className="block min-w-0 flex-1 truncate whitespace-nowrap" title={copy.utility}>{copy.utility}</span>
          <a className="shrink-0 whitespace-nowrap hover:text-gold" href={whatsappUrl("Hello Sunil Silai Machine, I would like some assistance.")}>WhatsApp: {business.whatsapp}</a>
        </div>
      </div>

      <div className="shell header-main flex min-h-[68px] items-center py-2.5 sm:min-h-24 sm:py-4 lg:min-h-[108px] 2xl:min-h-[132px] 2xl:py-4">
        <Link href={`/${locale}`} className="group flex min-w-0 flex-1 items-center gap-2 sm:gap-3" aria-label="Sunil Silai Machine home">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#ddc59f] bg-white p-0.5 shadow-card transition duration-300 group-hover:-translate-y-0.5 group-hover:border-gold sm:size-[72px] sm:rounded-2xl lg:size-[84px] 2xl:size-[102px] 2xl:p-1">
            <Image src={business.logo} alt="Sunil Silai Machine logo" width={113} height={113} className="size-full rounded-[10px] object-contain 2xl:rounded-xl" priority />
          </span>
          <span className="min-w-0 font-display text-[clamp(15px,4.3vw,18px)] font-semibold leading-[1.08] tracking-tight text-ink sm:whitespace-nowrap sm:text-[clamp(23px,3.4vw,30px)] lg:text-[clamp(27px,2.8vw,32px)] 2xl:flex 2xl:h-[88px] 2xl:items-center 2xl:text-[clamp(30px,2vw,34px)]">Sunil Silai Machine</span>
        </Link>

        <form onSubmit={submitSearch} className="hidden min-w-0 w-full 2xl:block">
          <label className="flex h-14 items-center gap-3 rounded-full border border-line bg-white px-5 focus-within:ring-2 focus-within:ring-gold" aria-label="Search catalogue">
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

      <div className="shell grid gap-2 border-t border-line py-2.5 2xl:hidden">
        <form onSubmit={submitSearch} className="flex min-h-11 min-w-0 overflow-hidden rounded-full border border-line bg-white focus-within:ring-2 focus-within:ring-gold">
          <Search className="ml-3 mt-3 size-4 shrink-0 text-stone-400 sm:ml-4 sm:mt-3.5 sm:size-5" />
          <input type="search" className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[13px] outline-none sm:px-3 sm:py-3 sm:text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchPlaceholder} aria-label="Search catalogue" />
          <button className="shrink-0 px-3 text-[13px] font-semibold text-clay sm:px-4 sm:text-sm" type="submit">{copy.search}</button>
        </form>
        <div className="flex min-w-0 items-stretch gap-1 sm:gap-2">
          <label className="flex min-h-11 min-w-0 flex-1 items-center gap-1.5 rounded-xl border border-line bg-white px-2 text-xs font-semibold text-ink sm:min-h-12 sm:min-w-28 sm:gap-2 sm:px-3 sm:text-sm">
            <Languages className="size-4 shrink-0 text-clay sm:size-[14px]" strokeWidth={2.25} />
            <select aria-label="Language" value={locale} onChange={(event) => switchLocale(event.target.value as Locale)} className="min-w-0 flex-1 bg-transparent outline-none">{languageOptions}</select>
          </label>
          <Link href={`/${locale}/compare`} aria-label={copy.saved} title={copy.saved} className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white hover:bg-[#fffdfa] sm:size-12"><Heart className="size-[17px] sm:size-[18px]" strokeWidth={2.25} /></Link>
          <a aria-label="Call Sunil Silai Machine" title={copy.call} href={`tel:${business.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-2.5 text-[13px] font-semibold text-white shadow-card hover:bg-[#4a3830] sm:min-h-12 sm:px-3 sm:text-sm"><Phone className="size-[18px] shrink-0 sm:size-5" /><span className="hidden sm:inline">{copy.call}</span></a>
          <button onClick={() => setOpen(!open)} className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white sm:size-12" aria-label="Toggle menu" aria-controls="mobile-navigation" aria-expanded={open}>{open ? <X className="size-[18px] sm:size-5" /> : <Menu className="size-[18px] sm:size-5" />}</button>
        </div>
      </div>

      <nav className="hidden border-t border-line 2xl:block">
        <div className="shell flex h-16 items-center gap-5"><div className="flex min-w-0 items-center gap-5">{nav.map(([label, href]) => <Link className="whitespace-nowrap text-xs font-semibold text-stone-600 transition hover:text-clay" href={`/${locale}${href}`} key={label}>{label}</Link>)}</div><Link className="ml-auto whitespace-nowrap text-xs font-semibold text-clay" href={`/${locale}/compare`}>{copy.compare}</Link></div>
      </nav>

      {open && <div id="mobile-navigation" className="border-t border-line bg-canvas 2xl:hidden"><nav className="shell grid gap-1.5 py-3 sm:gap-2 sm:py-5">{nav.map(([label, href]) => <Link onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white sm:py-3.5" href={`/${locale}${href}`} key={label}>{label}</Link>)}</nav></div>}
    </header>
  );
}

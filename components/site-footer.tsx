import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { business, categories } from "@/lib/business";
import { ui } from "@/lib/i18n";
import { categoryName } from "@/lib/site-copy";
import type { Locale } from "@/lib/types";
import { whatsappUrl } from "@/lib/utils";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = ui(locale);

  return (
    <footer className="mt-16 max-w-full bg-ink text-[#f8f3ec] sm:mt-24">
      <div className="shell py-10 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 md:grid-cols-[1.3fr_.9fr] lg:grid-cols-[1.3fr_.9fr_.9fr_1.1fr] lg:gap-14">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Image src={business.logo} alt="Sunil Silai Machine logo" width={128} height={96} className="h-16 w-auto shrink-0 object-contain sm:h-20" />
              <span className="min-w-0 font-display text-xl font-semibold leading-tight sm:text-2xl">Sunil Silai Machine</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-stone-300 sm:mt-6">{copy.localSource}</p>
            <a className="mt-5 inline-flex min-h-12 max-w-full items-center gap-2 text-sm font-semibold text-gold hover:text-white sm:mt-6" href={whatsappUrl("Hello Sunil Silai Machine, I need assistance.")}>{copy.chatWhatsapp} <ArrowUpRight className="size-5 shrink-0" /></a>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold">{copy.explore}</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-stone-300">
              <li><Link className="hover:text-white" href={`/${locale}/shop`}>{copy.allProducts}</Link></li>
              <li><Link className="hover:text-white" href={`/${locale}/services`}>{copy.repairBooking}</Link></li>
              <li><Link className="hover:text-white" href={`/${locale}/finance`}>{copy.financeAssistance}</Link></li>
              <li><Link className="hover:text-white" href={`/${locale}/about`}>{copy.aboutUs}</Link></li>
            </ul>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold">{copy.categories}</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-stone-300">
              {categories.slice(0, 4).map((category) => <li key={category.slug}><Link className="hover:text-white" href={`/${locale}/shop?category=${category.slug}`}>{categoryName(locale, category.slug, category.name)}</Link></li>)}
            </ul>
          </div>
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <h2 className="font-display text-lg font-semibold">{copy.visitOrCall}</h2>
            <div className="mt-5 space-y-5 text-sm leading-7 text-stone-300">
              <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-start gap-3 hover:text-white"><MapPin className="mt-1 size-5 shrink-0 text-gold" /><span className="min-w-0">{business.address.join(", ")}</span></a>
              <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="flex min-w-0 items-start gap-3 hover:text-white"><Phone className="mt-1 size-5 shrink-0 text-gold" /><span className="min-w-0">{business.phone}<br />{business.whatsapp}</span></a>
            </div>
          </div>
        </div>
        <section className="mt-10 max-w-full overflow-hidden rounded-3xl border border-white/15 bg-white/5 sm:mt-14">
          <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="min-w-0"><p className="font-display text-lg font-semibold">{copy.mapTitle}</p><p className="mt-2 text-sm text-stone-300">{business.address[0]}, Akola</p></div>
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="button-secondary min-h-12 w-full shrink-0 border-white/40 bg-transparent px-4 text-white hover:bg-white hover:text-ink sm:w-auto"><MapPin className="size-5" />{copy.directions}</a>
          </div>
          <iframe title={copy.mapTitle} src={business.mapEmbedUrl} className="h-56 w-full max-w-full border-0 sm:h-72" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </section>
      </div>
      <div className="border-t border-white/15"><div className="shell flex flex-col gap-2 py-5 text-xs leading-5 text-stone-400 sm:flex-row sm:justify-between sm:gap-3 sm:py-6"><span>© {new Date().getFullYear()} Sunil Silai Machine. {copy.rights}</span><span>{copy.footerLine}</span></div></div>
    </footer>
  );
}

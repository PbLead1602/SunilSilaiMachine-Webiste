import { ArrowRight, BadgeCheck, Banknote, CheckCircle2, ChevronRight, Headphones, MapPin, MessageCircle, PackageCheck, Phone, Settings2, Sparkles, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroCarousel } from "@/components/hero-carousel";
import { InquiryForm } from "@/components/inquiry-form";
import { ProductCard } from "@/components/product-card";
import { BrandLogoRail } from "@/components/brand-logo-rail";
import { SectionHeading } from "@/components/section-heading";
import { brandDirectory, business, categories, products } from "@/lib/business";
import { isLocale, t, ui } from "@/lib/i18n";
import { categoryName, siteCopy } from "@/lib/site-copy";
import { whatsappUrl } from "@/lib/utils";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = t(locale);
  const labels = ui(locale);
  const text = siteCopy(locale);
  const benefits = [
    { icon: Settings2, title: labels.range, text: labels.rangeText },
    { icon: Headphones, title: labels.guidance, text: labels.guidanceText },
    { icon: PackageCheck, title: labels.parts, text: labels.partsText },
    { icon: Wrench, title: labels.repairSupport, text: labels.repairSupportText },
  ];

  return <>
    <section className="shell">
      <div className="relative min-h-[480px] max-w-full overflow-hidden bg-ink px-5 py-8 text-white shadow-soft sm:min-h-[600px] sm:px-12 sm:py-12 lg:min-h-[610px] lg:px-16 lg:py-20">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2f241f]/95 via-[#2f241f]/72 to-[#2f241f]/10" />
        <div className="relative z-10 flex min-w-0 max-w-xl flex-col">
          <p className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium leading-5 backdrop-blur"><Sparkles className="size-3.5 shrink-0 text-gold" />{copy.heroKicker}</p>
          <h1 className="mt-5 font-display text-[clamp(30px,8.5vw,36px)] font-semibold leading-[1.12] tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">{copy.heroTitle}</h1>
          <p className="mt-4 max-w-lg text-[15px] leading-6 text-stone-200 sm:mt-5 sm:text-lg sm:leading-7">{copy.heroText}</p>
          <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:gap-3 sm:flex-row sm:flex-wrap">
            <Link href={`/${locale}/shop`} className="button-primary w-full bg-white text-ink hover:bg-[#f5eadb] sm:w-auto">{copy.explore}<ArrowRight className="size-4 shrink-0" /></Link>
            <a href={whatsappUrl("Hello Sunil Silai Machine, I would like help choosing a machine.")} className="button-secondary w-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-ink sm:w-auto"><MessageCircle className="size-4 shrink-0" />{copy.contact}</a>
          </div>
          <div className="mt-8 grid max-w-md grid-cols-2 gap-2.5 sm:mt-14 sm:grid-cols-3 sm:gap-3"><span className="rounded-2xl bg-white/10 px-3 py-2.5 text-xs leading-5 backdrop-blur sm:px-4 sm:py-3">{labels.domestic} & {labels.industrial}</span><span className="rounded-2xl bg-white/10 px-3 py-2.5 text-xs leading-5 backdrop-blur sm:px-4 sm:py-3">{labels.emi}</span><span className="col-span-2 rounded-2xl bg-white/10 px-3 py-2.5 text-xs leading-5 backdrop-blur sm:col-auto sm:px-4 sm:py-3">{labels.repairSupport}</span></div>
        </div>
      </div>
    </section>

    <section className="shell px-5 py-10 sm:px-8 sm:py-16 lg:px-12"><div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">{benefits.map(({ icon: Icon, title, text: benefitText }) => <div className="surface min-w-0 p-4 sm:p-6" key={title}><span className="inline-flex rounded-2xl bg-[#f6efe5] p-2.5 text-clay sm:p-3"><Icon className="size-4 sm:size-5" /></span><h2 className="mt-4 font-display text-[15px] font-semibold leading-5 sm:mt-5 sm:text-lg sm:leading-normal">{title}</h2><p className="mt-2 text-[13px] leading-5 text-stone-600 sm:text-sm sm:leading-6">{benefitText}</p></div>)}</div></section>

    <section className="shell px-5 py-10 sm:px-8 sm:py-16 lg:px-12"><SectionHeading eyebrow={labels.categories} title={copy.categories} text={copy.categoriesText} href={`/${locale}/shop`} linkText={copy.allProducts} /><div className="-mx-5 flex max-w-none snap-x gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-3">{categories.map((category) => <Link href={`/${locale}/shop?category=${category.slug}`} key={category.slug} className="group relative min-w-[250px] max-w-[calc(100vw-2.5rem)] snap-start overflow-hidden rounded-3xl bg-ink sm:min-w-0 sm:max-w-none"><div className="relative aspect-[1.4]"><Image src={category.image} alt={categoryName(locale, category.slug, category.name)} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 78vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent" /><div className="absolute inset-x-4 bottom-4 flex min-w-0 items-end justify-between gap-3 text-white sm:inset-x-5 sm:bottom-5"><div className="min-w-0"><h3 className="font-display text-xl font-semibold">{categoryName(locale, category.slug, category.name)}</h3><p className="mt-1 text-xs text-white/80">{labels.explore}</p></div><span className="shrink-0 rounded-full bg-white/15 p-2.5 backdrop-blur"><ChevronRight className="size-4" /></span></div></div></Link>)}</div></section>

    <section className="shell px-5 py-10 sm:px-8 sm:py-16 lg:px-12"><SectionHeading eyebrow={labels.selected} title={copy.featured} text={copy.featuredText} href={`/${locale}/shop`} linkText={copy.allProducts} /><div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.filter((product) => product.featured).slice(0, 4).map((product) => <ProductCard product={product} locale={locale} key={product.slug} />)}</div></section>

    <section className="shell px-5 py-10 sm:px-8 sm:py-16 lg:px-12"><div className="max-w-full overflow-hidden rounded-[2rem] bg-[#ead9bd] p-5 sm:p-10 lg:p-14"><div className="grid min-w-0 items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_.9fr]"><div className="min-w-0"><p className="eyebrow text-[#76542e]">{labels.financeKicker}</p><h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{copy.finance}</h2><p className="mt-4 max-w-lg leading-7 text-stone-700">{labels.financeText}</p><Link href={`/${locale}/finance`} className="button-primary mt-7 w-full sm:w-auto">{labels.financeAssistance} <ArrowRight className="size-4 shrink-0" /></Link></div><div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:grid-cols-1">{[[Banknote, labels.emiGuidance, labels.financeText], [BadgeCheck, labels.clearSteps, labels.financeText], [Phone, labels.talkToUs, labels.financeText]].map(([Icon, title, cardText]) => { const CardIcon = Icon as typeof Banknote; return <div key={title as string} className="min-w-0 rounded-3xl bg-white/75 p-5"><CardIcon className="size-5 text-clay" /><h3 className="mt-3 font-display font-semibold text-ink">{title as string}</h3><p className="mt-1 text-sm leading-5 text-stone-600">{cardText as string}</p></div>; })}</div></div></div></section>

    <section className="shell px-5 py-10 sm:px-8 sm:py-16 lg:px-12"><SectionHeading eyebrow={labels.brand} title={labels.brandsTitle} text={labels.brandsText} /><BrandLogoRail locale={locale} brands={brandDirectory.map((brand) => ({ ...brand, hasProducts: products.some((product) => product.brand.toLowerCase() === brand.name.toLowerCase()) }))} browseLabel={labels.allProducts} contactLabel={labels.chatWhatsapp} /></section>

    <section className="shell px-5 py-10 sm:px-8 sm:py-16 lg:px-12"><SectionHeading eyebrow={labels.supportKicker} title={copy.trust} /><div className="grid min-w-0 gap-5 lg:grid-cols-3"><div className="relative min-h-[380px] min-w-0 overflow-hidden rounded-[2rem] bg-ink lg:col-span-2"><Image src="/images/hero images/heroimage2.jpg" alt={text.images.tailoringStudio} fill className="object-cover opacity-80" /><div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/25 to-transparent" /><div className="relative max-w-md p-5 text-white sm:p-10"><CheckCircle2 className="size-7 text-gold" /><h3 className="mt-12 font-display text-3xl font-semibold sm:mt-16">{labels.adviceTitle}</h3><p className="mt-4 leading-7 text-stone-200">{labels.adviceText}</p><a href={whatsappUrl("Hello Sunil Silai Machine, I need help selecting a suitable sewing machine.")} className="button-secondary mt-7 w-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-ink sm:w-auto">{labels.productGuidance}</a></div></div><div className="surface min-w-0 p-5 sm:p-8"><p className="eyebrow">{labels.repairSupport}</p><h3 className="mt-3 font-display text-2xl font-semibold">{copy.repair}</h3><p className="mt-3 text-sm leading-6 text-stone-600">{copy.repairText}</p><div className="mt-6 border-t border-line pt-6"><InquiryForm type="REPAIR" compact /></div></div></div></section>

    <section className="shell px-5 py-10 sm:px-8 sm:py-16 lg:px-12"><div className="surface grid min-w-0 overflow-hidden md:grid-cols-2"><div className="min-w-0 p-5 sm:p-10"><p className="eyebrow">Sunil Silai Machine</p><h2 className="mt-3 font-display text-3xl font-semibold">{labels.visitTitle}</h2><p className="mt-4 leading-7 text-stone-600">{business.address.map((line) => <span className="block" key={line}>{line}</span>)}</p><p className="mt-6 text-sm font-semibold leading-6 text-ink">{business.hours[0]}<br />{business.hours[1]}</p><a href={business.mapsUrl} target="_blank" rel="noreferrer" className="button-primary mt-7 w-full sm:w-auto"><MapPin className="size-4 shrink-0" />{labels.directions}</a></div><div className="relative min-h-[260px] bg-[#e7ddd1] sm:min-h-[320px]"><Image src="/images/about section/asimage1.jpg" alt={text.images.serviceDetail} fill className="object-cover" /></div></div></section>
  </>;
}

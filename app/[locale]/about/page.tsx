import { CheckCircle2, HeartHandshake, MapPinned, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { business } from "@/lib/business";
import { isLocale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = siteCopy(locale).about;
  const icons = [Store, HeartHandshake, MapPinned, CheckCircle2];

  return <div className="shell py-10 sm:py-14">
    <section className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
      <div className="min-w-0"><p className="eyebrow">{text.eyebrow}</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{text.title}</h1><p className="mt-5 max-w-xl leading-8 text-stone-600">{text.text}</p><div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2">{text.cards.map(({ title, text: cardText }, index) => { const CardIcon = icons[index]; return <div className="surface min-w-0 p-5" key={title}><CardIcon className="size-5 text-clay" /><h2 className="mt-3 font-display font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-stone-600">{cardText}</p></div>; })}</div></div>
      <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] sm:min-h-[470px]"><Image src="/images/about section/asimage3.jpg" alt={text.imageAlt} fill className="object-cover" /></div>
    </section>
    <section className="mt-10 min-w-0 rounded-[2rem] bg-[#f0e3d0] p-5 sm:mt-14 sm:p-10"><p className="eyebrow text-[#76542e]">{text.talk}</p><h2 className="mt-3 font-display text-3xl font-semibold">{text.callout}</h2><p className="mt-4 max-w-2xl leading-7 text-stone-700">{business.address.join(", ")}</p><Link className="button-primary mt-7 w-full sm:w-auto" href={`/${locale}/contact`}>{text.contact}</Link></section>
  </div>;
}

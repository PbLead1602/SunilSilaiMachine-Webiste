import { Clock3, MapPin, Phone, Send } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { business } from "@/lib/business";
import { isLocale } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";
import { whatsappUrl } from "@/lib/utils";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = siteCopy(locale).contact;

  return <div className="shell py-10 sm:py-14">
    <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <div className="min-w-0"><p className="eyebrow">{text.eyebrow}</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">{text.title}</h1><p className="mt-4 leading-7 text-stone-600">{text.text}</p><div className="mt-8 space-y-4"><a className="surface flex min-w-0 gap-4 p-4 transition hover:border-gold sm:p-5" href={`tel:${business.phone.replace(/\s/g, "")}`}><Phone className="mt-0.5 size-5 shrink-0 text-clay" /><div className="min-w-0"><h2 className="font-semibold">{text.call}</h2><p className="mt-1 text-sm leading-6 text-stone-600">{business.phone}<br />{business.whatsapp}</p></div></a><a className="surface flex min-w-0 gap-4 p-4 transition hover:border-gold sm:p-5" href={business.mapsUrl} target="_blank" rel="noreferrer"><MapPin className="mt-0.5 size-5 shrink-0 text-clay" /><div className="min-w-0"><h2 className="font-semibold">{text.address}</h2><p className="mt-1 text-sm leading-6 text-stone-600">{business.address.join(", ")}</p></div></a><div className="surface flex min-w-0 gap-4 p-4 sm:p-5"><Clock3 className="mt-0.5 size-5 shrink-0 text-clay" /><div className="min-w-0"><h2 className="font-semibold">{text.hours}</h2><p className="mt-1 text-sm leading-6 text-stone-600">{business.hours.join(" · ")}</p></div></div></div><a href={whatsappUrl("Hello Sunil Silai Machine, I need assistance.")} className="button-primary mt-6 w-full sm:w-auto"><Send className="size-4 shrink-0" />{text.whatsapp}</a></div>
      <aside className="surface min-w-0 p-5 sm:p-8"><p className="eyebrow">{text.enquiry}</p><h2 className="mt-3 font-display text-2xl font-semibold">{text.help}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{text.helpText}</p><div className="mt-6"><InquiryForm /></div></aside>
    </div>
    <section className="relative mt-10 min-h-[250px] overflow-hidden rounded-[2rem] bg-[#e7ddd1] sm:mt-12 sm:min-h-[310px]"><Image src="/images/about section/asimage5.png" alt={text.mapAlt} fill className="object-cover" /><div className="absolute inset-0 bg-ink/25" /><a href={business.mapsUrl} target="_blank" rel="noreferrer" className="absolute bottom-4 left-4 right-4 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-ink shadow-card sm:bottom-5 sm:left-5 sm:right-auto sm:px-5"><MapPin className="mr-2 inline size-4 shrink-0 text-clay" />{text.openMap}</a></section>
  </div>;
}

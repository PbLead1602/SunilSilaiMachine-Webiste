import { CheckCircle2, Clock3, Wrench } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { accessories, spareParts } from "@/lib/business";
import { isLocale, t, ui } from "@/lib/i18n";
import { categoryName, siteCopy } from "@/lib/site-copy";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);
  const labels = ui(locale);
  const text = siteCopy(locale);

  return <div className="shell py-10 sm:py-14">
    <section className="grid min-w-0 overflow-hidden rounded-[2rem] bg-ink text-white lg:grid-cols-2">
      <div className="min-w-0 p-5 sm:p-12"><p className="eyebrow text-gold">{labels.repairSupport}</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">{copy.repair}</h1><p className="mt-5 max-w-xl leading-7 text-stone-200">{copy.repairText}</p><div className="mt-8 grid min-w-0 gap-3 sm:grid-cols-2">{[[Wrench, labels.repairBooking], [Clock3, labels.guidance]].map(([Icon, title]) => { const CardIcon = Icon as typeof Wrench; return <div key={title as string} className="min-w-0 rounded-2xl bg-white/10 p-4"><CardIcon className="size-5 text-gold" /><p className="mt-3 text-sm leading-6 font-semibold">{title as string}</p></div>; })}</div></div>
      <div className="relative min-h-[250px] sm:min-h-[320px]"><Image src="/images/about section/asimage2.jpg" alt={text.images.workshop} fill className="object-cover" /></div>
    </section>
    <section className="mt-10 grid min-w-0 gap-8 sm:mt-12 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <aside className="surface h-fit min-w-0 p-5 sm:p-8"><p className="eyebrow">{labels.repairBooking}</p><h2 className="mt-3 font-display text-2xl font-semibold">{labels.repairSupport}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{copy.repairText}</p><div className="mt-6"><InquiryForm type="REPAIR" /></div></aside>
      <div className="min-w-0"><p className="eyebrow">{labels.parts}</p><h2 className="mt-3 font-display text-3xl font-semibold">{labels.partsText}</h2><div className="mt-7 grid min-w-0 gap-5 sm:grid-cols-2"><div className="surface min-w-0 p-5 sm:p-6"><h3 className="font-display text-xl font-semibold">{labels.parts}</h3><ul className="mt-4 space-y-3">{spareParts.slice(0, 5).map((item) => <li className="flex min-w-0 gap-2 text-sm leading-6 text-stone-600" key={item}><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-clay" /><span className="min-w-0">{item}</span></li>)}</ul></div><div className="surface min-w-0 p-5 sm:p-6"><h3 className="font-display text-xl font-semibold">{categoryName(locale, "accessories", labels.categories)}</h3><ul className="mt-4 space-y-3">{accessories.slice(0, 5).map((item) => <li className="flex min-w-0 gap-2 text-sm leading-6 text-stone-600" key={item}><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-clay" /><span className="min-w-0">{item}</span></li>)}</ul></div></div></div>
    </section>
  </div>;
}

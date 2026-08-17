import { BadgeCheck, Banknote, FileCheck2, PhoneCall } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { business } from "@/lib/business";
import { isLocale, t, ui } from "@/lib/i18n";
import { siteCopy } from "@/lib/site-copy";

export default async function FinancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = t(locale);
  const labels = ui(locale);
  const text = siteCopy(locale);

  return <div className="shell py-10 sm:py-14">
    <div className="grid min-w-0 overflow-hidden rounded-[2rem] bg-[#e9dcc8] lg:grid-cols-2">
      <div className="min-w-0 p-5 sm:p-12"><p className="eyebrow text-[#76542e]">{labels.financeKicker}</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">{copy.finance}</h1><p className="mt-5 max-w-xl leading-7 text-stone-700">{labels.financeText}</p><div className="mt-8 grid min-w-0 gap-3 sm:grid-cols-3">{[[Banknote, labels.categories], [FileCheck2, labels.clearSteps], [PhoneCall, labels.talkToUs]].map(([Icon, title]) => { const CardIcon = Icon as typeof Banknote; return <div className="min-w-0 rounded-2xl bg-white/75 p-4" key={title as string}><CardIcon className="size-5 text-clay" /><p className="mt-3 text-sm leading-6 font-semibold">{title as string}</p></div>; })}</div></div>
      <div className="relative min-h-[250px] sm:min-h-[300px]"><Image src="/images/about section/asimage4.png" alt={text.images.finance} fill className="object-cover" /></div>
    </div>
    <div className="mt-10 grid min-w-0 gap-8 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)]">
      <section className="min-w-0"><p className="eyebrow">{labels.clearSteps}</p><h2 className="mt-3 font-display text-3xl font-semibold">{labels.talkToUs}</h2><ol className="mt-7 space-y-4">{[labels.helpChoice, labels.financeText, labels.visitOrCall].map((item, index) => <li className="surface flex min-w-0 gap-4 p-4 sm:p-5" key={item}><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{index + 1}</span><p className="min-w-0 text-sm leading-6 text-stone-600">{item}</p></li>)}</ol><div className="mt-7 flex min-w-0 gap-3 rounded-2xl border border-[#e7cba2] bg-[#fff8ec] p-4 text-sm leading-6 text-stone-700 sm:p-5"><BadgeCheck className="size-5 shrink-0 text-clay" /><span className="min-w-0">{labels.privacy}</span></div></section>
      <aside className="surface h-fit min-w-0 p-5 sm:p-8"><p className="eyebrow">{labels.financeAssistance}</p><h2 className="mt-3 font-display text-2xl font-semibold">{labels.talkToUs}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{labels.receivedText}</p><div className="mt-6"><InquiryForm type="FINANCE" /></div><p className="mt-5 text-center text-xs leading-5 text-stone-500">{labels.call}: {business.phone}</p></aside>
    </div>
  </div>;
}

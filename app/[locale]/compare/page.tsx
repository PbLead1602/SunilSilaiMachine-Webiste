import { ComparePage } from "@/components/compare-page";
import { isLocale, ui } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function CompareRoute({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const copy = ui(locale); return <div className="shell py-10 sm:py-12"><p className="eyebrow">{copy.saved}</p><h1 className="mt-3 font-display text-4xl font-semibold">{copy.compare}</h1><p className="mt-3 max-w-2xl leading-7 text-stone-600">{copy.helpChoice}</p><ComparePage locale={locale} /></div>; }

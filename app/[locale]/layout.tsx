import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <div className={locale === "en" ? "" : "font-devanagari"}><LocalBusinessSchema /><SiteHeader locale={locale} /><main>{children}</main><SiteFooter locale={locale} /></div>;
}

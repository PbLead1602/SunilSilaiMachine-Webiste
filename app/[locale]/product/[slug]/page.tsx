import type { Metadata } from "next";
import { Check, ChevronRight, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { productBySlug, products } from "@/lib/business";
import { isLocale } from "@/lib/i18n";
import { categoryName, siteCopy } from "@/lib/site-copy";
import { absoluteUrl, whatsappUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: absoluteUrl(`/en/product/${product.slug}`) },
    openGraph: product.image ? { images: [product.image] } : undefined,
  };
}

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = productBySlug(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);
  const copy = siteCopy(locale).product;
  const specifications = Object.entries(product.specifications ?? {}).filter(([, value]) => value && value !== "Not available from verified source");
  const enquiryMessage = `Hello Sunil Silai Machine, I am interested in ${product.brand} ${product.modelNumber ?? product.name}. Please share price, availability, specifications, EMI options and delivery details.`;
  const labels = locale === "hi" ? { model: "\u092e\u0949\u0921\u0932", features: "\u092e\u0941\u0916\u094d\u092f \u0935\u093f\u0936\u0947\u0937\u0924\u093e\u090f\u0901", imagePending: "\u0906\u0927\u093f\u0915\u093e\u0930\u093f\u0915 \u0909\u0924\u094d\u092a\u093e\u0926 \u091b\u0935\u093f \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0915\u0940 \u091c\u093e \u0930\u0939\u0940 \u0939\u0948\u0964", unavailable: "\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0938\u094d\u0930\u094b\u0924 \u0938\u0947 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902\u0964" } : locale === "mr" ? { model: "\u092e\u0949\u0921\u0947\u0932", features: "\u092e\u0941\u0916\u094d\u092f \u0935\u0948\u0936\u093f\u0937\u094d\u091f\u094d\u092f\u0947", imagePending: "\u0905\u0927\u093f\u0915\u0943\u0924 \u0909\u0924\u094d\u092a\u093e\u0926\u0928 \u092a\u094d\u0930\u0924\u093f\u092e\u093e \u092a\u0921\u0924\u093e\u0933\u0932\u0940 \u091c\u093e\u0924 \u0906\u0939\u0947\u0964", unavailable: "\u092a\u0921\u0924\u093e\u0933\u0932\u0947\u0932\u094d\u092f\u093e \u0938\u094d\u0930\u094b\u0924\u093e\u0924 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u093e\u0939\u0940\u0964" } : { model: "Model", features: "Key features", imagePending: "Official product image is being verified.", unavailable: "Not available from verified source." };

  return <div className="shell py-7 sm:py-10">
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 overflow-hidden text-xs text-stone-500">
      <Link className="shrink-0 hover:text-clay" href={`/${locale}`}>{copy.breadcrumbHome}</Link>
      <ChevronRight className="size-3 shrink-0" />
      <Link className="shrink-0 hover:text-clay" href={`/${locale}/shop`}>{copy.breadcrumbShop}</Link>
      <ChevronRight className="size-3 shrink-0" />
      <span className="min-w-0 truncate">{product.name}</span>
    </nav>

    <div className="mt-7 grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery images={product.gallery} alt={product.name} pendingLabel={labels.imagePending} />
      <div className="min-w-0">
        <p className="eyebrow">{product.brand} - {categoryName(locale, product.category, product.category.replaceAll("-", " "))}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
        {product.modelNumber && <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-clay">{labels.model}: {product.modelNumber}</p>}
        <p className="mt-4 text-lg font-semibold text-ink">{copy.price}</p>
        <p className="mt-4 leading-7 text-stone-600">{product.description}</p>
        <div className="mt-6 flex min-w-0 flex-wrap gap-2">
          {product.features.map((feature) => <span key={feature} className="max-w-full rounded-full bg-[#f6efe5] px-3 py-2 text-xs font-semibold leading-5 text-stone-700">{feature}</span>)}
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a className="button-primary w-full sm:w-auto" href={whatsappUrl(enquiryMessage)}><MessageCircle className="size-4 shrink-0" />{copy.whatsapp}</a>
          <a className="button-secondary w-full sm:w-auto" href="#enquiry">{copy.sendEnquiry}</a>
        </div>
        <div className="mt-8 flex min-w-0 gap-3 rounded-2xl border border-line bg-[#fffdfa] p-4">
          <ShieldCheck className="size-5 shrink-0 text-clay" />
          <p className="min-w-0 text-sm leading-6 text-stone-600">{copy.availability}</p>
        </div>
      </div>
    </div>

    <div className="mt-12 grid min-w-0 gap-7 sm:mt-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
      <div className="min-w-0">
        <section className="surface min-w-0 p-5 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">{copy.specifications}</h2>
          {specifications.length ? <dl className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
            {specifications.map(([label, value]) => <div className="rounded-2xl border border-line bg-[#fffdfa] p-4" key={label}><dt className="text-xs font-bold uppercase tracking-[0.08em] text-stone-500">{label}</dt><dd className="mt-2 text-sm font-semibold leading-6 text-ink">{value}</dd></div>)}
          </dl> : <p className="mt-4 text-sm leading-6 text-stone-600">{labels.unavailable}</p>}

          <h2 className="mt-9 font-display text-2xl font-semibold">{labels.features}</h2>
          <ul className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
            {product.features.map((feature) => <li className="flex min-w-0 items-start gap-2 text-sm leading-6 text-stone-600" key={feature}><Check className="mt-1 size-3.5 shrink-0 text-clay" /><span className="min-w-0">{feature}</span></li>)}
          </ul>

          <h2 className="mt-9 font-display text-2xl font-semibold">{copy.applications}</h2>
          <div className="mt-4 flex min-w-0 flex-wrap gap-2">
            {product.applications.length ? product.applications.map((application) => <span className="max-w-full rounded-full border border-line px-3 py-2 text-sm leading-5 text-stone-600" key={application}>{application}</span>) : <p className="text-sm leading-6 text-stone-600">{labels.unavailable}</p>}
          </div>

          <h2 className="mt-9 font-display text-2xl font-semibold">{copy.questions}</h2>
          <details className="mt-4 border-t border-line py-4"><summary className="cursor-pointer font-semibold">{copy.questionOne}</summary><p className="mt-3 text-sm leading-6 text-stone-600">{copy.answerOne}</p></details>
          <details className="border-t border-line py-4"><summary className="cursor-pointer font-semibold">{copy.questionTwo}</summary><p className="mt-3 text-sm leading-6 text-stone-600">{copy.answerTwo}</p></details>
        </section>
      </div>
      <aside id="enquiry" className="surface h-fit min-w-0 p-5 sm:p-8">
        <p className="eyebrow">{copy.enquiryEyebrow}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold">{copy.enquiryTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">{copy.enquiryText}</p>
        <div className="mt-6"><InquiryForm type="PRODUCT" productName={`${product.brand} ${product.modelNumber ?? product.name}`} compact /></div>
      </aside>
    </div>

    {related.length > 0 && <section className="mt-12 min-w-0 sm:mt-16"><h2 className="font-display text-3xl font-semibold">{copy.related}</h2><div className="mt-7 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard product={item} locale={locale} key={item.slug} />)}</div></section>}
  </div>;
}

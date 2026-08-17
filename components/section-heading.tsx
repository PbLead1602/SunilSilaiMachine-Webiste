import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SectionHeading({ eyebrow, title, text, href, linkText }: { eyebrow: string; title: string; text?: string; href?: string; linkText?: string }) {
  return (
    <div className="mb-8 flex min-w-0 flex-col justify-between gap-5 md:mb-10 md:flex-row md:items-end">
      <div className="min-w-0 max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {text && <p className="mt-3 leading-7 text-stone-600">{text}</p>}
      </div>
      {href && linkText && <Link className="group inline-flex min-h-12 w-fit max-w-full items-center gap-2 text-sm font-semibold text-ink hover:text-clay" href={href}><span>{linkText}</span><ArrowUpRight className="size-5 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>}
    </div>
  );
}

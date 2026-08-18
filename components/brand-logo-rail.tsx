import Image from "next/image";
import Link from "next/link";
import { whatsappUrl } from "@/lib/utils";
import type { Locale } from "@/lib/types";

type BrandLogo = {
  name: string;
  logo: string;
  hasProducts: boolean;
};

export function BrandLogoRail({ locale, brands, browseLabel, contactLabel }: { locale: Locale; brands: BrandLogo[]; browseLabel: string; contactLabel: string }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
      {brands.map((brand) => {
        const tile = <>
          <Image src={brand.logo} alt={`${brand.name} logo`} width={240} height={96} sizes="(min-width: 1280px) 15vw, (min-width: 640px) 28vw, 44vw" className="h-10 w-auto max-w-full object-contain sm:h-12" />
          <span className="sr-only">{brand.name}</span>
        </>;

        return brand.hasProducts ? (
          <Link key={brand.name} href={`/${locale}/shop?brand=${encodeURIComponent(brand.name)}`} aria-label={`${brand.name} ${browseLabel}`} className="group flex min-h-[88px] min-w-0 items-center justify-center rounded-2xl border border-line bg-white px-4 py-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:min-h-[104px] sm:px-5">
            {tile}
          </Link>
        ) : (
          <a key={brand.name} href={whatsappUrl(`Hello Sunil Silai Machine, I would like details about ${brand.name}. To get details contact us directly.`)} aria-label={`${contactLabel}: ${brand.name}`} className="group flex min-h-[88px] min-w-0 items-center justify-center rounded-2xl border border-line bg-white px-4 py-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:min-h-[104px] sm:px-5">
            {tile}
          </a>
        );
      })}
    </div>
  );
}

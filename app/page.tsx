import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocalBusinessSchema } from "@/components/local-business-schema";
import { WebsiteSchema } from "@/components/website-schema";
import HomePage from "./[locale]/page";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function IndexPage() {
  return <>
    <LocalBusinessSchema />
    <WebsiteSchema />
    <SiteHeader locale="en" />
    <main><HomePage params={Promise.resolve({ locale: "en" })} /></main>
    <SiteFooter locale="en" />
  </>;
}

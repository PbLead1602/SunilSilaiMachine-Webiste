import type { Metadata, Viewport } from "next";
import { business } from "@/lib/business";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  applicationName: business.name,
  title: { default: business.name, template: "%s | Sunil Silai Machine" },
  description: "Domestic and industrial sewing machines, spare parts, accessories, repairs, and purchase guidance in Akola.",
  keywords: ["Sunil Silai Machine", "sewing machine shop Akola", "industrial sewing machines", "domestic sewing machines", "sewing machine repair Akola"],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: business.logo, type: "image/jpeg", sizes: "1254x1254" }],
    shortcut: [{ url: business.logo, type: "image/jpeg", sizes: "1254x1254" }],
    apple: [{ url: business.logo, type: "image/jpeg", sizes: "1254x1254" }],
  },
  openGraph: {
    type: "website",
    siteName: business.name,
    title: "Sunil Silai Machine | Akola",
    description: "Domestic and industrial sewing machines, spare parts, accessories, repairs, and purchase guidance in Akola.",
    url: "/",
    locale: "en_IN",
    images: [{ url: business.logo, width: 1254, height: 1254, alt: `${business.name} logo` }],
  },
  twitter: {
    card: "summary",
    title: "Sunil Silai Machine | Akola",
    description: "Domestic and industrial sewing machines, spare parts, accessories, repairs, and purchase guidance in Akola.",
    images: [business.logo],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF8F5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

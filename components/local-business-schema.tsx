import { business } from "@/lib/business";
import { absoluteUrl } from "@/lib/utils";

export function LocalBusinessSchema() {
  const schema = { "@context": "https://schema.org", "@type": "Store", name: business.name, image: absoluteUrl(business.logo), telephone: business.phone, address: { "@type": "PostalAddress", streetAddress: "Shop No. 18/19, Shastri Stadium, Opposite Old Bus Stand, Tower Road, Fateh Chowk", addressLocality: "Akola", postalCode: "444001", addressRegion: "Maharashtra", addressCountry: "IN" }, openingHours: ["Mo-Sa 09:30-20:30"], url: absoluteUrl() };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

import { business } from "@/lib/business";
import { absoluteUrl } from "@/lib/utils";

/**
 * Google uses this WebSite entity on the canonical homepage as its primary
 * machine-readable signal for the site name shown in Search results.
 */
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: business.name,
    alternateName: ["Sunil Silai", "Sunil Silai Machine Akola"],
    url: absoluteUrl("/"),
    publisher: { "@id": absoluteUrl("/#organization") },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

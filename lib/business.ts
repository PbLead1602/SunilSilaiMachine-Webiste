import type { Category, Product } from "@/lib/types";
import { brochureProducts } from "@/lib/brochure-products";
import { importedProducts } from "@/lib/imported-products";

export const business = {
  name: "Sunil Silai Machine",
  proprietor: "Sagar Dilip Bodade",
  phone: "+91 89757 57541",
  whatsapp: "+91 82080 21624",
  email: "",
  address: [
    "Shop No. 18/19, Shastri Stadium",
    "Opposite Old Bus Stand, Tower Road, Fateh Chowk",
    "Akola – 444001, Maharashtra, India",
  ],
  hours: ["Monday – Saturday: 9:30 AM – 8:30 PM", "Sunday: Please call before visiting"],
  logo: "/images/Logo/sunil logo.jpeg",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sunil+Silai+Machine%2C+Shop+No.+18%2F19%2C+Shastri+Stadium%2C+Opposite+Old+Bus+Stand%2C+Tower+Road%2C+Fateh+Chowk%2C+Akola+444001",
  mapEmbedUrl: "https://www.google.com/maps?q=Sunil%20Silai%20Machine%2C%20Shop%20No.%2018%2F19%2C%20Shastri%20Stadium%2C%20Opposite%20Old%20Bus%20Stand%2C%20Tower%20Road%2C%20Fateh%20Chowk%2C%20Akola%20444001&output=embed",
} as const;

export const brands = [
  "ZOJE",
  "JACK",
  "USHA",
  "NIRMA",
  "MODI",
  "GEMINY",
  "QMach",
  "SILVERBIRD",
  "MESSER",
  "ANSWER",
  "SINGER",
];

/** Brand catalogue routes maintained for this imported V1 range. */
export const catalogueBrandPages = ["ZOJE", "JACK", "USHA", "GEMINY", "QMach", "MODI", "NIRMA", "ANSWER", "SINGER"] as const;

/** Brands retained in source records but not offered through the public shop. */
const excludedShopBrands = new Set(["FUCEN", "JIN", "SONEX"]);

export const categories: Category[] = [
  {
    slug: "domestic-machines",
    name: "Domestic Machines",
    description: "Reliable machines for home sewing, training, and small tailoring setups.",
    image: "/images/hero images/heroimage1.jpg",
  },
  {
    slug: "industrial-machines",
    name: "Industrial Machines",
    description: "High-performance machines for professional and factory production.",
    image: "/images/product images/p2.jpg",
  },
  {
    slug: "overlock-interlock",
    name: "Overlock & Interlock",
    description: "Clean finishing solutions for knitwear and garment production.",
    image: "/images/product images/Overlock Machine.jpg",
  },
  {
    slug: "garment-machinery",
    name: "Garment Machinery",
    description: "Flatlock, cutting, bartack, steam press, motors, and stands.",
    image: "/images/product images/Flatlock Machine.jpg",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Essential tools and attachments for accurate, comfortable sewing.",
    image: "/images/product images/other objects.jpg",
  },
  {
    slug: "spare-parts",
    name: "Spare Parts",
    description: "Universal and machine-specific parts for dependable service support.",
    image: "/images/product images/spare parts.jpg",
  },
];

const baseProducts: Product[] = [
  {
    slug: "zoje-zj9000e-d4",
    name: "ZJ9000E-D4 Direct Drive Lockstitch",
    brand: "ZOJE",
    category: "industrial-machines",
    image: "/images/product images/p2.jpg",
    gallery: ["/images/product images/p2.jpg", "/images/product images/p3.jpg", "/images/product images/p1.jpg"],
    shortDescription: "Electronic direct-drive lockstitch for efficient garment production.",
    description: "A factory-focused lockstitch machine with a silent direct-drive motor and automation-focused operation.",
    features: ["Silent direct-drive motor", "Energy-saving operation", "Auto thread trimming", "Auto back-tack"],
    applications: ["Garment units", "Mass production", "Professional tailoring"],
    featured: true,
    badge: "Industrial",
  },
  {
    slug: "zoje-zj8500d",
    name: "ZJ8500D Overlock / Interlock",
    brand: "ZOJE",
    category: "overlock-interlock",
    image: "/images/product images/Overlock Machine.jpg",
    gallery: ["/images/product images/Overlock Machine.jpg", "/images/product images/p2.jpg"],
    shortDescription: "High-speed finishing for knitwear and clean garment edges.",
    description: "An overlock and interlock option designed for consistent edge finishing in fast-paced sewing environments.",
    features: ["High-speed stitching", "Clean edge finishing", "Suitable for knitwear"],
    applications: ["Knitwear factories", "Garment finishing", "Tailoring studios"],
    featured: true,
    badge: "Finishing",
  },
  {
    slug: "zoje-zj1900",
    name: "ZJ1900 Bartack Machine",
    brand: "ZOJE",
    category: "garment-machinery",
    image: "/images/product images/Flatlock Machine.jpg",
    gallery: ["/images/product images/Flatlock Machine.jpg", "/images/product images/p3.jpg"],
    shortDescription: "Programmable reinforcement stitching for factory workflows.",
    description: "A pattern-capable bartack machine for reinforcement applications where repeatability matters.",
    features: ["Programmable patterns", "Reinforcement stitching", "Factory-grade workflow"],
    applications: ["Jeans", "Pocket reinforcement", "Garment production"],
    featured: true,
    badge: "Automation",
  },
  {
    slug: "jack-f4-direct-drive",
    name: "Jack F4 Direct Drive",
    brand: "JACK",
    category: "industrial-machines",
    image: "/images/product images/p3.jpg",
    gallery: ["/images/product images/p3.jpg", "/images/product images/p2.jpg"],
    shortDescription: "A low-noise, accessible industrial machine for daily tailoring work.",
    description: "A practical direct-drive choice for tailors moving into industrial sewing.",
    features: ["Beginner-friendly", "Affordable industrial option", "Low-noise operation"],
    applications: ["Tailoring shops", "Training setups", "Daily garment work"],
    featured: true,
    badge: "Popular",
  },
  {
    slug: "jack-a4b-computerized",
    name: "Jack A4B Computerized",
    brand: "JACK",
    category: "industrial-machines",
    image: "/images/product images/p1.jpg",
    gallery: ["/images/product images/p1.jpg", "/images/product images/p3.jpg"],
    shortDescription: "Computerized industrial sewing with speed control and voice guidance.",
    description: "A premium garment-production machine for teams seeking modern automation features.",
    features: ["AI speed control", "Voice guide system", "Computerized operation"],
    applications: ["Premium garments", "Production units", "Professional tailoring"],
    badge: "Computerized",
  },
  {
    slug: "jack-e4-overlock",
    name: "Jack E4 Overlock",
    brand: "JACK",
    category: "overlock-interlock",
    image: "/images/product images/Overlock Machine.jpg",
    gallery: ["/images/product images/Overlock Machine.jpg", "/images/product images/p1.jpg"],
    shortDescription: "Fast, durable overlock sewing with smooth cutting and stitching.",
    description: "A dependable finishing machine for regular garment and knitwear production.",
    features: ["Fast operation", "Durable build", "Smooth cutting and stitching"],
    applications: ["Knitwear", "Garment finishing", "Tailoring shops"],
    badge: "Popular",
  },
  {
    slug: "usha-janome-dream-stitch",
    name: "Usha Janome Dream Stitch",
    brand: "USHA",
    category: "domestic-machines",
    image: "/images/hero images/heroimage2.jpg",
    gallery: ["/images/hero images/heroimage2.jpg", "/images/hero images/heroimage1.jpg"],
    shortDescription: "Versatile domestic and semi-professional sewing for creative work.",
    description: "A multi-stitch option suitable for home sewing, training, and growing small businesses.",
    features: ["Multiple stitch patterns", "Domestic and semi-professional use", "Trusted Indian brand"],
    applications: ["Home sewing", "Training institutes", "Small businesses"],
    featured: true,
    badge: "Home & studio",
  },
  {
    slug: "usha-industrial-single-needle",
    name: "Usha Industrial Single Needle",
    brand: "USHA",
    category: "industrial-machines",
    image: "/images/product images/p1.jpg",
    gallery: ["/images/product images/p1.jpg", "/images/hero images/heroimage3.jpg"],
    shortDescription: "Durable metal-body machine for professional tailoring shops.",
    description: "A sturdy single-needle option for day-to-day tailoring and professional use.",
    features: ["Durable metal body", "Single-needle construction", "Professional setup"],
    applications: ["Tailoring shops", "Training institutes", "Professional sewing"],
  },
  {
    slug: "singer-4411-heavy-duty",
    name: "Singer 4411 Heavy Duty",
    brand: "SINGER",
    category: "domestic-machines",
    image: "/images/hero images/heroimage3.jpg",
    gallery: ["/images/hero images/heroimage3.jpg", "/images/hero images/heroimage1.jpg"],
    shortDescription: "Strong domestic machine for thick fabrics and serious home sewing.",
    description: "A heavy-duty sewing option for customers who work with denim, leather, and other demanding materials.",
    features: ["Strong motor", "Thick fabric stitching", "Home-professional hybrid"],
    applications: ["Denim", "Leather", "Home studios"],
    badge: "Heavy duty",
  },
  {
    slug: "sonex-single-needle-lockstitch",
    name: "Sonex Single Needle Lockstitch",
    brand: "SONEX",
    category: "industrial-machines",
    image: "/images/product images/p3.jpg",
    gallery: ["/images/product images/p3.jpg"],
    shortDescription: "Budget-friendly lockstitch option for local tailoring shops.",
    description: "A straightforward industrial sewing option focused on practical daily use.",
    features: ["Single needle", "Budget friendly", "Simple operation"],
    applications: ["Local tailoring shops", "Alterations", "Daily sewing"],
  },
  {
    slug: "jin-direct-drive-lockstitch",
    name: "Jin Direct Drive Lockstitch",
    brand: "JIN",
    category: "industrial-machines",
    image: "/images/product images/p2.jpg",
    gallery: ["/images/product images/p2.jpg"],
    shortDescription: "Mid-range direct-drive sewing for commercial tailoring.",
    description: "An industrial lockstitch choice for mid-range production requirements.",
    features: ["Direct drive", "Industrial build", "Mid-range option"],
    applications: ["Commercial tailoring", "Production units"],
  },
  {
    slug: "gemsy-overlock",
    name: "GEMSY Overlock",
    brand: "GEMINY",
    category: "overlock-interlock",
    image: "/images/product images/Overlock Machine.jpg",
    gallery: ["/images/product images/Overlock Machine.jpg"],
    shortDescription: "An alternative overlock option for practical garment finishing.",
    description: "A mid-budget overlock choice for smooth production finishing.",
    features: ["Overlock finishing", "Mid-budget choice", "Garment production"],
    applications: ["Garment finishing", "Knitwear"],
  },
  {
    slug: "fucen-direct-drive",
    name: "Fucen Direct Drive",
    brand: "FUCEN",
    category: "industrial-machines",
    image: "/images/product images/p1.jpg",
    gallery: ["/images/product images/p1.jpg"],
    shortDescription: "Affordable direct-drive sewing for medium production units.",
    description: "A commercial machine for workshops looking for an accessible industrial option.",
    features: ["Direct drive", "Commercial sewing", "Accessible option"],
    applications: ["Medium production units", "Tailoring shops"],
  },
  {
    slug: "universal-needle-bobbin-kit",
    name: "Universal Needle & Bobbin Kit",
    brand: "Sunil Silai Machine",
    category: "spare-parts",
    image: "/images/product images/spare parts.jpg",
    gallery: ["/images/product images/spare parts.jpg", "/images/product images/spareparts.jpg"],
    shortDescription: "Essential DBx1, DPx5, and DCx27 needles with bobbin-system support.",
    description: "Fast-moving universal sewing-machine supplies for domestic and industrial machine needs.",
    features: ["Needle sets", "Bobbin options", "Bobbin-case support"],
    applications: ["Tailoring shops", "Industrial maintenance", "Home sewing"],
    badge: "Essential",
  },
  {
    slug: "presser-foot-attachment-set",
    name: "Presser Foot & Attachment Set",
    brand: "Sunil Silai Machine",
    category: "accessories",
    image: "/images/product images/other objects.jpg",
    gallery: ["/images/product images/other objects.jpg", "/images/product images/button whole machine.jpg"],
    shortDescription: "Useful zipper, hemming, piping, and fabric-handling attachments.",
    description: "A curated accessory range for improving daily sewing accuracy and finishing.",
    features: ["Zipper foot", "Hemming foot", "Piping and edge-guide options"],
    applications: ["Home tailoring", "Garment finishing", "Daily sewing"],
    badge: "Accessories",
  },
  {
    slug: "cutting-machine-range",
    name: "Cutting Machine Range",
    brand: "Sunil Silai Machine",
    category: "garment-machinery",
    image: "/images/product images/Cutting Machine.jpg",
    gallery: ["/images/product images/Cutting Machine.jpg", "/images/product images/Steam Press.jpg"],
    shortDescription: "Garment cutting equipment for efficient workshop preparation.",
    description: "Ask our team for help choosing a cutting setup suited to your fabric and production volume.",
    features: ["Garment preparation", "Workshop equipment", "Product consultation available"],
    applications: ["Garment units", "Tailoring workshops", "Fabric cutting"],
  },
];

function productKey(product: Product) {
  const value = `${product.modelNumber ?? ""} ${product.name}`
    .toLowerCase()
    .replace(new RegExp(product.brand.toLowerCase(), "g"), "")
    .replace(/usha\s*janome|sewing\s*machine|machine|series|model|lockstitch|direct\s*drive|high\s*speed|single\s*needle|industrial|official/g, "")
    .replace(/[^a-z0-9]+/g, "");
  return `${product.brand.toLowerCase()}|${value}`;
}

function presentSpecification(value: string | undefined) {
  return Boolean(value && value !== "Not available from verified source");
}

/**
 * Keep hand-curated slugs/copy/media where present and add only the missing
 * verified fields from the generated import. This prevents the import from
 * duplicating a model that already exists in the storefront.
 */
function enrichProduct(existing: Product, product: Product) {
    const mergedSpecifications = { ...product.specifications };
    for (const [label, value] of Object.entries(existing.specifications ?? {})) {
      if (presentSpecification(value) || !presentSpecification(mergedSpecifications[label])) mergedSpecifications[label] = value;
    }
    return {
      ...existing,
      modelNumber: existing.modelNumber ?? product.modelNumber,
      subcategory: existing.subcategory ?? product.subcategory,
      series: existing.series ?? product.series,
      variant: existing.variant ?? product.variant,
      productType: existing.productType ?? product.productType,
      image: existing.image || product.image,
      gallery: existing.gallery.length ? existing.gallery : product.gallery,
      specifications: mergedSpecifications,
      source: product.source ?? existing.source,
      importNotes: product.importNotes ?? existing.importNotes,
      features: [...new Set([...existing.features, ...product.features])],
      applications: [...new Set([...existing.applications, ...product.applications])],
    };
}

function mergeCatalogueProducts(current: Product[], incoming: Product[]) {
  const byKey = new Map(current.map((product) => [productKey(product), product]));
  for (const product of incoming) {
    const key = productKey(product);
    const existing = byKey.get(key);
    byKey.set(key, existing ? enrichProduct(existing, product) : product);
  }
  const bySlug = new Map<string, Product>();
  for (const product of byKey.values()) {
    const existing = bySlug.get(product.slug);
    bySlug.set(product.slug, existing ? enrichProduct(existing, product) : product);
  }
  return [...bySlug.values()].sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
}

export const products: Product[] = mergeCatalogueProducts([...baseProducts, ...brochureProducts], importedProducts)
  .filter((product) => !excludedShopBrands.has(product.brand.toUpperCase()));

export const spareParts = [
  "Needle sets, bobbins, and bobbin cases",
  "Tension discs, springs, thread guides, and take-up levers",
  "Rotary hooks, shuttle hooks, hook drivers, and hook races",
  "Presser feet, feed dogs, presser bars, and lifters",
  "Servo motors, clutch motors, belts, foot pedals, and carbon brushes",
  "Machine oil, oil pumps, filters, and cleaning brushes",
  "Lockstitch needle plates, bobbin winders, reverse levers, and trimmer knives",
  "Overlock loopers, cutting knives, differential-feed parts, and needle guards",
];

export const accessories = [
  "Needle boxes, thread cones, thread stands, and organisers",
  "Tailor scissors, thread snips, measuring tape, rotary cutters, and blades",
  "Machine tables, stands, LED lights, external foot pedals, and covers",
  "Fabric clips, pins, tailor chalk, marking pens, and pin cushions",
  "Cleaning brushes, oil bottles, lint removers, and mini vacuum tools",
  "Zipper feet, hemming feet, bias binders, edge guides, folders, and clamp frames",
];

export function productBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

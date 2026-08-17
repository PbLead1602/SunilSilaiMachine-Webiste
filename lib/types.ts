export type Locale = "en" | "hi" | "mr";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  /** Manufacturer/dealer model code or the most specific published model label. */
  modelNumber?: string;
  category: string;
  subcategory?: string;
  series?: string;
  variant?: string;
  productType?: string;
  /** Empty only when a verified source did not provide a safe model-specific image. */
  image?: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  features: string[];
  applications: string[];
  specifications?: Record<string, string>;
  source?: {
    officialSource: boolean;
    sourceType: string;
    url: string;
    brochureUrl?: string;
    lastVerifiedAt: string;
    verificationStatus: "official" | "cross-verified" | "dealer-verified" | "unverified";
  };
  importNotes?: string;
  featured?: boolean;
  badge?: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

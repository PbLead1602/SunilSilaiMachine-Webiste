import type { Product } from "@/lib/types";

type BrochureModel = {
  name: string;
  image: string;
  category: Product["category"];
  modelNumber?: string;
  productType?: string;
};

const assetRoot = "/images/products/brochure";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function brochureProduct(brand: string, model: BrochureModel): Product {
  const slug = `${toSlug(brand)}-${toSlug(model.name)}`;
  const modelNumber = model.modelNumber ?? model.name;
  const productType = model.productType ?? "Sewing machine";

  return {
    slug,
    name: `${brand} ${model.name}`,
    brand,
    modelNumber,
    category: model.category,
    subcategory: productType,
    series: modelNumber,
    variant: productType,
    productType,
    image: model.image,
    gallery: [model.image],
    shortDescription: `${productType}. Model ${modelNumber} is shown in the supplied official brochure image.`,
    description: `Model ${modelNumber}; variant/type: ${productType}. This product image is supplied in the official brochure. Contact Sunil Silai Machine for current availability, configuration guidance, and price.`,
    features: [`Model number: ${modelNumber}`, `Variant/type: ${productType}`, "Official brochure image"],
    applications: [],
  };
}

const jackModels: BrochureModel[] = [
  { name: "J6-A Automatic", image: `${assetRoot}/jack/automatic-j6-a.jpg`, category: "garment-machinery" },
  { name: "Z7 Heavy Duty", image: `${assetRoot}/jack/heavy-duty-z7.jpg`, category: "industrial-machines" },
  { name: "K60 Interlock", image: `${assetRoot}/jack/interlock-k60.jpg`, category: "overlock-interlock" },
  { name: "A5E-B / AMH2 Lockstitch", image: `${assetRoot}/jack/lockstitch-a5e-b-amh2.jpg`, category: "industrial-machines" },
  { name: "C7 URUS Overlock", image: `${assetRoot}/jack/overlock-c7-urus.jpg`, category: "overlock-interlock" },
  { name: "S7 Postbed", image: `${assetRoot}/jack/postbed-s7.jpg`, category: "industrial-machines" },
  { name: "M9-A Template", image: `${assetRoot}/jack/template-m9-a.jpg`, category: "garment-machinery" },
];

const zojeModels: BrochureModel[] = [
  { name: "ZJ-311-BR Automation for Jeans", modelNumber: "ZJ-311-BR", productType: "Automation for Jeans", image: `${assetRoot}/zoje/zoje-automation-for-jeans-zj-311-br.jpg`, category: "garment-machinery" },
  { name: "ZJ3800-BD Chainstitch", modelNumber: "ZJ3800-BD", productType: "Chainstitch", image: `${assetRoot}/zoje/zoje-chainstitch-zj3800-bd.jpg`, category: "garment-machinery" },
  { name: "ZJ2842-5-BD-D3-3 Double Needle Lockstitch", modelNumber: "ZJ2842-5-BD-D3-3", productType: "Double Needle Lockstitch", image: `${assetRoot}/zoje/zoje-double-needle-lockstitch-zj2842-5-bd-d3-3.jpg`, category: "industrial-machines" },
  { name: "ZJ9630-D3-H-3 / ZJ9640-D3-H-3 Heavy Duty", modelNumber: "ZJ9630-D3-H-3 / ZJ9640-D3-H-3", productType: "Heavy Duty", image: `${assetRoot}/zoje/zoje-heavy-duty-zj9630-d3-h-3-zj9640-d3-h-3.jpg`, category: "industrial-machines" },
  { name: "C5000-356-D3B-02 Interlock", modelNumber: "C5000-356-D3B-02", productType: "Interlock", image: `${assetRoot}/zoje/zoje-interlock-c5000-356-d3b-02.jpg`, category: "overlock-interlock" },
  { name: "B9500-13 Overlock", modelNumber: "B9500-13", productType: "Overlock", image: `${assetRoot}/zoje/zoje-overlock-b9500-13.jpg`, category: "overlock-interlock" },
  { name: "ZJ5770A-3020HF1-C Pattern Sewing", modelNumber: "ZJ5770A-3020HF1-C", productType: "Pattern Sewing", image: `${assetRoot}/zoje/zoje-pattern-sewing-zj5770a-3020hf1-c.jpg`, category: "garment-machinery" },
  { name: "A8000-D4-G Single Needle Lockstitch", modelNumber: "A8000-D4-G", productType: "Single Needle Lockstitch", image: `${assetRoot}/zoje/zoje-single-needle-lockstitch-a8000-d4-g.jpg`, category: "industrial-machines" },
  { name: "ZJ5780DS-V3 Special Function", modelNumber: "ZJ5780DS-V3", productType: "Special Function", image: `${assetRoot}/zoje/zoje-special-function-zj5780ds-v3.jpg`, category: "garment-machinery" },
  { name: "ZJ-M8-GS800-SF Templating", modelNumber: "ZJ-M8-GS800-SF", productType: "Templating", image: `${assetRoot}/zoje/zoje-templating-zj-m8-gs800-sf.jpg`, category: "garment-machinery" },
  { name: "ZJ2290S-SR Zigzag", modelNumber: "ZJ2290S-SR", productType: "Zigzag", image: `${assetRoot}/zoje/zoje-zigzag-zj2290s-sr.jpg`, category: "garment-machinery" },
];

const ushaAutomaticModels: BrochureModel[] = [
  "Allure DLX", "Allure", "Design Craft", "Dream Maker 120", "Dream Stitch", "Excella DLX", "Marvella", "My Fab Barbie", "Mystique", "Quilt Magic", "Sew Magic", "Stella", "Stitch Magic", "Style Stitch", "Surger 9102 D", "Wonder Stitch Plus", "Wonder Stitch",
].map((name) => ({ name, image: `${assetRoot}/usha/automatic-zig-zag/${toSlug(name)}.jpg`, category: "domestic-machines" }));

const ushaIndustrialModels: BrochureModel[] = [
  { name: "747E Direct Drive 2-Needle 4-Thread Overlock Machine", category: "overlock-interlock" },
  { name: "757 Direct Drive 2-Needle 5-Thread Overlock Machine", category: "overlock-interlock" },
  { name: "Craft Master Composite Foot With Cast Iron Stand", category: "industrial-machines" },
  { name: "Craft Master DLX Composite Foot With Cast Iron Stand", category: "industrial-machines" },
  { name: "Design Master Top", category: "industrial-machines" },
  { name: "Leather Stitch Top", category: "industrial-machines" },
  { name: "Magic Master Top", category: "industrial-machines" },
  { name: "Overlock", category: "overlock-interlock" },
  { name: "Quick Stitch Top", category: "industrial-machines" },
  { name: "Rotary Stitch Master Pro Top With Usha Hook", category: "industrial-machines" },
  { name: "Rotary Stitch Master Top with Usha Hook", category: "industrial-machines" },
  { name: "S2 Direct Drive Single Needle Lockstitch High Speed Machine", category: "industrial-machines" },
  { name: "S2B Direct Drive Single Needle Lockstitch High Speed Machine With Large Hook", category: "industrial-machines" },
  { name: "S2E1 Direct Drive Single Needle Lockstitch High Speed Machine With Trimmer", category: "industrial-machines" },
].map((model) => ({ ...model, image: `${assetRoot}/usha/industrial/${toSlug(model.name)}.jpg` }));

const ushaMemoryCraftModels: BrochureModel[] = [
  "Memory Craft 15000", "Memory Craft 450E", "Memory Craft 6700 P", "Memory Craft 8200 QCP SE", "Memory Craft MB 7E", "Memory Craft MC 550 E", "Memory Craft MC 9850", "Memory Craft Skyline S9",
].map((name) => ({ name, image: `${assetRoot}/usha/memory-craft/${toSlug(name)}.jpg`, category: "domestic-machines" }));

const ushaStraightStitchModels: BrochureModel[] = [
  "Aayush Composite Hand Operated", "Anand Composite Hand Operated", "Anand Composite with PBC", "Anand DLX Composite Hand Operated", "Bandhan Composite Hand Operated", "Bandhan Composite with PBC", "Bandhan DLX Composite Hand Operated", "Bandhan DLX Composite with PBC", "Butterfly Composite Hand Operated", "Champion Composite Hand Operated", "Link DLX Composite Hand Operated", "Roopa Family Composite Hand Operated", "Streamlined Composite Hand Operated", "Tailor DLX Cherry Brown Composite Hand Operated", "Tailor DLX Cherry Red Composite Hand Operated", "Tailor DLX Composite Hand Operated", "Tailor DLX Golden Silver Composite Hand Operated", "Tailor DLX Metallic Brown Composite Hand Operated", "Tailor DLX Pacific Blue Composite Hand Operated", "Tailor Super DLX Composite Hand Operated", "Tailor Supreme Composite Hand Operated", "Umang Composite Hand Operated", "Umang Composite with PBC",
].map((name) => ({ name, image: `${assetRoot}/usha/straight-stitch/${toSlug(name)}.jpg`, category: "domestic-machines" }));

/**
 * Product/media manifest for the supplied JACK, ZOJE, and USHA brochures.
 * Images are copied from the brochure into public/images/products/brochure.
 */
export const brochureProducts: Product[] = [
  ...jackModels.map((model) => brochureProduct("JACK", model)),
  ...zojeModels.map((model) => brochureProduct("ZOJE", model)),
  ...ushaAutomaticModels.map((model) => brochureProduct("USHA", model)),
  ...ushaIndustrialModels.map((model) => brochureProduct("USHA", model)),
  ...ushaMemoryCraftModels.map((model) => brochureProduct("USHA", model)),
  ...ushaStraightStitchModels.map((model) => brochureProduct("USHA", model)),
];

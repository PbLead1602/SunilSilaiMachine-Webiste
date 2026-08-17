import { PrismaClient } from "@prisma/client";
import { brands, categories, products } from "../lib/business";

const prisma = new PrismaClient();

async function main() {
  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.upsert({ where: { slug: category.slug }, update: { name: category.name, description: category.description, imageUrl: category.image }, create: { name: category.name, slug: category.slug, description: category.description, imageUrl: category.image } });
    categoryMap.set(category.slug, record.id);
  }
  const brandMap = new Map<string, string>();
  for (const brand of brands) { const record = await prisma.brand.upsert({ where: { slug: brand.toLowerCase() }, update: { name: brand }, create: { name: brand, slug: brand.toLowerCase() } }); brandMap.set(brand, record.id); }
  for (const product of products) {
    const categoryId = categoryMap.get(product.category); if (!categoryId) continue;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { name: product.name, shortDescription: product.shortDescription, description: product.description, featured: product.featured ?? false, categoryId, brandId: brandMap.get(product.brand) },
      create: { name: product.name, slug: product.slug, shortDescription: product.shortDescription, description: product.description, featured: product.featured ?? false, categoryId, brandId: brandMap.get(product.brand), images: { create: product.gallery.map((url, sortOrder) => ({ url, alt: product.name, sortOrder })) }, specs: { create: product.features.map((value, sortOrder) => ({ label: "Feature", value, sortOrder })) } },
    });
  }
}

main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });

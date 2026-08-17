import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() { const session = await auth(); return Boolean(session?.user); }

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await prisma.product.findMany({ include: { brand: true, category: true, images: true }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { name?: string; slug?: string; shortDescription?: string; description?: string; categoryId?: string; brandId?: string };
  if (!body.name || !body.slug || !body.shortDescription || !body.description || !body.categoryId) return NextResponse.json({ error: "Required product fields are missing" }, { status: 400 });
  const product = await prisma.product.create({ data: { name: body.name, slug: body.slug, shortDescription: body.shortDescription, description: body.description, categoryId: body.categoryId, brandId: body.brandId || null } });
  return NextResponse.json({ data: product }, { status: 201 });
}

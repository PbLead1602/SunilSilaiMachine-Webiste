import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/business";
import { productMatches } from "@/lib/catalogue-utils";

export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim() || "";
  const data = q ? products.filter((product) => productMatches(product, q)) : products;
  return NextResponse.json({ data });
}

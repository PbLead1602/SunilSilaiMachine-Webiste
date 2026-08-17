import { NextResponse } from "next/server";
import { products } from "@/lib/business";

export function GET() { return NextResponse.json({ data: products }); }

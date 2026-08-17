import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";
import { leadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = leadSchema.parse(await request.json());
    const lead = await createLead(input);
    return NextResponse.json({ id: lead.id, ok: true }, { status: 201 });
  } catch (error) {
    console.error("Unable to create website lead", error);
    return NextResponse.json({ error: "We could not save this enquiry. Please call or WhatsApp us directly." }, { status: 400 });
  }
}

import { prisma } from "@/lib/prisma";
import type { LeadInput } from "@/lib/validation";

/**
 * Keeps the optional internal lead record only. Public website forms open
 * WhatsApp directly and never send email notifications.
 */
export async function createLead(input: LeadInput) {
  const customer = await prisma.customer.upsert({
    where: { phone: input.phone },
    create: { name: input.name, phone: input.phone, email: input.email || null },
    update: { name: input.name, email: input.email || undefined },
  });

  return prisma.lead.create({ data: { ...input, email: input.email || null, customerId: customer.id } });
}

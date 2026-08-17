import { z } from "zod";

export const leadSchema = z.object({
  type: z.enum(["PRODUCT", "CONTACT", "REPAIR", "FINANCE"]),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
  productName: z.string().trim().max(180).optional(),
  machine: z.string().trim().max(180).optional(),
  address: z.string().trim().max(400).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

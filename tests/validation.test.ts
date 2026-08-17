import { describe, expect, it } from "vitest";
import { leadSchema } from "../lib/validation";

describe("leadSchema", () => {
  it("accepts a valid product enquiry", () => {
    expect(leadSchema.safeParse({ type: "PRODUCT", name: "Sagar Bodade", phone: "+91 82080 21624", message: "Please share availability", productName: "Jack F4" }).success).toBe(true);
  });
  it("requires a useful message and contact number", () => {
    expect(leadSchema.safeParse({ type: "CONTACT", name: "A", phone: "", message: "Hi" }).success).toBe(false);
  });
});

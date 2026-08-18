"use client";

import { LoaderCircle, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isLocale, ui } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/utils";

type FormType = "PRODUCT" | "CONTACT" | "REPAIR" | "FINANCE";

const fieldClassName = "min-h-14 w-full min-w-0 rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold sm:px-5";

const enquiryType: Record<FormType, string> = {
  PRODUCT: "product enquiry",
  CONTACT: "general enquiry",
  REPAIR: "repair booking",
  FINANCE: "finance enquiry",
};

export function InquiryForm({ type = "CONTACT", productName, compact = false }: { type?: FormType; productName?: string; compact?: boolean }) {
  const [openingWhatsApp, setOpeningWhatsApp] = useState(false);
  const language = usePathname().split("/")[1];
  const copy = ui(isLocale(language) ? language : "en");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpeningWhatsApp(true);

    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    const message = [
      "Hello Sunil Silai Machine,",
      "",
      `Website ${enquiryType[type]}:`,
      `Name: ${value("name")}`,
      `Phone / WhatsApp: ${value("phone")}`,
      productName ? `Product: ${productName}` : "",
      value("machine") ? `Machine: ${value("machine")}` : "",
      value("address") ? `Address / area: ${value("address")}` : "",
      "",
      `Requirement: ${value("message")}`,
    ].filter(Boolean).join("\n");

    window.location.assign(whatsappUrl(message));
  }

  return (
    <form onSubmit={submit} className="grid min-w-0 gap-4">
      <input name="name" required placeholder={copy.name} className={fieldClassName} />
      <input name="phone" required inputMode="tel" placeholder={copy.phone} className={fieldClassName} />
      {type === "REPAIR" && <><input name="machine" required placeholder={copy.machine} className={fieldClassName} /><input name="address" required placeholder={copy.address} className={fieldClassName} /></>}
      {type === "FINANCE" && <input name="machine" placeholder={copy.machine} className={fieldClassName} />}
      <textarea name="message" required rows={compact ? 3 : 4} placeholder={type === "REPAIR" ? copy.repairIssue : copy.message} className="w-full min-w-0 resize-none rounded-xl border border-line bg-white px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-gold sm:px-5" />
      <p className="text-sm leading-6 text-stone-500">{copy.privacy}</p>
      <button disabled={openingWhatsApp} className="button-primary w-full disabled:opacity-60">{openingWhatsApp ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}{openingWhatsApp ? copy.sending : copy.chatWhatsapp}</button>
    </form>
  );
}

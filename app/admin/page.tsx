import { BarChart3, Boxes, FileText, Image as ImageIcon, LayoutPanelTop, Settings, Users, Wrench } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const modules = [
  [Boxes, "Catalogue", "Products, brands, categories, specifications, and media"],
  [FileText, "Lead inbox", "Product, contact, repair, and finance requests"],
  [Wrench, "Services & finance", "Service content and purchase-assistance messages"],
  [Users, "Customers", "Contact records collected from website enquiries"],
  [LayoutPanelTop, "Homepage", "Hero, category, brand, and supporting content"],
  [ImageIcon, "Media library", "Cloudinary-managed images and local development assets"],
  [Settings, "SEO & settings", "Business details, metadata, and site configuration"],
];

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return <><div className="mt-8 flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">Staff dashboard</p><h1 className="mt-2 font-display text-4xl font-semibold">Welcome back.</h1><p className="mt-2 text-stone-600">Manage the catalogue and follow up website enquiries.</p></div><div className="min-w-0 rounded-2xl bg-ink px-5 py-4 text-sm leading-6 text-white"><BarChart3 className="mr-2 inline size-4 shrink-0 text-gold" />Lead analytics appear here after the database is connected.</div></div><section className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map(([Icon, title, text]) => { const ModuleIcon = Icon as typeof Boxes; return <div className="min-w-0 rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6" key={title as string}><ModuleIcon className="size-6 text-clay" /><h2 className="mt-5 font-display text-xl font-semibold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{text as string}</p><button className="mt-5 min-h-10 text-sm font-semibold text-clay">Configure module →</button></div>; })}</section><div className="mt-8 min-w-0 rounded-3xl border border-[#dfc59e] bg-[#fff8ec] p-5 text-sm leading-6 text-stone-700 sm:p-6"><strong>Deployment checklist:</strong> set database, Auth.js, Cloudinary, and Resend environment variables; run the Prisma migration and seed; then use protected REST endpoints to connect the selected management UI.</div></>;
}

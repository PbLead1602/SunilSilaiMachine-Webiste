import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen min-w-0 bg-[#f5f2ee] p-5 sm:p-10"><div className="mx-auto min-w-0 max-w-6xl"><Link href="/en" className="font-display text-sm font-semibold text-clay">← View public website</Link>{children}</div></main>;
}

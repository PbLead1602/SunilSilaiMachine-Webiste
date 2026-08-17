"use client";

import { LockKeyhole } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: data.get("email"), password: data.get("password"), redirect: false });
    if (result?.error) setError("The supplied staff credentials were not accepted.");
    else window.location.assign("/admin");
  }

  return <div className="mx-auto mt-10 max-w-md rounded-3xl border border-line bg-white p-5 shadow-soft sm:mt-16 sm:p-7"><LockKeyhole className="size-8 text-clay" /><h1 className="mt-5 font-display text-3xl font-semibold">Staff sign in</h1><p className="mt-2 text-sm leading-6 text-stone-600">Use the credentials configured in the deployment environment.</p><form onSubmit={submit} className="mt-7 grid min-w-0 gap-3"><input required name="email" type="email" placeholder="Staff email" className="min-h-12 w-full min-w-0 rounded-xl border border-line px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" /><input required name="password" type="password" placeholder="Password" className="min-h-12 w-full min-w-0 rounded-xl border border-line px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold" /><button className="button-primary mt-2 w-full">Sign in</button>{error && <p className="text-center text-xs leading-5 text-red-600">{error}</p>}</form></div>;
}

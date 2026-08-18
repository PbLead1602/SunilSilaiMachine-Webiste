import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Staff management is deliberately opt-in for the public catalogue launch.
 * Auth.js requires a stable signing secret in production; until the three
 * admin values are configured, no login or protected API is exposed.
 */
export const adminEnabled = Boolean(process.env.AUTH_SECRET && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);

const configuredAuth = adminEnabled ? NextAuth({
  session: { strategy: "jwt" },
  providers: [Credentials({
    name: "Staff access",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (email && password && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) return { id: "environment-admin", email, name: "Sunil Silai Machine Admin", role: "ADMIN" };
      return null;
    },
  })],
  pages: { signIn: "/admin/login" },
}) : null;

const disabledHandler = () => new Response("Not found", { status: 404 });

export const handlers = configuredAuth?.handlers ?? { GET: disabledHandler, POST: disabledHandler };
export const auth = configuredAuth?.auth ?? (async () => null);
export const signIn = configuredAuth?.signIn ?? (async () => { throw new Error("Staff administration is not configured."); });
export const signOut = configuredAuth?.signOut ?? (async () => { throw new Error("Staff administration is not configured."); });

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
});

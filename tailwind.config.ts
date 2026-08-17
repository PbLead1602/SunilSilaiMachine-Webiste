import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2F241F",
        clay: "#A67C52",
        gold: "#D8B37A",
        canvas: "#FAF8F5",
        line: "#ECE7E1",
      },
      boxShadow: {
        soft: "0 14px 42px rgba(47, 36, 31, 0.08)",
        card: "0 4px 18px rgba(47, 36, 31, 0.06)",
      },
      borderRadius: { "4xl": "2rem" },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        display: ["Poppins", "Noto Sans Devanagari", "Arial", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "Arial", "sans-serif"],
      },
      // The customer-facing scale is six pixels larger than Tailwind's defaults.
      // Each leading value is deliberately generous so Devanagari matras stay clear.
      fontSize: {
        xs: ["1.125rem", { lineHeight: "1.625rem" }],
        sm: ["1.25rem", { lineHeight: "1.875rem" }],
        base: ["1.375rem", { lineHeight: "2rem" }],
        lg: ["1.5rem", { lineHeight: "2.125rem" }],
        xl: ["1.625rem", { lineHeight: "2.25rem" }],
        "2xl": ["1.875rem", { lineHeight: "2.5rem" }],
        "3xl": ["2.5rem", { lineHeight: "3.125rem" }],
        "4xl": ["2.75rem", { lineHeight: "3.375rem" }],
        "5xl": ["3.5rem", { lineHeight: "4.125rem" }],
        "6xl": ["4.125rem", { lineHeight: "4.75rem" }],
      },
      // Lift general copy one step and emphasis one or two steps, without loading
      // an overly dense black weight for long Hindi and Marathi passages.
      fontWeight: {
        normal: "500",
        medium: "600",
        semibold: "700",
        bold: "700",
      },
    },
  },
  plugins: [],
};

export default config;

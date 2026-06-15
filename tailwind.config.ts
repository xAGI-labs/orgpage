import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Aptos", "Satoshi", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Recoleta", "Charter", "Georgia", "serif"]
      },
      boxShadow: {
        "paper-lift": "0 24px 60px color-mix(in oklch, var(--ink) 12%, transparent)"
      }
    }
  },
  plugins: []
} satisfies Config;

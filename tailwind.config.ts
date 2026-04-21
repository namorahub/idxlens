import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#05080f",
          900: "#0a1020",
          850: "#0d1528",
          800: "#111c32",
          750: "#15243d",
          700: "#1a2f4d",
          600: "#244066",
          500: "#2f5280",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(148, 163, 184, 0.06), 0 24px 48px -12px rgba(0, 0, 0, 0.45)",
        "glow-sm": "0 0 0 1px rgba(148, 163, 184, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

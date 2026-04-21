import type { ReactNode } from "react";
import { DM_Sans, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "NamoraQuant — News Intelligence",
  description: "Analisis berita saham Indonesia dengan sintesis AI.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}

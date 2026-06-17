import "./globals.css";
import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  title: "Diletta BI · Marketing Dashboard",
  description: "Painel de marketing da Diletta Solutions — Inbound + Outbound consolidados.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable} dark`}>
      <body className="min-h-screen bg-diletta-bg text-diletta-text1">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

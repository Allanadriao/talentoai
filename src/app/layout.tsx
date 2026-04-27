import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TalentoIA | Analisador Inteligente de Candidatos",
  description: "Plataforma SaaS para análise de currículos com Inteligência Artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="min-h-screen bg-[#F8F9FD] text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Profecía Forense | Kissingers Araque",
  description:
    "Plataforma de formación espiritual diseñada para activar, entrenar y equipar líderes, videntes e intercesores en el lenguaje profético de Dios.",
  keywords: "profecia, forense, kissingers araque, formacion espiritual, ministerio, profeta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050510] text-[#f0e6d3]">
        {children}
      </body>
    </html>
  );
}

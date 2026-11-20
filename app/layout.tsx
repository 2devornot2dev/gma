import type { Metadata } from "next";
import { Archivo, Geist } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GMA | Global Meat Import & Export",
  description:
    "GMA is a global meat import and export company supplying premium beef, pork, and poultry through a fully certified cold chain.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${geist.variable}`}>
      <body className="bg-white font-sans text-steel-900 antialiased">
        {children}
      </body>
    </html>
  );
}
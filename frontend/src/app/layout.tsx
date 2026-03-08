import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Samfer Imoveis",
  description: "Samfer Imoveis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={urbanist.variable}>
      <body className="font-[var(--font-urbanist)]">
        {children}
      </body>
    </html>
  );
}

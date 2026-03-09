import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { brandName, defaultDescription, defaultTitle, getSiteUrl } from "@/lib/seo";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${brandName} | ${defaultTitle}`,
    template: `%s | ${brandName}`,
  },
  description: defaultDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: brandName,
    title: `${brandName} | ${defaultTitle}`,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} | ${defaultTitle}`,
    description: defaultDescription,
  },
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

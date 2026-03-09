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

const themeInitScript = `
  (() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = saved ? saved === "dark" : prefersDark;
      document.documentElement.classList.toggle("dark", isDark);
    } catch {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={urbanist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-[var(--font-urbanist)]">
        {children}
      </body>
    </html>
  );
}

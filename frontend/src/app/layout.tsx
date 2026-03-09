import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { brandName, defaultDescription, defaultKeywords, defaultTitle, getSiteUrl, toAbsoluteUrl } from "@/lib/seo";
import { samferImages } from "@/components/samfer/content";
import { SpeedInsights } from "@vercel/speed-insights/next"

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
  keywords: defaultKeywords,
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: brandName,
    title: `${brandName} | ${defaultTitle}`,
    description: defaultDescription,
    images: [toAbsoluteUrl(samferImages.hero)],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} | ${defaultTitle}`,
    description: defaultDescription,
    images: [toAbsoluteUrl(samferImages.hero)],
  },
  icons: {
    icon: [
      {
        url: "/images/favicon-light.svg",
        type: "image/svg+xml",
      },
      {
        url: "/images/favicon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/favicon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: ["/images/favicon-light.svg"],
    apple: [
      {
        url: "/images/favicon-light.svg",
      },
    ],
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
        <SpeedInsights />
      </body>
    </html>
  );
}

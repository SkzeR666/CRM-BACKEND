import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Estatein",
  description: "Premium real estate platform",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-oid=".i:_do8">
      <body className="antialiased" data-oid="z-ryflb">
        {children}
      </body>
    </html>
  );
}

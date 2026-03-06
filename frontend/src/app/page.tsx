import { SiteHeader } from "@/components/layout/site-header";
import { LandingPageClient } from "@/components/landing/landing-page-client";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base text-primary">
      <SiteHeader />
      <div className="h-[124px]" />
      <LandingPageClient />
    </main>
  );
}
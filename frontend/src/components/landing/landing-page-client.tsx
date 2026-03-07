"use client";

import { useState } from "react";
import { HeroBanner } from "@/components/landing/hero-banner";
import { PropertyFilters } from "@/components/landing/property-filters";
import { FeaturedProperties } from "@/components/landing/featured-properties";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import {
  featuredProperties,
  PropertyItem,
  testimonials,
  faqs,
} from "@/data/landing";
import { SiteFooter } from "@/components/layout/site-footer";
import { Reveal } from "@/components/animations/reveal";

export function LandingPageClient() {
  const [filteredProperties, setFilteredProperties] =
    useState<PropertyItem[]>(featuredProperties);

  return (
    <>
      <HeroBanner
        imageSrc="/images/hero-property.jpg"
        imageAlt="Empreendimento residencial em destaque"
      />

      <Reveal delay={0.05}>
        <PropertyFilters
          properties={featuredProperties}
          onFilteredResults={setFilteredProperties}
        />
      </Reveal>

      <Reveal delay={0.08}>
        <FeaturedProperties properties={filteredProperties} />
      </Reveal>

      <Reveal delay={0.1}>
        <TestimonialsSection testimonials={testimonials} />
      </Reveal>

      <Reveal delay={0.12}>
        <FaqSection items={faqs} />
      </Reveal>

      <Reveal delay={0.14}>
        <SiteFooter />
      </Reveal>
    </>
  );
}
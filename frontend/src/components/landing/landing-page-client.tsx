"use client";

import { useState } from "react";
import { HeroBanner } from "@/components/landing/hero-banner";
import { PropertyFilters } from "@/components/landing/property-filters";
import { FeaturedProperties } from "@/components/landing/featured-properties";
import { featuredProperties, PropertyItem } from "@/data/landing";

export function LandingPageClient() {
  const [filteredProperties, setFilteredProperties] =
    useState<PropertyItem[]>(featuredProperties);

  return (
    <>
      <HeroBanner
        imageSrc="/images/hero-property.jpg"
        imageAlt="Empreendimento residencial em destaque"
      />

      <PropertyFilters
        properties={featuredProperties}
        onFilteredResults={setFilteredProperties}
      />

      <FeaturedProperties properties={filteredProperties} />
    </>
  );
}
"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { PropertyItem } from "@/data/landing";

type FilterValues = {
  region: string;
  type: string;
  priceRange: string;
  suites: string;
  parkingSpots: string;
  bedrooms: string;
};

type PropertyFiltersProps = {
  properties: PropertyItem[];
  onFilteredResults: (items: PropertyItem[]) => void;
};

const initialFilters: FilterValues = {
  region: "",
  type: "",
  priceRange: "",
  suites: "",
  parkingSpots: "",
  bedrooms: "",
};

function matchesPriceRange(price: number, range: string) {
  if (!range) return true;

  switch (range) {
    case "ate-500":
      return price <= 500000;
    case "500-800":
      return price > 500000 && price <= 800000;
    case "800-1200":
      return price > 800000 && price <= 1200000;
    case "1200+":
      return price > 1200000;
    default:
      return true;
  }
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          bg-surface border-subtle text-secondary label-md
          h-[100px] w-full appearance-none rounded-[10px] border
          px-6 pr-14 outline-none transition
          focus:border-[var(--primary)]
        "
      >
        <option value="">{placeholder}</option>
        {children}
      </select>

      <ChevronDown
        size={20}
        strokeWidth={1.8}
        className="text-icon-default pointer-events-none absolute right-6 top-1/2 -translate-y-1/2"
      />
    </div>
  );
}

export function PropertyFilters({
  properties,
  onFilteredResults,
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const regionOptions = useMemo(
    () => [...new Set(properties.map((item) => item.location))],
    [properties]
  );

  const typeOptions = useMemo(
    () => [...new Set(properties.map((item) => item.type))],
    [properties]
  );

  function updateFilter<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleSearch() {
    const filtered = properties.filter((property) => {
      const matchesRegion = !filters.region || property.location === filters.region;
      const matchesType = !filters.type || property.type === filters.type;
      const matchesSuites =
        !filters.suites || property.suites >= Number(filters.suites);
      const matchesParking =
        !filters.parkingSpots || property.parkingSpots >= Number(filters.parkingSpots);
      const matchesBedrooms =
        !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms);
      const matchesPrice = matchesPriceRange(property.price, filters.priceRange);

      return (
        matchesRegion &&
        matchesType &&
        matchesSuites &&
        matchesParking &&
        matchesBedrooms &&
        matchesPrice
      );
    });

    onFilteredResults(filtered);
  }

  return (
    <section aria-label="Filtros de busca" className="pt-[56px] md:pt-[72px]">
      <Container>
        <div className="mx-auto max-w-[1440px]">
          <div className="px-3 py-8 text-center">
            <h2 className="heading-xl text-primary">
              Veja opções <span className="text-[var(--primary)]">ideais</span> para o{" "}
              <span className="text-[var(--primary)]">seu perfil</span>
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <FilterSelect
              value={filters.region}
              onChange={(value) => updateFilter("region", value)}
              placeholder="Região"
            >
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={filters.type}
              onChange={(value) => updateFilter("type", value)}
              placeholder="Tipo"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={filters.priceRange}
              onChange={(value) => updateFilter("priceRange", value)}
              placeholder="Preço de venda"
            >
              <option value="ate-500">Até R$ 500 mil</option>
              <option value="500-800">R$ 500 mil a R$ 800 mil</option>
              <option value="800-1200">R$ 800 mil a R$ 1,2 mi</option>
              <option value="1200+">Acima de R$ 1,2 mi</option>
            </FilterSelect>

            <FilterSelect
              value={filters.suites}
              onChange={(value) => updateFilter("suites", value)}
              placeholder="Suítes"
            >
              <option value="1">1+ suítes</option>
              <option value="2">2+ suítes</option>
              <option value="3">3+ suítes</option>
            </FilterSelect>

            <FilterSelect
              value={filters.parkingSpots}
              onChange={(value) => updateFilter("parkingSpots", value)}
              placeholder="Vagas"
            >
              <option value="1">1+ vagas</option>
              <option value="2">2+ vagas</option>
              <option value="3">3+ vagas</option>
            </FilterSelect>

            <FilterSelect
              value={filters.bedrooms}
              onChange={(value) => updateFilter("bedrooms", value)}
              placeholder="Quartos"
            >
              <option value="1">1+ quartos</option>
              <option value="2">2+ quartos</option>
              <option value="3">3+ quartos</option>
              <option value="4">4+ quartos</option>
            </FilterSelect>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSearch}
              className="
                bg-primary text-on-primary label-md
                h-[80px] w-full rounded-[10px]
                transition hover:brightness-[0.98]
              "
            >
              Buscar imóveis
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
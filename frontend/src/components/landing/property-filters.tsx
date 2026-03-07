"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter, Search, X } from "lucide-react";
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
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="
          bg-surface border border-subtle text-secondary label-md
          h-[62px] w-full appearance-none rounded-[10px]
          px-4 pr-12 leading-[1.25]
          outline-none transition-colors duration-200
          focus:border-[var(--primary)]
          md:h-[100px] md:px-6 md:pr-14
        "
      >
        <option value="">{placeholder}</option>
        {children}
      </select>

      <div
        className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200 md:right-6 ${
          focused ? "rotate-180" : ""
        }`}
      >
        <ChevronDown size={18} strokeWidth={1.8} className="text-icon-default" />
      </div>
    </div>
  );
}

function FilterChips({
  filters,
  clearOne,
}: {
  filters: FilterValues;
  clearOne: (key: keyof FilterValues) => void;
}) {
  const entries = Object.entries(filters).filter(([, value]) => Boolean(value)) as [
    keyof FilterValues,
    string
  ][];

  if (entries.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <button
          key={key}
          type="button"
          onClick={() => clearOne(key)}
          className="
            bg-surface-alt border border-subtle text-secondary
            inline-flex h-[34px] items-center gap-2 rounded-[3px] px-3
            text-[12px] font-medium
          "
        >
          <span>{value}</span>
          <X size={13} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}

export function PropertyFilters({
  properties,
  onFilteredResults,
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [mobileOpen, setMobileOpen] = useState(false);

  const regionOptions = useMemo(
    () => [...new Set(properties.map((item) => item.location))],
    [properties]
  );

  const typeOptions = useMemo(
    () => [...new Set(properties.map((item) => item.type))],
    [properties]
  );

  const activeCount = Object.values(filters).filter(Boolean).length;

  function updateFilter<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function applyFilters(currentFilters = filters) {
    const filtered = properties.filter((property) => {
      const matchesRegion =
        !currentFilters.region || property.location === currentFilters.region;
      const matchesType =
        !currentFilters.type || property.type === currentFilters.type;
      const matchesSuites =
        !currentFilters.suites || property.suites >= Number(currentFilters.suites);
      const matchesParking =
        !currentFilters.parkingSpots ||
        property.parkingSpots >= Number(currentFilters.parkingSpots);
      const matchesBedrooms =
        !currentFilters.bedrooms || property.bedrooms >= Number(currentFilters.bedrooms);
      const matchesPrice = matchesPriceRange(property.price, currentFilters.priceRange);

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

  function clearFilters() {
    setFilters(initialFilters);
    onFilteredResults(properties);
  }

  function clearOne(key: keyof FilterValues) {
    const next = { ...filters, [key]: "" };
    setFilters(next);
    applyFilters(next);
  }

  const filterFields = (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
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
  );

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

          <div className="md:hidden">
            <div className="bg-surface border border-subtle rounded-[10px] p-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="
                    bg-surface-alt border border-subtle text-primary
                    inline-flex h-[54px] flex-1 items-center justify-between rounded-[6px]
                    px-4
                  "
                >
                  <span className="inline-flex items-center gap-2 text-[14px] font-medium">
                    <Filter size={16} strokeWidth={1.9} />
                    Filtros
                  </span>

                  <span className="text-secondary text-[12px] font-medium">
                    {activeCount > 0 ? `${activeCount} ativos` : "Abrir"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => applyFilters()}
                  className="
                    bg-primary text-on-primary border border-subtle
                    inline-flex h-[54px] w-[54px] items-center justify-center rounded-[6px]
                  "
                >
                  <Search size={18} strokeWidth={1.9} />
                </button>
              </div>

              <FilterChips filters={filters} clearOne={clearOne} />
            </div>
          </div>

          <div className="mt-6 hidden md:block">
            {filterFields}

            <FilterChips filters={filters} clearOne={clearOne} />

            <div className="mt-6">
              <button
                type="button"
                onClick={() => applyFilters()}
                className="
                  bg-primary text-on-primary border border-subtle label-md
                  h-[80px] w-full rounded-[6px]
                  transition duration-200 hover:brightness-[0.98]
                "
              >
                Buscar imóveis
              </button>
            </div>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Fechar filtros"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/45 md:hidden"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="
                bg-base fixed inset-x-0 bottom-0 z-[71]
                max-h-[86vh] overflow-y-auto rounded-t-[10px]
                border border-subtle
                px-4 pb-6 pt-4 md:hidden
              "
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-surface-alt" />

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-primary text-[18px] font-semibold">Filtros</p>
                  <p className="text-muted text-[13px]">Refine sua busca</p>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="
                    bg-surface-alt border border-subtle text-icon-default
                    inline-flex h-[40px] w-[40px] items-center justify-center rounded-[6px]
                  "
                >
                  <X size={18} strokeWidth={1.9} />
                </button>
              </div>

              {filterFields}

              <FilterChips filters={filters} clearOne={clearOne} />

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    bg-surface border border-subtle text-primary
                    inline-flex h-[54px] flex-1 items-center justify-center rounded-[6px]
                    text-[14px] font-medium
                  "
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    applyFilters();
                    setMobileOpen(false);
                  }}
                  className="
                    bg-primary text-on-primary border border-subtle
                    inline-flex h-[54px] flex-[1.4] items-center justify-center rounded-[6px]
                    text-[14px] font-medium
                  "
                >
                  Aplicar filtros
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
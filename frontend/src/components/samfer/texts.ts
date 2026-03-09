export const PRICE_RANGE_OPTIONS = [
  { value: "0-300000", label: "Até R$ 300.000" },
  { value: "300000-600000", label: "R$ 300.000 a R$ 600.000" },
  { value: "600000-999999999", label: "Acima de R$ 600.000" },
] as const;

export const SORT_OPTIONS = [
  { value: "alpha", label: "Nome" },
  { value: "recent", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
] as const;

export const FILTER_LABELS = {
  city: "Região",
  type: "Tipo",
  priceRange: "Preço",
  suites: "Suítes",
  parkingSpots: "Vagas",
  bedrooms: "Quartos",
} as const;

export function getPriceRangeLabel(value?: string) {
  if (!value) return "";
  const option = PRICE_RANGE_OPTIONS.find((item) => item.value === value);
  return option?.label ?? value;
}

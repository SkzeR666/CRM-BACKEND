import Link from "next/link";
import type { Metadata } from "next";
import { listProjects } from "@/lib/api/projects";
import { resolveTheme } from "@/lib/utils/theme";
import { SamferHeader } from "@/components/samfer/header";
import { SamferFooter } from "@/components/samfer/footer";
import { PropertyCard } from "@/components/samfer/property-card";
import { SectionTitle } from "@/components/samfer/section-title";
import { SamferSubmitButton } from "@/components/samfer/submit-button";
import { FILTER_LABELS, PRICE_RANGE_OPTIONS, SORT_OPTIONS, getPriceRangeLabel } from "@/components/samfer/texts";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, createPageMetadata, toAbsoluteUrl } from "@/lib/seo";
import { withTheme } from "@/lib/samfer-links";

type Search = {
  theme?: string;
  city?: string;
  status?: string;
  type?: string;
  suites?: string;
  parkingSpots?: string;
  bedrooms?: string;
  priceRange?: string;
  sort?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<Search> | Search;
};

type FilterKey = "city" | "type" | "priceRange" | "suites" | "parkingSpots" | "bedrooms";

const PAGE_SIZE = 6;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Boolean(
    params.city ||
      params.status ||
      params.type ||
      params.suites ||
      params.parkingSpots ||
      params.bedrooms ||
      params.priceRange,
  );

  const parts = [params.type, params.city].filter(Boolean);
  const title = parts.length ? `Imóveis ${parts.join(" em ")}` : "Todos os imóveis";

  return createPageMetadata({
    title,
    description: "Lista de imóveis com filtros reais por cidade, tipo, suítes, vagas, quartos e faixa de preço.",
    pathname: "/imoveis",
    noIndex: hasFilters,
  });
}

function uniqueSorted(values: Array<string | number | null | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string | number => value !== null && value !== undefined)),
  ).sort((a, b) => String(a).localeCompare(String(b)));
}

function toNumberOrNull(value?: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parsePriceRange(range?: string) {
  if (!range) return {};
  const [minRaw, maxRaw] = range.split("-");
  const min = Number(minRaw);
  const max = Number(maxRaw);

  return {
    min_price: Number.isNaN(min) ? undefined : min,
    max_price: Number.isNaN(max) ? undefined : max,
  };
}

function sortProjects(projects: Awaited<ReturnType<typeof listProjects>>["projects"], sort?: string) {
  const list = [...projects];

  if (sort === "price_asc") return list.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
  if (sort === "price_desc") return list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  if (sort === "recent") {
    return list.sort((a, b) => {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return bTime - aTime;
    });
  }

  return list.sort((a, b) => a.title.localeCompare(b.title));
}

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

function getFilterDisplayValue(key: FilterKey, value: string) {
  if (key === "priceRange") return getPriceRangeLabel(value);
  if (key === "suites") return `${value} suítes`;
  if (key === "parkingSpots") return `${value} vagas`;
  if (key === "bedrooms") return `${value} quartos`;
  return value;
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);
  const currentPage = Math.max(1, Number(params.page || "1") || 1);
  const suites = toNumberOrNull(params.suites);
  const parkingSpots = toNumberOrNull(params.parkingSpots);
  const bedrooms = toNumberOrNull(params.bedrooms);
  const priceRange = parsePriceRange(params.priceRange);

  const serverResult = await listProjects({
    limit: 200,
    city: params.city,
    status: params.status,
    type: params.type,
    suites: suites ?? undefined,
    parking_spots: parkingSpots ?? undefined,
    bedrooms: bedrooms ?? undefined,
    min_price: priceRange.min_price,
    max_price: priceRange.max_price,
  });

  const allOptionsResult = await listProjects({ limit: 200 });
  const projects = sortProjects(serverResult.projects, params.sort);
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const visibleProjects = projects.slice(start, start + PAGE_SIZE);

  const cityOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.city));
  const typeOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.type));
  const suiteOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.suites));
  const parkingOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.parking_spots));
  const bedroomOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.bedrooms));

  const queryBase: Record<string, string | undefined> = {
    theme,
    city: params.city,
    status: params.status,
    type: params.type,
    suites: params.suites,
    parkingSpots: params.parkingSpots,
    bedrooms: params.bedrooms,
    priceRange: params.priceRange,
    sort: params.sort,
  };

  const activeFilters = [
    params.city ? { key: "city", label: FILTER_LABELS.city, value: params.city } : null,
    params.type ? { key: "type", label: FILTER_LABELS.type, value: params.type } : null,
    params.priceRange
      ? { key: "priceRange", label: FILTER_LABELS.priceRange, value: getFilterDisplayValue("priceRange", params.priceRange) }
      : null,
    params.suites ? { key: "suites", label: FILTER_LABELS.suites, value: getFilterDisplayValue("suites", params.suites) } : null,
    params.parkingSpots
      ? { key: "parkingSpots", label: FILTER_LABELS.parkingSpots, value: getFilterDisplayValue("parkingSpots", params.parkingSpots) }
      : null,
    params.bedrooms
      ? { key: "bedrooms", label: FILTER_LABELS.bedrooms, value: getFilterDisplayValue("bedrooms", params.bedrooms) }
      : null,
  ] as Array<{ key: FilterKey; label: string; value: string } | null>;
  const activeFilterItems = activeFilters.filter(
    (item): item is { key: FilterKey; label: string; value: string } => Boolean(item),
  );

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Catálogo de imóveis",
    url: toAbsoluteUrl("/imoveis"),
    description: "Lista de imóveis da Samfer em Taubaté e região.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: visibleProjects.map((project, index) => ({
        "@type": "ListItem",
        position: start + index + 1,
        url: toAbsoluteUrl(`/imoveis/${project.slug}`),
        name: project.title,
      })),
    },
  };

  return (
    <div className={`samfer-app ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="samfer-shell">
        <SamferHeader theme={theme} />

        <main className="samfer-main">
          <JsonLd
            data={[
              buildBreadcrumbJsonLd([
                { name: "Início", pathname: "/" },
                { name: "Imóveis", pathname: "/imoveis" },
              ]),
              collectionJsonLd,
            ]}
          />

          <section className="samfer-section">
            <SectionTitle before="Encontre o " highlight="imóvel ideal para você" />
            <form className="samfer-filter-grid samfer-animate" method="GET" action="/imoveis">
              <input type="hidden" name="theme" value={theme} />

              <label className="samfer-select-card">
                <select name="city" defaultValue={params.city ?? ""}>
                  <option value="">Região</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={String(city)}>{city}</option>
                  ))}
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="type" defaultValue={params.type ?? ""}>
                  <option value="">Tipo</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={String(type)}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="priceRange" defaultValue={params.priceRange ?? ""}>
                  <option value="">Preço de venda</option>
                  {PRICE_RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="suites" defaultValue={params.suites ?? ""}>
                  <option value="">Suítes</option>
                  {suiteOptions.map((value) => (
                    <option key={value} value={String(value)}>{value}</option>
                  ))}
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="parkingSpots" defaultValue={params.parkingSpots ?? ""}>
                  <option value="">Vagas</option>
                  {parkingOptions.map((value) => (
                    <option key={value} value={String(value)}>{value}</option>
                  ))}
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="bedrooms" defaultValue={params.bedrooms ?? ""}>
                  <option value="">Quartos</option>
                  {bedroomOptions.map((value) => (
                    <option key={value} value={String(value)}>{value}</option>
                  ))}
                </select>
              </label>

              <SamferSubmitButton className="samfer-wide-cta samfer-grid-span" defaultLabel="Buscar imóveis" loadingLabel="Aplicando filtros..." />
            </form>

            {activeFilterItems.length ? (
              <div className="samfer-active-filters samfer-animate" aria-label="Filtros ativos">
                {activeFilterItems.map((filter) => {
                  const nextQuery = { ...queryBase, page: "1" };
                  delete nextQuery[filter.key];

                  return (
                    <Link key={filter.key} href={`/imoveis?${buildQuery(nextQuery)}`} className="samfer-filter-chip">
                      <span>{filter.label}: {filter.value}</span>
                      <strong aria-hidden>×</strong>
                    </Link>
                  );
                })}

                <Link href={withTheme("/imoveis", theme)} className="samfer-clear-filters-btn">
                  Limpar filtros
                </Link>
              </div>
            ) : null}
          </section>

          <section className="samfer-divider" />

          <section className="samfer-results">
            <div className="samfer-results-head samfer-animate" aria-live="polite">
              <h2>{projects.length} imóveis <span>encontrados</span></h2>
              <form method="GET" action="/imoveis" className="samfer-sort-form">
                <input type="hidden" name="theme" value={theme} />
                <input type="hidden" name="city" value={params.city ?? ""} />
                <input type="hidden" name="status" value={params.status ?? ""} />
                <input type="hidden" name="type" value={params.type ?? ""} />
                <input type="hidden" name="suites" value={params.suites ?? ""} />
                <input type="hidden" name="parkingSpots" value={params.parkingSpots ?? ""} />
                <input type="hidden" name="bedrooms" value={params.bedrooms ?? ""} />
                <input type="hidden" name="priceRange" value={params.priceRange ?? ""} />
                <label className="samfer-sort-label">
                  Ordenar por
                  <select name="sort" defaultValue={params.sort ?? "alpha"}>
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}> {option.label}</option>
                    ))}
                  </select>
                </label>
                <SamferSubmitButton className="samfer-sort-apply" defaultLabel="Aplicar" loadingLabel="Ordenando..." />
              </form>
            </div>

            {serverResult.error ? (
              <p className="samfer-empty">{serverResult.error}</p>
            ) : visibleProjects.length === 0 ? (
              <p className="samfer-empty">Nenhum imóvel encontrado para os filtros selecionados.</p>
            ) : (
              <div className="samfer-card-grid">
                {visibleProjects.map((project, index) => (
                  <PropertyCard key={project.id} project={project} theme={theme} index={start + index} />
                ))}
              </div>
            )}

            {page < totalPages ? (
              <Link
                href={`/imoveis?${buildQuery({ ...queryBase, page: String(page + 1) })}`}
                className="samfer-more-button samfer-animate"
              >
                Ver mais
              </Link>
            ) : (
              <button type="button" className="samfer-more-button samfer-animate" disabled>
                Fim dos resultados
              </button>
            )}

            {activeFilterItems.length ? (
              <Link href={withTheme("/imoveis", theme)} className="samfer-reset-link">Limpar filtros e voltar ao catálogo completo</Link>
            ) : null}
          </section>
        </main>

        <SamferFooter theme={theme} />
      </div>
    </div>
  );
}

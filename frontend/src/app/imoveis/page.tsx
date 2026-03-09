import Link from "next/link";
import type { Metadata } from "next";
import { listProjects } from "@/lib/api/projects";
import { resolveTheme } from "@/lib/utils/theme";
import { SamferHeader } from "@/components/samfer/header";
import { SamferFooter } from "@/components/samfer/footer";
import { PropertyCard } from "@/components/samfer/property-card";
import { SectionTitle } from "@/components/samfer/section-title";
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
  const title = parts.length ? `Imoveis ${parts.join(" em ")}` : "Todos os imoveis";

  return createPageMetadata({
    title,
    description: "Lista de imoveis com filtros reais por cidade, tipo, suites, vagas, quartos e faixa de preco.",
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

function inPriceRange(price: number | null | undefined, range?: string) {
  if (!range) return true;
  const [minRaw, maxRaw] = range.split("-");
  const min = Number(minRaw);
  const max = Number(maxRaw);
  if (Number.isNaN(min) || Number.isNaN(max)) return true;
  if (typeof price !== "number") return false;
  return price >= min && price <= max;
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

function buildQuery(params: Search) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);
  const currentPage = Math.max(1, Number(params.page || "1") || 1);

  const serverResult = await listProjects({
    limit: 300,
    city: params.city,
    status: params.status,
    type: params.type,
  });

  const allOptionsResult = await listProjects({ limit: 300 });

  const suites = toNumberOrNull(params.suites);
  const parkingSpots = toNumberOrNull(params.parkingSpots);
  const bedrooms = toNumberOrNull(params.bedrooms);

  const filteredProjects = serverResult.projects.filter((project) => {
    if (suites !== null && (project.suites ?? -1) !== suites) return false;
    if (parkingSpots !== null && (project.parking_spots ?? -1) !== parkingSpots) return false;
    if (bedrooms !== null && (project.bedrooms ?? -1) !== bedrooms) return false;
    if (!inPriceRange(project.price, params.priceRange)) return false;
    return true;
  });

  const projects = sortProjects(filteredProjects, params.sort);
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const visibleProjects = projects.slice(start, start + PAGE_SIZE);

  const cityOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.city));
  const typeOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.type));
  const suiteOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.suites));
  const parkingOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.parking_spots));
  const bedroomOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.bedrooms));

  const queryBase = {
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

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Catalogo de imoveis",
    url: toAbsoluteUrl("/imoveis"),
    description: "Lista de imoveis da Samfer em Taubate e regiao.",
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
        <SamferHeader theme={theme} title="Buscar Imoveis" backHref="/" />

        <main className="samfer-main">
          <JsonLd
            data={[
              buildBreadcrumbJsonLd([
                { name: "Inicio", pathname: "/" },
                { name: "Imoveis", pathname: "/imoveis" },
              ]),
              collectionJsonLd,
            ]}
          />

          <section className="samfer-section">
            <SectionTitle before="Encontre o " highlight="imovel ideal para voce" />
            <form className="samfer-filter-grid samfer-animate" method="GET" action="/imoveis">
              <input type="hidden" name="theme" value={theme} />

              <label className="samfer-select-card">
                <select name="city" defaultValue={params.city ?? ""}>
                  <option value="">Regiao</option>
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
                  <option value="">Preco de venda</option>
                  <option value="0-300000">Ate R$ 300.000</option>
                  <option value="300000-600000">R$ 300.000 a R$ 600.000</option>
                  <option value="600000-999999999">Acima de R$ 600.000</option>
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="suites" defaultValue={params.suites ?? ""}>
                  <option value="">Suites</option>
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

              <button className="samfer-wide-cta samfer-grid-span" type="submit">Buscar imoveis</button>
            </form>
          </section>

          <section className="samfer-divider" />

          <section className="samfer-results">
            <div className="samfer-results-head samfer-animate">
              <h2>{projects.length} imoveis <span>encontrados</span></h2>
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
                    <option value="alpha"> Nome</option>
                    <option value="recent"> Mais recentes</option>
                    <option value="price_asc"> Menor preco</option>
                    <option value="price_desc"> Maior preco</option>
                  </select>
                </label>
                <button type="submit" className="samfer-sort-apply">Aplicar</button>
              </form>
            </div>

            {serverResult.error ? (
              <p className="samfer-empty">{serverResult.error}</p>
            ) : visibleProjects.length === 0 ? (
              <p className="samfer-empty">Nenhum imovel encontrado para os filtros selecionados.</p>
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

            {(params.city || params.type || params.suites || params.parkingSpots || params.bedrooms || params.priceRange) ? (
              <Link href={withTheme("/imoveis", theme)} className="samfer-reset-link">Limpar filtros</Link>
            ) : null}
          </section>
        </main>

        <SamferFooter theme={theme} />
      </div>
    </div>
  );
}
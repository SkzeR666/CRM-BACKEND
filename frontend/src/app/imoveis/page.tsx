import { ChevronDown } from "lucide-react";
import { listProjects } from "@/lib/api/projects";
import { resolveTheme } from "@/lib/utils/theme";
import { SamferHeader } from "@/components/samfer/header";
import { SamferFooter } from "@/components/samfer/footer";
import { PropertyCard } from "@/components/samfer/property-card";
import { SectionTitle } from "@/components/samfer/section-title";

type Props = {
  searchParams:
    | Promise<{
        theme?: string;
        city?: string;
        status?: string;
        type?: string;
        suites?: string;
        parkingSpots?: string;
        bedrooms?: string;
        priceRange?: string;
      }>
    | {
        theme?: string;
        city?: string;
        status?: string;
        type?: string;
        suites?: string;
        parkingSpots?: string;
        bedrooms?: string;
        priceRange?: string;
      };
};

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

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);

  const serverResult = await listProjects({
    limit: 200,
    city: params.city,
    status: params.status,
    type: params.type,
  });

  const allOptionsResult = await listProjects({ limit: 300 });

  const suites = toNumberOrNull(params.suites);
  const parkingSpots = toNumberOrNull(params.parkingSpots);
  const bedrooms = toNumberOrNull(params.bedrooms);

  const projects = serverResult.projects.filter((project) => {
    if (suites !== null && (project.suites ?? -1) !== suites) return false;
    if (parkingSpots !== null && (project.parking_spots ?? -1) !== parkingSpots) return false;
    if (bedrooms !== null && (project.bedrooms ?? -1) !== bedrooms) return false;
    if (!inPriceRange(project.price, params.priceRange)) return false;
    return true;
  });

  const cityOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.city));
  const typeOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.type));
  const suiteOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.suites));
  const parkingOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.parking_spots));
  const bedroomOptions = uniqueSorted(allOptionsResult.projects.map((project) => project.bedrooms));

  return (
    <div className={`samfer-app ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="samfer-shell">
        <SamferHeader theme={theme} title="Buscar Imoveis" backHref="/" />

        <main className="samfer-main">
          <section className="samfer-section">
            <SectionTitle before="Encontre o " highlight="imovel ideal para voce" />
            <form className="samfer-filter-grid samfer-animate" method="GET" action="/imoveis">
              <input type="hidden" name="theme" value={theme} />

              <label className="samfer-select-card">
                <select name="city" defaultValue={params.city ?? ""}>
                  <option value="">Regiao</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={String(city)}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="type" defaultValue={params.type ?? ""}>
                  <option value="">Tipo</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={String(type)}>
                      {type}
                    </option>
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
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="parkingSpots" defaultValue={params.parkingSpots ?? ""}>
                  <option value="">Vagas</option>
                  {parkingOptions.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="samfer-select-card">
                <select name="bedrooms" defaultValue={params.bedrooms ?? ""}>
                  <option value="">Quartos</option>
                  {bedroomOptions.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <button className="samfer-wide-cta samfer-grid-span" type="submit">
                Buscar Imoveis
              </button>
            </form>
          </section>

          <section className="samfer-divider" />

          <section className="samfer-results">
            <div className="samfer-results-head samfer-animate">
              <h2>
                {projects.length} imoveis <span>encontrados</span>
              </h2>
              <button type="button" className="samfer-sort">
                Ordenar por <ChevronDown size={18} />
              </button>
            </div>

            {serverResult.error ? (
              <p className="samfer-empty">{serverResult.error}</p>
            ) : projects.length === 0 ? (
              <p className="samfer-empty">Nenhum imovel encontrado para os filtros selecionados.</p>
            ) : (
              <div className="samfer-card-grid">
                {projects.map((project, index) => (
                  <PropertyCard key={project.id} project={project} theme={theme} index={index} />
                ))}
              </div>
            )}

            <button type="button" className="samfer-more-button samfer-animate">
              Ver mais
            </button>
          </section>
        </main>

        <SamferFooter />
      </div>
    </div>
  );
}

import Link from "next/link";
import { ChevronDown, EllipsisVertical, Search } from "lucide-react";
import { listProjects } from "@/lib/api/projects";
import { formatPrice } from "@/lib/utils/format-price";
import { AdminHeader } from "@/components/shared/admin-header";

type SearchParams = {
  q?: string;
  status?: string;
  city?: string;
};

type Props = {
  searchParams: Promise<SearchParams> | SearchParams;
};

function normalizeText(value?: string) {
  return value?.trim() ?? "";
}

function unique(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean).map((value) => String(value).trim()))).sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
  );
}

function includesText(value: string | null | undefined, query: string) {
  if (!value) return false;
  return value.toLocaleLowerCase("pt-BR").includes(query);
}

function statusLabel(status?: string | null) {
  if (!status) return "-";

  const value = status.toLowerCase();
  if (value === "available") return "Ativo";
  if (value === "reserved") return "Reservado";
  if (value === "sold") return "Vendido";
  if (value === "draft") return "Rascunho";
  if (value === "rascunho") return "Rascunho";
  if (value === "ativo") return "Ativo";
  return status;
}

export default async function AdminPropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = normalizeText(params.q);
  const status = normalizeText(params.status);
  const city = normalizeText(params.city);

  const [filteredResult, allResult] = await Promise.all([
    listProjects({
      limit: 200,
      status: status || undefined,
      city: city || undefined,
    }),
    listProjects({ limit: 200 }),
  ]);

  const query = q.toLocaleLowerCase("pt-BR");
  const projects = query
    ? filteredResult.projects.filter((project) =>
        includesText(project.title, query) ||
        includesText(project.slug, query) ||
        includesText(project.city, query) ||
        includesText(project.neighborhood, query),
      )
    : filteredResult.projects;

  const statusOptions = unique(allResult.projects.map((project) => project.status));
  const cityOptions = unique(allResult.projects.map((project) => project.city));
  const hasFilters = Boolean(q || status || city);

  return (
    <div className="admin-app">
      <div className="admin-shell">
        <AdminHeader />

        <main className="admin-content">
          <section className="admin-title-block">
            <h1>
              Painel <span>administrativo</span>
            </h1>
            <p>Gerencie imoveis, edite informacoes e acompanhe os conteudos da plataforma.</p>
          </section>

          <form method="GET" action="/admin/imoveis" className="admin-filter-row">
            <label className="admin-filter-control admin-filter-search">
              <span className="samfer-sr-only">Buscar imovel</span>
              <input name="q" defaultValue={q} placeholder="Buscar imovel" />
              <Search size={18} aria-hidden />
            </label>

            <label className="admin-filter-control admin-filter-select">
              <span className="samfer-sr-only">Status</span>
              <select name="status" defaultValue={status}>
                <option value="">Status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {statusLabel(option)}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden />
            </label>

            <label className="admin-filter-control admin-filter-select">
              <span className="samfer-sr-only">Cidade</span>
              <select name="city" defaultValue={city}>
                <option value="">Cidade</option>
                {cityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden />
            </label>

            <div className="admin-filter-actions">
              {hasFilters ? (
                <Link href="/admin/imoveis" className="admin-secondary-btn">
                  Limpar
                </Link>
              ) : null}
              <button type="submit" className="admin-secondary-btn">
                Aplicar
              </button>
              <Link href="/admin/imoveis/novo" className="admin-primary-btn">
                Novo imovel
              </Link>
            </div>
          </form>

          {filteredResult.error ? (
            <p className="admin-feedback is-error">{filteredResult.error}</p>
          ) : (
            <section className="admin-table-shell" aria-live="polite">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      Imovel <ChevronDown size={14} />
                    </th>
                    <th>
                      Cidade <ChevronDown size={14} />
                    </th>
                    <th>
                      Status <ChevronDown size={14} />
                    </th>
                    <th>
                      Preco <ChevronDown size={14} />
                    </th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length ? (
                    projects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td>{project.city || "-"}</td>
                        <td>{statusLabel(project.status)}</td>
                        <td>{typeof project.price === "number" ? formatPrice(project.price) : "Sob consulta"}</td>
                        <td>
                          <Link
                            href={`/imoveis/${project.slug}`}
                            className="admin-action-btn"
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Abrir ${project.title} no site`}
                          >
                            <EllipsisVertical size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="admin-empty-cell">
                        Nenhum imovel encontrado para os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

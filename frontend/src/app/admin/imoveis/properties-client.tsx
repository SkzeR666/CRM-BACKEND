"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PencilLine, Search, Trash2, X } from "lucide-react";
import { listProjects, deleteProject } from "@/lib/api/projects";
import { formatPrice } from "@/lib/utils/format-price";
import type { Project } from "@/types/project";
import { getAdminAccessToken } from "@/lib/admin-auth";
import { AdminHeader } from "@/components/shared/admin-header";
import { AdminAuthGuard } from "@/components/shared/admin-auth-guard";
import { withTheme } from "@/lib/samfer-links";
import type { SamferTheme } from "@/lib/utils/theme";

type Filters = {
  q: string;
};

function normalizeText(value?: string) {
  return value?.trim() ?? "";
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

function statusTone(status?: string | null) {
  if (!status) return "neutral";
  const value = status.toLowerCase();
  if (value === "available" || value === "ativo") return "active";
  if (value === "reserved") return "warning";
  if (value === "sold") return "danger";
  if (value === "draft" || value === "rascunho") return "neutral";
  return "neutral";
}

function buildQuery(filters: Filters, theme: SamferTheme) {
  const query = new URLSearchParams();
  query.set("theme", theme);
  if (filters.q) query.set("q", filters.q);
  return query.toString();
}

type Props = {
  theme: SamferTheme;
};

export function AdminPropertiesPageClient({ theme }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const filters = useMemo<Filters>(
    () => ({
      q: normalizeText(searchParams.get("q") || ""),
    }),
    [searchParams],
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");

    listProjects({ limit: 200 })
      .then((filteredResult) => {
        if (cancelled) return;

        if (filteredResult.error) {
          setError(filteredResult.error);
          setProjects([]);
          return;
        }

        setProjects(filteredResult.projects);
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Falha ao carregar projetos.");
        setProjects([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const query = filters.q.toLocaleLowerCase("pt-BR");
    if (!query) return projects;

    return projects.filter((project) =>
      includesText(project.title, query) ||
      includesText(project.slug, query) ||
      includesText(project.city, query) ||
      includesText(project.neighborhood, query),
    );
  }, [filters.q, projects]);

  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextFilters: Filters = {
      q: normalizeText(String(formData.get("q") || "")),
    };

    const query = buildQuery(nextFilters, theme);
    router.push(query ? `/admin/imoveis?${query}` : "/admin/imoveis");
  }

  function handleClear() {
    router.push(withTheme("/admin/imoveis", theme));
  }

  function updateFilters(next: Filters) {
    const query = buildQuery(next, theme);
    router.push(query ? `/admin/imoveis?${query}` : "/admin/imoveis");
  }

  function handleRemoveFilter(key: keyof Filters) {
    updateFilters({
      ...filters,
      [key]: "",
    });
  }

  async function handleDelete(project: Project) {
    const confirmDelete = window.confirm(`Excluir o imóvel "${project.title}"?`);
    if (!confirmDelete) return;

    try {
      setIsDeletingId(project.id);
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessão expirada. Faça login novamente.");

      await deleteProject(project.id, { accessToken });
      setProjects((prev) => prev.filter((item) => item.id !== project.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Falha ao excluir imóvel.");
    } finally {
      setIsDeletingId(null);
    }
  }

  const hasFilters = Boolean(filters.q);
  const activeFilters = [
    filters.q ? { key: "q" as const, label: `Busca: ${filters.q}` } : null,
  ].filter(Boolean) as Array<{ key: keyof Filters; label: string }>;

  return (
    <AdminAuthGuard>
      <div className={`admin-app ${theme === "dark" ? "is-dark" : ""}`}>
        <div className="admin-shell">
          <AdminHeader theme={theme} section="imoveis" />

          <main className="admin-content">
            <form className="admin-filter-row is-simple samfer-animate" onSubmit={handleApply}>
              <label className="admin-filter-control admin-filter-search">
                <span className="samfer-sr-only">Buscar imóvel</span>
                <input name="q" defaultValue={filters.q} placeholder="Buscar imóvel" />
                <Search size={18} aria-hidden />
              </label>

              <div className="admin-filter-actions">
                {hasFilters ? (
                  <button type="button" className="admin-secondary-btn" onClick={handleClear}>
                    Limpar
                  </button>
                ) : null}
                <button type="submit" className="admin-secondary-btn">
                  Pesquisar
                </button>
                <Link href={withTheme("/admin/imoveis/novo", theme)} className="admin-primary-btn">
                  Novo imóvel
                </Link>
              </div>
            </form>

            {activeFilters.length ? (
              <div className="admin-active-filters samfer-animate" aria-label="Filtros ativos">
                {activeFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className="admin-filter-chip"
                    onClick={() => handleRemoveFilter(filter.key)}
                  >
                    <span>{filter.label}</span>
                    <X size={14} />
                  </button>
                ))}
              </div>
            ) : null}

            {error ? <p className="admin-feedback is-error">{error}</p> : null}

            <section className="admin-table-shell samfer-animate" aria-live="polite">
              <div className="admin-table-meta">
                <p>{isLoading ? "Carregando..." : `${filteredProjects.length} imóvel(is) encontrado(s)`}</p>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imóvel</th>
                    <th>Cidade</th>
                    <th>Status</th>
                    <th>Preço</th>
                    <th className="is-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="admin-empty-cell">
                        Carregando imóveis...
                      </td>
                    </tr>
                  ) : filteredProjects.length ? (
                    filteredProjects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td>{project.city || "-"}</td>
                        <td>
                          <span className={`admin-status-pill is-${statusTone(project.status)}`}>{statusLabel(project.status)}</span>
                        </td>
                        <td>{typeof project.price === "number" ? formatPrice(project.price) : "Sob consulta"}</td>
                        <td className="admin-actions-cell">
                          <Link href={withTheme(`/admin/imoveis/${project.id}`, theme)} className="admin-row-action" aria-label={`Editar ${project.title}`}>
                            <PencilLine size={16} />
                            <span>Editar</span>
                          </Link>
                          <button
                            type="button"
                            className="admin-row-action is-danger"
                            onClick={() => handleDelete(project)}
                            disabled={isDeletingId === project.id}
                            aria-label={`Excluir ${project.title}`}
                          >
                            <Trash2 size={16} />
                            <span>{isDeletingId === project.id ? "Excluindo..." : "Excluir"}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="admin-empty-cell">
                        Nenhum imóvel encontrado para os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

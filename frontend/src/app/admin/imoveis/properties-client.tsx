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

type Filters = {
  q: string;
  status: string;
  city: string;
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

function statusTone(status?: string | null) {
  if (!status) return "neutral";
  const value = status.toLowerCase();
  if (value === "available" || value === "ativo") return "active";
  if (value === "reserved") return "warning";
  if (value === "sold") return "danger";
  if (value === "draft" || value === "rascunho") return "neutral";
  return "neutral";
}

function buildQuery(filters: Filters) {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  if (filters.status) query.set("status", filters.status);
  if (filters.city) query.set("city", filters.city);
  return query.toString();
}

export function AdminPropertiesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const filters = useMemo<Filters>(
    () => ({
      q: normalizeText(searchParams.get("q") || ""),
      status: normalizeText(searchParams.get("status") || ""),
      city: normalizeText(searchParams.get("city") || ""),
    }),
    [searchParams],
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");

    Promise.all([
      listProjects({
        limit: 200,
        status: filters.status || undefined,
        city: filters.city || undefined,
      }),
      listProjects({ limit: 200 }),
    ])
      .then(([filteredResult, allResult]) => {
        if (cancelled) return;

        if (filteredResult.error) {
          setError(filteredResult.error);
          setProjects([]);
          return;
        }

        setProjects(filteredResult.projects);
        setStatusOptions(unique(allResult.projects.map((project) => project.status)));
        setCityOptions(unique(allResult.projects.map((project) => project.city)));
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
  }, [filters.city, filters.status]);

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
      status: normalizeText(String(formData.get("status") || "")),
      city: normalizeText(String(formData.get("city") || "")),
    };

    const query = buildQuery(nextFilters);
    router.push(query ? `/admin/imoveis?${query}` : "/admin/imoveis");
  }

  function handleClear() {
    router.push("/admin/imoveis");
  }

  function updateFilters(next: Filters) {
    const query = buildQuery(next);
    router.push(query ? `/admin/imoveis?${query}` : "/admin/imoveis");
  }

  function handleRemoveFilter(key: keyof Filters) {
    updateFilters({
      ...filters,
      [key]: "",
    });
  }

  async function handleDelete(project: Project) {
    const confirmDelete = window.confirm(`Excluir o imovel "${project.title}"?`);
    if (!confirmDelete) return;

    try {
      setIsDeletingId(project.id);
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessao expirada. Faca login novamente.");

      await deleteProject(project.id, { accessToken });
      setProjects((prev) => prev.filter((item) => item.id !== project.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Falha ao excluir imovel.");
    } finally {
      setIsDeletingId(null);
    }
  }

  const hasFilters = Boolean(filters.q || filters.status || filters.city);
  const activeFilters = [
    filters.q ? { key: "q" as const, label: `Busca: ${filters.q}` } : null,
    filters.status ? { key: "status" as const, label: `Status: ${statusLabel(filters.status)}` } : null,
    filters.city ? { key: "city" as const, label: `Cidade: ${filters.city}` } : null,
  ].filter(Boolean) as Array<{ key: keyof Filters; label: string }>;

  return (
    <AdminAuthGuard>
      <div className="admin-app">
        <div className="admin-shell">
          <AdminHeader />

          <main className="admin-content">
            <section className="admin-title-block samfer-animate">
              <h1>
                Painel <span>administrativo</span>
              </h1>
              <p>Gerencie imoveis, edite informacoes e acompanhe os conteudos da plataforma sem sair do fluxo.</p>
            </section>

            <form className="admin-filter-row samfer-animate" onSubmit={handleApply}>
              <label className="admin-filter-control admin-filter-search">
                <span className="samfer-sr-only">Buscar imovel</span>
                <input name="q" defaultValue={filters.q} placeholder="Buscar imovel" />
                <Search size={18} aria-hidden />
              </label>

              <label className="admin-filter-control">
                <span className="samfer-sr-only">Status</span>
                <select name="status" defaultValue={filters.status}>
                  <option value="">Status</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {statusLabel(option)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-filter-control">
                <span className="samfer-sr-only">Cidade</span>
                <select name="city" defaultValue={filters.city}>
                  <option value="">Cidade</option>
                  {cityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="admin-filter-actions">
                {hasFilters ? (
                  <button type="button" className="admin-secondary-btn" onClick={handleClear}>
                    Limpar
                  </button>
                ) : null}
                <button type="submit" className="admin-secondary-btn">
                  Aplicar
                </button>
                <Link href="/admin/imoveis/novo" className="admin-primary-btn">
                  Novo imovel
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
                <p>{isLoading ? "Carregando..." : `${filteredProjects.length} imovel(is) encontrado(s)`}</p>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imovel</th>
                    <th>Cidade</th>
                    <th>Status</th>
                    <th>Preco</th>
                    <th className="is-actions">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="admin-empty-cell">
                        Carregando imoveis...
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
                          <Link href={`/admin/imoveis/${project.id}`} className="admin-row-action" aria-label={`Editar ${project.title}`}>
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
                        Nenhum imovel encontrado para os filtros aplicados.
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

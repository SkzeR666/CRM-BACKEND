"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Trash2, X } from "lucide-react";
import { AdminAuthGuard } from "@/components/shared/admin-auth-guard";
import { AdminHeader } from "@/components/shared/admin-header";
import { getAdminAccessToken } from "@/lib/admin-auth";
import { deleteLead, listLeads, updateLead } from "@/lib/api/leads";
import { withTheme } from "@/lib/samfer-links";
import type { SamferTheme } from "@/lib/utils/theme";
import type { Lead } from "@/types/lead";

type Filters = {
  q: string;
  status: string;
};

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "contatado", label: "Contatado" },
  { value: "qualificado", label: "Qualificado" },
  { value: "negociando", label: "Negociando" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
];

function normalizeText(value?: string) {
  return value?.trim() ?? "";
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function buildQuery(filters: Filters, theme: SamferTheme) {
  const query = new URLSearchParams();
  query.set("theme", theme);
  if (filters.q) query.set("q", filters.q);
  if (filters.status) query.set("status", filters.status);
  return query.toString();
}

type Props = {
  theme: SamferTheme;
};

export function AdminLeadsPageClient({ theme }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const filters = useMemo<Filters>(
    () => ({
      q: normalizeText(searchParams.get("q") || ""),
      status: normalizeText(searchParams.get("status") || ""),
    }),
    [searchParams]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");

    async function load() {
      try {
        const accessToken = await getAdminAccessToken();
        if (!accessToken) throw new Error("Sessao expirada. Faca login novamente.");

        const result = await listLeads(
          {
            q: filters.q || undefined,
            status: filters.status || undefined,
            limit: 200,
          },
          { accessToken }
        );

        if (cancelled) return;
        if (result.error) {
          setError(result.error);
          setLeads([]);
          return;
        }

        setLeads(result.leads);
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Falha ao carregar leads.");
        setLeads([]);
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [filters.q, filters.status]);

  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextFilters: Filters = {
      q: normalizeText(String(formData.get("q") || "")),
      status: normalizeText(String(formData.get("status") || "")),
    };

    const query = buildQuery(nextFilters, theme);
    router.push(query ? `/admin/leads?${query}` : "/admin/leads");
  }

  function handleClear() {
    router.push(withTheme("/admin/leads", theme));
  }

  function updateFilters(next: Filters) {
    const query = buildQuery(next, theme);
    router.push(query ? `/admin/leads?${query}` : "/admin/leads");
  }

  function handleRemoveFilter(key: keyof Filters) {
    updateFilters({
      ...filters,
      [key]: "",
    });
  }

  async function handleStatusChange(lead: Lead, status: string) {
    try {
      setIsUpdatingId(lead.id);
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessao expirada. Faca login novamente.");

      const updated = await updateLead(lead.id, { status }, { accessToken });
      setLeads((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Falha ao atualizar lead.");
    } finally {
      setIsUpdatingId(null);
    }
  }

  async function handleDelete(lead: Lead) {
    const confirmDelete = window.confirm(`Excluir o lead "${lead.name}"?`);
    if (!confirmDelete) return;

    try {
      setIsDeletingId(lead.id);
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessao expirada. Faca login novamente.");

      await deleteLead(lead.id, { accessToken });
      setLeads((prev) => prev.filter((item) => item.id !== lead.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Falha ao excluir lead.");
    } finally {
      setIsDeletingId(null);
    }
  }

  const hasFilters = Boolean(filters.q || filters.status);
  const activeFilters = [
    filters.q ? { key: "q" as const, label: `Busca: ${filters.q}` } : null,
    filters.status ? { key: "status" as const, label: `Status: ${filters.status}` } : null,
  ].filter(Boolean) as Array<{ key: keyof Filters; label: string }>;

  return (
    <AdminAuthGuard>
      <div className={`admin-app ${theme === "dark" ? "is-dark" : ""}`}>
        <div className="admin-shell">
          <AdminHeader theme={theme} section="leads" />

          <main className="admin-content">
            <section className="admin-title-block samfer-animate">
              <h1>
                Leads <span>captados</span>
              </h1>
              <p>
                Acompanhe o funil comercial, atualize status e mantenha o atendimento
                organizado no mesmo painel.
              </p>
            </section>

            <form className="admin-filter-row is-compact samfer-animate" onSubmit={handleApply}>
              <label className="admin-filter-control admin-filter-search">
                <span className="samfer-sr-only">Buscar lead</span>
                <input name="q" defaultValue={filters.q} placeholder="Buscar por nome, telefone ou email" />
                <Search size={18} aria-hidden />
              </label>

              <label className="admin-filter-control">
                <span className="samfer-sr-only">Status</span>
                <select name="status" defaultValue={filters.status}>
                  <option value="">Status</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
                <p>{isLoading ? "Carregando..." : `${leads.length} lead(s) encontrado(s)`}</p>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Contato</th>
                    <th>Origem</th>
                    <th>Status</th>
                    <th>Criado em</th>
                    <th className="is-actions">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="admin-empty-cell">
                        Carregando leads...
                      </td>
                    </tr>
                  ) : leads.length ? (
                    leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.name}</td>
                        <td>
                          <div>
                            <div>{lead.phone}</div>
                            <small>{lead.email || "-"}</small>
                          </div>
                        </td>
                        <td>{lead.source || "site"}</td>
                        <td>
                          <select
                            className="admin-inline-select"
                            value={lead.status || "novo"}
                            onChange={(event) => handleStatusChange(lead, event.target.value)}
                            disabled={isUpdatingId === lead.id}
                            aria-label={`Status do lead ${lead.name}`}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{formatDate(lead.created_at)}</td>
                        <td className="admin-actions-cell">
                          <button
                            type="button"
                            className="admin-row-action is-danger"
                            onClick={() => handleDelete(lead)}
                            disabled={isDeletingId === lead.id}
                            aria-label={`Excluir ${lead.name}`}
                          >
                            <Trash2 size={16} />
                            <span>{isDeletingId === lead.id ? "Excluindo..." : "Excluir"}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="admin-empty-cell">
                        Nenhum lead encontrado para os filtros aplicados.
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

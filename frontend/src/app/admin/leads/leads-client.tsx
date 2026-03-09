"use client";

import { DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarClock, Mail, Phone, Search, Trash2 } from "lucide-react";
import { AdminAuthGuard } from "@/components/shared/admin-auth-guard";
import { AdminHeader } from "@/components/shared/admin-header";
import { getAdminAccessToken } from "@/lib/admin-auth";
import { deleteLead, listLeads, updateLead } from "@/lib/api/leads";
import type { SamferTheme } from "@/lib/utils/theme";
import type { Lead } from "@/types/lead";

type Filters = {
  q: string;
  view: "kanban" | "list";
};

const STATUS_LABELS: Record<string, string> = {
  new: "Novo",
  contacted: "Contatado",
  qualified: "Qualificado",
  negotiating: "Negociando",
  won: "Fechado",
  lost: "Perdido",
};
const KANBAN_STATUSES = ["new", "contacted", "qualified", "negotiating", "won", "lost"] as const;

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

function normalizeStatus(status?: string | null) {
  const normalized = status?.trim().toLowerCase();
  return normalized || "";
}

function getStatusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

function statusTone(status?: string | null) {
  const normalized = normalizeStatus(status);
  if (!normalized) return "neutral";
  if (normalized === "won") return "active";
  if (normalized === "lost") return "danger";
  if (normalized === "negotiating") return "warning";
  return "neutral";
}

function buildQuery(filters: Filters, theme: SamferTheme) {
  const query = new URLSearchParams();
  query.set("theme", theme);
  if (filters.q) query.set("q", filters.q);
  query.set("view", filters.view);
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
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);

  const filters = useMemo<Filters>(
    () => ({
      q: normalizeText(searchParams.get("q") || ""),
      view: searchParams.get("view") === "list" ? "list" : "kanban",
    }),
    [searchParams],
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");

    async function load() {
      try {
        const accessToken = await getAdminAccessToken();
        if (!accessToken) throw new Error("Sessão expirada. Faça login novamente.");

        const result = await listLeads(
          {
            q: filters.q || undefined,
            limit: 200,
          },
          { accessToken },
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
  }, [filters.q]);

  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextFilters: Filters = {
      q: normalizeText(String(formData.get("q") || "")),
      view: filters.view,
    };

    const query = buildQuery(nextFilters, theme);
    router.push(query ? `/admin/leads?${query}` : "/admin/leads");
  }

  async function handleStatusChange(lead: Lead, status: string) {
    try {
      setIsUpdatingId(lead.id);
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessão expirada. Faça login novamente.");

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
      if (!accessToken) throw new Error("Sessão expirada. Faça login novamente.");

      await deleteLead(lead.id, { accessToken });
      setLeads((prev) => prev.filter((item) => item.id !== lead.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Falha ao excluir lead.");
    } finally {
      setIsDeletingId(null);
    }
  }

  const statusOptions = useMemo(() => {
    const fromLeads = Array.from(
      new Set(leads.map((lead) => normalizeStatus(lead.status)).filter((status): status is string => Boolean(status))),
    );
    const extras = fromLeads.filter((status) => !KANBAN_STATUSES.includes(status as (typeof KANBAN_STATUSES)[number]));
    return [...KANBAN_STATUSES, ...extras];
  }, [leads]);

  const columns = statusOptions.map((statusValue) => ({
    value: statusValue,
    label: getStatusLabel(statusValue),
    leads: leads.filter((lead) => normalizeStatus(lead.status) === statusValue),
  }));

  function handleDragStart(event: DragEvent<HTMLElement>, leadId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", leadId);
    setDraggingLeadId(leadId);
  }

  function handleDragEnd() {
    setDraggingLeadId(null);
  }

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  async function moveLeadToStatus(leadId: string, status: string) {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead || normalizeStatus(lead.status) === status) return;

    try {
      setIsUpdatingId(leadId);
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessão expirada. Faça login novamente.");

      const updated = await updateLead(leadId, { status }, { accessToken });
      setLeads((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Falha ao atualizar lead.");
    } finally {
      setIsUpdatingId(null);
    }
  }

  async function handleDrop(event: DragEvent<HTMLElement>, status: string) {
    event.preventDefault();
    const leadId = event.dataTransfer.getData("text/plain") || draggingLeadId;
    if (!leadId) return;
    await moveLeadToStatus(leadId, status);
    setDraggingLeadId(null);
  }

  function setView(view: Filters["view"]) {
    const query = buildQuery({ ...filters, view }, theme);
    router.push(`/admin/leads?${query}`);
  }

  return (
    <AdminAuthGuard>
      <div className={`admin-app ${theme === "dark" ? "is-dark" : ""}`}>
        <div className="admin-shell">
          <AdminHeader theme={theme} section="leads" />

          <main className="admin-content">
            <form className="admin-filter-row is-simple samfer-animate" onSubmit={handleApply}>
              <label className="admin-filter-control admin-filter-search">
                <span className="samfer-sr-only">Buscar lead</span>
                <input name="q" defaultValue={filters.q} placeholder="Buscar por nome, telefone ou e-mail" />
                <Search size={18} aria-hidden />
              </label>

              <div className="admin-filter-actions is-toggle-group">
                <button
                  type="button"
                  className={`admin-secondary-btn ${filters.view === "kanban" ? "is-active" : ""}`}
                  onClick={() => setView("kanban")}
                >
                  Kanban
                </button>
                <button
                  type="button"
                  className={`admin-secondary-btn ${filters.view === "list" ? "is-active" : ""}`}
                  onClick={() => setView("list")}
                >
                  Lista
                </button>
              </div>
            </form>

            {error ? <p className="admin-feedback is-error">{error}</p> : null}

            {filters.view === "kanban" ? (
              <section className="admin-kanban samfer-animate" aria-live="polite">
                {isLoading ? (
                  <div className="admin-empty-cell">Carregando leads...</div>
                ) : !leads.length ? (
                  <div className="admin-empty-cell">Nenhum lead encontrado para os filtros aplicados.</div>
                ) : (
                  columns.map((column) => (
                    <article
                      key={column.value}
                      className="admin-kanban-column"
                      onDragOver={handleDragOver}
                      onDrop={(event) => handleDrop(event, column.value)}
                    >
                      <header className="admin-kanban-column-head">
                        <h2>{column.label}</h2>
                        <span>{column.leads.length}</span>
                      </header>

                      <div className="admin-kanban-list">
                        {column.leads.map((lead) => (
                          <article
                            key={lead.id}
                            className={`admin-kanban-card ${draggingLeadId === lead.id ? "is-dragging" : ""}`}
                            draggable
                            onDragStart={(event) => handleDragStart(event, lead.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="admin-kanban-card-head">
                              <h3>{lead.name}</h3>
                              <button
                                type="button"
                                className="admin-row-action is-danger"
                                onClick={() => handleDelete(lead)}
                                disabled={isDeletingId === lead.id}
                                aria-label={`Excluir ${lead.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="admin-lead-contact">
                              <div className="admin-lead-row">
                                <Phone size={13} aria-hidden />
                                <span className="admin-lead-value">{lead.phone}</span>
                              </div>
                              <div className="admin-lead-row">
                                <Mail size={13} aria-hidden />
                                <span className="admin-lead-value">{lead.email || "E-mail não informado"}</span>
                              </div>
                              <div className="admin-lead-row is-muted">
                                <span>Origem: {lead.source || "Site"}</span>
                              </div>
                              <div className="admin-lead-row is-muted">
                                <CalendarClock size={13} aria-hidden />
                                <span>Criado em {formatDate(lead.created_at)}</span>
                              </div>
                            </div>

                            {(() => {
                              const currentStatus = normalizeStatus(lead.status);
                              const selectedStatus = currentStatus || statusOptions[0] || "new";

                              return (
                                <select
                                  className="admin-inline-select"
                                  value={selectedStatus}
                                  onChange={(event) => handleStatusChange(lead, event.target.value)}
                                  disabled={isUpdatingId === lead.id}
                                  aria-label={`Status do lead ${lead.name}`}
                                >
                                  {statusOptions.map((statusOption) => (
                                    <option key={statusOption} value={statusOption}>
                                      {getStatusLabel(statusOption)}
                                    </option>
                                  ))}
                                </select>
                              );
                            })()}
                          </article>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </section>
            ) : (
              <section className="admin-table-shell samfer-animate" aria-live="polite">
                <div className="admin-table-meta">
                  <p>{isLoading ? "Carregando..." : `${leads.length} lead(s) encontrado(s)`}</p>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Contato</th>
                      <th>Status</th>
                      <th>Criado em</th>
                      <th className="is-actions">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="admin-empty-cell">Carregando leads...</td>
                      </tr>
                    ) : leads.length ? (
                      leads.map((lead) => (
                        <tr key={lead.id}>
                          <td>{lead.name}</td>
                          <td>
                            <div className="admin-lead-contact admin-lead-contact-table">
                              <div className="admin-lead-row">
                                <Phone size={13} aria-hidden />
                                <span className="admin-lead-value">{lead.phone}</span>
                              </div>
                              <div className="admin-lead-row">
                                <Mail size={13} aria-hidden />
                                <span className="admin-lead-value">{lead.email || "E-mail não informado"}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`admin-status-pill is-${statusTone(lead.status)}`}>
                              {getStatusLabel(normalizeStatus(lead.status) || "new")}
                            </span>
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
                              <Trash2 size={14} />
                              <span>{isDeletingId === lead.id ? "Excluindo..." : "Excluir"}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="admin-empty-cell">Nenhum lead encontrado.</td>
                      </tr>
                    )}
                </tbody>
              </table>

              <div className="admin-mobile-list" role="list" aria-label="Lista de leads">
                {isLoading ? (
                  <article className="admin-mobile-card is-empty" role="listitem">
                    Carregando leads...
                  </article>
                ) : leads.length ? (
                  leads.map((lead) => (
                    <article key={lead.id} className="admin-mobile-card" role="listitem">
                      <div className="admin-mobile-card-top">
                        <h3>{lead.name}</h3>
                        <span className={`admin-status-pill is-${statusTone(lead.status)}`}>
                          {getStatusLabel(normalizeStatus(lead.status) || "new")}
                        </span>
                      </div>
                      <div className="admin-lead-contact admin-lead-contact-table">
                        <div className="admin-lead-row">
                          <Phone size={13} aria-hidden />
                          <span className="admin-lead-value">{lead.phone}</span>
                        </div>
                        <div className="admin-lead-row">
                          <Mail size={13} aria-hidden />
                          <span className="admin-lead-value">{lead.email || "E-mail não informado"}</span>
                        </div>
                        <div className="admin-lead-row is-muted">
                          <CalendarClock size={13} aria-hidden />
                          <span>Criado em {formatDate(lead.created_at)}</span>
                        </div>
                      </div>
                      <div className="admin-mobile-actions">
                        <button
                          type="button"
                          className="admin-row-action is-danger"
                          onClick={() => handleDelete(lead)}
                          disabled={isDeletingId === lead.id}
                          aria-label={`Excluir ${lead.name}`}
                        >
                          <Trash2 size={14} />
                          <span>{isDeletingId === lead.id ? "Excluindo..." : "Excluir"}</span>
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <article className="admin-mobile-card is-empty" role="listitem">
                    Nenhum lead encontrado.
                  </article>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
      </div>
    </AdminAuthGuard>
  );
}

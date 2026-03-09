"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api/http";
import { trackSamferEvent } from "@/lib/analytics";

type Props = {
  projectId?: string;
  source: string;
  contextLabel?: string;
  compact?: boolean;
};

type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  interested_project_id?: string;
  next_step?: string;
};

export function SamferContactForm({ projectId, source, contextLabel, compact = false }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const payload: LeadPayload = {
        name,
        phone,
        email: email || undefined,
        source,
        interested_project_id: projectId,
        next_step: "Aguardar contato comercial",
      };

      await apiRequest<{ lead: { id: string } }>("/api/leads", {
        method: "POST",
        body: payload,
      });

      setName("");
      setPhone("");
      setEmail("");
      setMessage("Recebemos seu contato. Nossa equipe vai retornar em breve.");
      trackSamferEvent({
        event: "samfer_contact_submit",
        category: "contact",
        action: "submit_success",
        label: source,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel enviar o contato.");
      trackSamferEvent({
        event: "samfer_contact_submit",
        category: "contact",
        action: "submit_error",
        label: source,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={`samfer-contact-grid samfer-animate ${compact ? "is-compact" : ""}`} onSubmit={handleSubmit}>
      <label className="samfer-input-card no-icon">
        <span>Nome completo *</span>
        <input
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>
      <label className="samfer-input-card no-icon">
        <span>Telefone *</span>
        <input
          name="phone"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
      </label>
      <label className="samfer-input-card no-icon">
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <div className="samfer-input-card no-icon">
        <span>Interesse</span>
        <p>{contextLabel || "Atendimento comercial para compra de imovel"}</p>
      </div>

      <button type="submit" className="samfer-wide-cta" disabled={loading}>
        {loading ? "Enviando..." : "Quero atendimento"}
      </button>

      {message ? <p className="samfer-form-message success" aria-live="polite">{message}</p> : null}
      {error ? <p className="samfer-form-message error" aria-live="assertive">{error}</p> : null}
    </form>
  );
}


"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api/http";
import { trackSamferEvent } from "@/lib/analytics";

type Props = {
  projectId?: string;
  source: string;
};

type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
  source?: string;
  interested_project_id?: string;
  next_step?: string;
};

export function SamferContactForm({ projectId, source }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload: LeadPayload = {
        name,
        phone,
        email: email || undefined,
        subject: subject || undefined,
        message: messageText || undefined,
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
      setSubject("");
      setMessageText("");
      trackSamferEvent({
        event: "samfer_contact_submit",
        category: "contact",
        action: "submit_success",
        label: source,
      });
    } catch (submitError) {
      const errorMessage = submitError instanceof Error ? submitError.message : "Não foi possível enviar o contato.";
      trackSamferEvent({
        event: "samfer_contact_submit",
        category: "contact",
        action: "submit_error",
        label: `${source}:${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="samfer-contact-grid samfer-animate" onSubmit={handleSubmit}>
      <label className="samfer-input-card no-icon">
        <span className="samfer-sr-only">Nome Completo *</span>
        <input
          name="name"
          placeholder="Nome Completo *"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>
      <label className="samfer-input-card no-icon">
        <span className="samfer-sr-only">Telefone *</span>
        <input
          name="phone"
          placeholder="Telefone *"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
      </label>
      <label className="samfer-input-card no-icon">
        <span className="samfer-sr-only">E-mail</span>
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="samfer-input-card no-icon">
        <span className="samfer-sr-only">Assunto</span>
        <input
          name="subject"
          placeholder="Assunto"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          maxLength={120}
        />
      </label>
      <label className="samfer-input-card no-icon samfer-contact-message">
        <span className="samfer-sr-only">Mensagem</span>
        <textarea
          name="message"
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          rows={4}
          maxLength={600}
          placeholder="Mensagem"
        />
      </label>

      <button type="submit" className="samfer-wide-cta" disabled={loading} aria-busy={loading}>
        {loading ? "Enviando..." : "Quero falar com a equipe"}
      </button>
      <span className="samfer-sr-only" aria-live="polite">
        {loading ? "Enviando contato" : "Atendimento consultivo para compra do seu imóvel"}
      </span>
    </form>
  );
}


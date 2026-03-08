"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api/http";

type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  next_step?: string;
};

const fieldClassName =
  "h-[100px] rounded-[10px] border border-border bg-surface-alt px-6 text-[14px] font-medium text-foreground-secondary outline-none transition focus:border-primary";

export function LandingContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage("");
    setIsError(false);

    try {
      const payload: LeadPayload = {
        name,
        phone,
        email: email || undefined,
        source: "landing",
        next_step: `${subject || "Sem assunto"} - ${message || "Sem mensagem"}`,
      };

      await apiRequest<{ lead: { id: string } }>("/api/leads", {
        method: "POST",
        body: payload,
      });

      setName("");
      setPhone("");
      setEmail("");
      setSubject("");
      setMessage("");
      setStatusMessage("Mensagem enviada com sucesso.");
    } catch (error) {
      setIsError(true);
      setStatusMessage(error instanceof Error ? error.message : "Erro ao enviar mensagem.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AJUSTE: espacamento entre campos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <input className={fieldClassName} placeholder="Nome Completo *" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className={fieldClassName} placeholder="Telefone *" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input className={fieldClassName} placeholder="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={fieldClassName} placeholder="Assunto" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <textarea
        className="h-[100px] w-full rounded-[10px] border border-border bg-surface-alt px-6 py-4 text-[14px] font-medium text-foreground-secondary outline-none transition focus:border-primary"
        placeholder="Mensagem"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="h-[80px] w-full rounded-[10px] bg-primary text-[16px] font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-70"
      >
        {isLoading ? "Enviando..." : "Enviar Email"}
      </button>

      {statusMessage ? <p className={isError ? "text-sm text-red-500" : "text-sm text-primary"}>{statusMessage}</p> : null}
    </form>
  );
}
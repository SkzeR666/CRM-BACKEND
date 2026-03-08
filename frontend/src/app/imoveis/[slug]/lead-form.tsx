"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type LeadFormProps = {
  projectId?: string;
  source?: string;
};

type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  source?: string;
  interested_project_id?: string;
  next_step?: string;
};

export function LeadForm({ projectId, source }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload: LeadPayload = {
        name,
        phone,
        email: email || undefined,
        city: city || undefined,
        source: source ?? "frontend",
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
      setCity("");
      setMessage("Contato enviado com sucesso.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erro ao enviar contato.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* AJUSTE: espacamento entre campos */}
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Nome" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input label="Telefone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input label="Cidade" value={city} onChange={(event) => setCity(event.target.value)} />
      </div>

      <Textarea label="Observacao" value="Interesse em atendimento comercial" readOnly />

      <Button type="submit" variant="primary" disabled={loading} className="w-full md:w-auto">
        {loading ? "Enviando..." : "Enviar contato"}
      </Button>

      {message ? <p className="text-sm text-green-600">{message}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}
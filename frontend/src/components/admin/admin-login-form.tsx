"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao entrar");
      }

      router.push("/admin/imoveis");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="label-md text-primary">Senha admin</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          className="w-full rounded-[10px] border border-subtle bg-surface px-4 py-4 outline-none transition-colors focus:border-[var(--primary)]"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-[54px] items-center justify-center rounded-[10px] bg-primary px-6 text-on-primary disabled:opacity-70"
      >
        {isSubmitting ? "Entrando..." : "Entrar no admin"}
      </button>

      {message ? <p className="body-sm text-secondary">{message}</p> : null}
    </form>
  );
}
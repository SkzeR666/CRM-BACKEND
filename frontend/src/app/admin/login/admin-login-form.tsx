"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient, hasSupabaseClientEnv } from "@/lib/supabase/client";
import { withTheme } from "@/lib/samfer-links";
import type { SamferTheme } from "@/lib/utils/theme";

type Props = {
  theme: SamferTheme;
};

export function AdminLoginFormLocal({ theme }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasEnv = hasSupabaseClientEnv();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nextPath = useMemo(() => searchParams.get("next") || withTheme("/admin/imoveis", theme), [searchParams, theme]);

  useEffect(() => {
    if (!hasEnv) return;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace(nextPath);
      }
    });
  }, [hasEnv, nextPath, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      if (!hasSupabaseClientEnv()) {
        throw new Error("Supabase client env nao configurado no frontend.");
      }

      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw new Error(error.message);

      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Falha no login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="admin-form admin-login-form samfer-animate" onSubmit={handleSubmit}>
      <section className="admin-form-section">
        <h2>
          Login <span>admin</span>
        </h2>
        <p className="admin-section-text">Use o mesmo login do Supabase que voce cadastrou para o time administrador.</p>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="samfer-sr-only">Email</span>
            <input
              type="email"
              name="email"
              placeholder="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="admin-field">
            <span className="samfer-sr-only">Senha</span>
            <input
              type="password"
              name="password"
              placeholder="senha"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        </div>
      </section>

      <div className="admin-form-actions">
        <button type="submit" className="admin-primary-btn is-large" disabled={isLoading || !hasEnv}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      {!hasEnv ? <p className="admin-feedback is-error">Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.</p> : null}
      {message ? (
        <p className={`admin-feedback ${isError ? "is-error" : "is-success"}`}>{message}</p>
      ) : null}
    </form>
  );
}

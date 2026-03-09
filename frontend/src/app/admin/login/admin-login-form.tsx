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
  const [rememberMe, setRememberMe] = useState(true);
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
        throw new Error("Configuração do Supabase não encontrada no frontend.");
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
      setMessage(error instanceof Error ? error.message : "Não foi possível concluir o login.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleForgotPassword() {
    setIsError(false);
    setMessage("Recuperação de senha: fale com o administrador do Supabase para redefinir seu acesso.");
  }

  return (
    <form className="admin-login-card samfer-animate" onSubmit={handleSubmit}>
      <header className="admin-login-brand">
        <h1>
          SAMFER <span>IMÓVEIS</span>
        </h1>
        <p>Gerencie imóveis, edite informações e acompanhe os conteúdos da plataforma.</p>
      </header>

      <div className="admin-login-fields">
        <label className="admin-field">
          <span className="samfer-sr-only">E-mail</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
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
            placeholder="Senha"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <div className="admin-login-row">
          <label className="admin-login-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Lembrar-me</span>
          </label>

          <button type="button" className="admin-login-forgot" onClick={handleForgotPassword}>
            Esqueceu sua senha? <span>Clique aqui.</span>
          </button>
        </div>
      </div>

      <button type="submit" className="admin-primary-btn is-large" disabled={isLoading || !hasEnv}>
        {isLoading ? "Entrando..." : "Entrar no painel"}
      </button>

      {!hasEnv ? <p className="admin-feedback is-error">Configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.</p> : null}
      {message ? <p className={`admin-feedback ${isError ? "is-error" : "is-success"}`}>{message}</p> : null}
    </form>
  );
}

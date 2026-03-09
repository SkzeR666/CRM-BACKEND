"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient, hasSupabaseClientEnv } from "@/lib/supabase/client";

type Props = {
  children: React.ReactNode;
};

export function AdminAuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasEnv = hasSupabaseClientEnv();
  const [isLoading, setIsLoading] = useState(hasEnv);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const nextPath = `${pathname || "/admin/imoveis"}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const encodedNext = encodeURIComponent(nextPath);

  useEffect(() => {
    if (!hasEnv) return;

    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthenticated(Boolean(data.session));
      setIsLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(session));
      if (event === "SIGNED_OUT") {
        router.replace(`/admin/login?next=${encodedNext}`);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [encodedNext, hasEnv, router]);

  useEffect(() => {
    if (!hasEnv || isLoading || isAuthenticated) return;
    router.replace(`/admin/login?next=${encodedNext}`);
  }, [encodedNext, hasEnv, isAuthenticated, isLoading, router]);

  if (!hasEnv || isLoading || !isAuthenticated) {
    return (
      <div className="admin-auth-loading">
        <p>{hasEnv ? "Validando sessão..." : "Configure o Supabase no frontend para acessar o painel administrativo."}</p>
      </div>
    );
  }

  return <>{children}</>;
}


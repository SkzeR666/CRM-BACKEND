"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient, hasSupabaseClientEnv } from "@/lib/supabase/client";

type Props = {
  children: React.ReactNode;
};

export function AdminAuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const hasEnv = hasSupabaseClientEnv();
  const [isLoading, setIsLoading] = useState(hasEnv);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        const next = encodeURIComponent(pathname || "/admin/imoveis");
        router.replace(`/admin/login?next=${next}`);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [hasEnv, pathname, router]);

  useEffect(() => {
    if (!hasEnv || isLoading || isAuthenticated) return;
    const next = encodeURIComponent(pathname || "/admin/imoveis");
    router.replace(`/admin/login?next=${next}`);
  }, [hasEnv, isAuthenticated, isLoading, pathname, router]);

  if (!hasEnv || isLoading || !isAuthenticated) {
    return (
      <div className="admin-auth-loading">
        <p>{hasEnv ? "Validando sessao..." : "Configure o Supabase no frontend para acessar o admin."}</p>
      </div>
    );
  }

  return <>{children}</>;
}

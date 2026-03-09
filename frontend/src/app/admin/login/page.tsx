import { Suspense } from "react";
import { AdminHeader } from "@/components/shared/admin-header";
import { AdminLoginFormLocal } from "./admin-login-form";
import { resolveTheme } from "@/lib/utils/theme";

function AdminLoginFallback() {
  return (
    <div className="admin-auth-loading">
      <p>Carregando login...</p>
    </div>
  );
}

type Props = {
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);

  return (
    <div className={`admin-app ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="admin-shell">
        <AdminHeader theme={theme} backHref="/" backLabel="Voltar para site" showLogout={false} />
        <main className="admin-content">
          <section className="admin-title-block samfer-animate">
            <h1>
              Acesso <span>administrativo</span>
            </h1>
            <p>Entre com seu usuario do Supabase para gerenciar imoveis com seguranca.</p>
          </section>
          <Suspense fallback={<AdminLoginFallback />}>
            <AdminLoginFormLocal theme={theme} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

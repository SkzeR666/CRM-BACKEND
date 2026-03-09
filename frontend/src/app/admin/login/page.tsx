import { Suspense } from "react";
import { AdminHeader } from "@/components/shared/admin-header";
import { AdminLoginFormLocal } from "./admin-login-form";

function AdminLoginFallback() {
  return (
    <div className="admin-auth-loading">
      <p>Carregando login...</p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="admin-app">
      <div className="admin-shell">
        <AdminHeader backHref="/" backLabel="Voltar para site" showLogout={false} />
        <main className="admin-content">
          <section className="admin-title-block samfer-animate">
            <h1>
              Acesso <span>administrativo</span>
            </h1>
            <p>Entre com seu usuario do Supabase para gerenciar imoveis com seguranca.</p>
          </section>
          <Suspense fallback={<AdminLoginFallback />}>
            <AdminLoginFormLocal />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

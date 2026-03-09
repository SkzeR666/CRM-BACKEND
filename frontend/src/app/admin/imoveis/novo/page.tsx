import { AdminHeader } from "@/components/shared/admin-header";
import { AdminAuthGuard } from "@/components/shared/admin-auth-guard";
import { PropertyFormLocal } from "./property-form";

export default function AdminNewPropertyPage() {
  return (
    <AdminAuthGuard>
      <div className="admin-app">
        <div className="admin-shell">
          <AdminHeader backHref="/admin/imoveis" backLabel="Voltar para lista" />
          <main className="admin-content">
            <section className="admin-title-block samfer-animate">
              <h1>
                Novo <span>imovel</span>
              </h1>
              <p>Preencha os dados principais para publicar mais rapido e manter o padrao visual do site.</p>
            </section>
            <PropertyFormLocal />
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

import { AdminHeader } from "@/components/shared/admin-header";
import { AdminAuthGuard } from "@/components/shared/admin-auth-guard";
import { PropertyFormLocal } from "../novo/property-form";

type Props = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function AdminEditPropertyPage({ params }: Props) {
  const resolved = await params;

  return (
    <AdminAuthGuard>
      <div className="admin-app">
        <div className="admin-shell">
          <AdminHeader backHref="/admin/imoveis" backLabel="Voltar para lista" />
          <main className="admin-content">
            <section className="admin-title-block samfer-animate">
              <h1>
                Editar <span>imovel</span>
              </h1>
              <p>Ajuste as informacoes do empreendimento e mantenha a pagina publica consistente.</p>
            </section>
            <PropertyFormLocal projectId={resolved.id} />
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

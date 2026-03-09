import { AdminHeader } from "@/components/shared/admin-header";
import { AdminAuthGuard } from "@/components/shared/admin-auth-guard";
import { PropertyFormLocal } from "../novo/property-form";
import { resolveTheme } from "@/lib/utils/theme";

type Props = {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export default async function AdminEditPropertyPage({ params, searchParams }: Props) {
  const resolved = await params;
  const query = await searchParams;
  const theme = resolveTheme(query.theme);

  return (
    <AdminAuthGuard>
      <div className={`admin-app ${theme === "dark" ? "is-dark" : ""}`}>
        <div className="admin-shell">
          <AdminHeader
            theme={theme}
            section="imoveis"
            backHref="/admin/imoveis"
            backLabel="Voltar para lista"
          />
          <main className="admin-content">
            <section className="admin-title-block samfer-animate">
              <h1>
                Editar <span>imovel</span>
              </h1>
              <p>Ajuste as informacoes do empreendimento e mantenha a pagina publica consistente.</p>
            </section>
            <PropertyFormLocal projectId={resolved.id} theme={theme} />
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

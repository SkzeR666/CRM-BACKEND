import { AdminHeader } from "@/components/shared/admin-header";
import { AdminAuthGuard } from "@/components/shared/admin-auth-guard";
import { PropertyFormLocal } from "./property-form";
import { resolveTheme } from "@/lib/utils/theme";

type Props = {
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export default async function AdminNewPropertyPage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);

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
                Novo <span>imovel</span>
              </h1>
              <p>Preencha os dados principais para publicar mais rapido e manter o padrao visual do site.</p>
            </section>
            <PropertyFormLocal theme={theme} />
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}

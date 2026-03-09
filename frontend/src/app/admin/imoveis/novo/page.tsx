import { AdminHeader } from "@/components/shared/admin-header";
import { PropertyFormLocal } from "./property-form";

export default function AdminNewPropertyPage() {
  return (
    <div className="admin-app">
      <div className="admin-shell">
        <AdminHeader backHref="/admin/imoveis" backLabel="Voltar para lista" />
        <main className="admin-content">
          <PropertyFormLocal />
        </main>
      </div>
    </div>
  );
}

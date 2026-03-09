import { AdminHeader } from "@/components/shared/admin-header";
import { AdminLoginFormLocal } from "./admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="admin-app">
      <div className="admin-shell">
        <AdminHeader backHref="/admin/imoveis" backLabel="Voltar para lista" />
        <main className="admin-content">
          <AdminLoginFormLocal />
        </main>
      </div>
    </div>
  );
}

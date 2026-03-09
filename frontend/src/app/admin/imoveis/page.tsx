import { Suspense } from "react";
import { AdminPropertiesPageClient } from "./properties-client";

function AdminPropertiesFallback() {
  return (
    <div className="admin-auth-loading">
      <p>Carregando painel...</p>
    </div>
  );
}

export default function AdminPropertiesPage() {
  return (
    <Suspense fallback={<AdminPropertiesFallback />}>
      <AdminPropertiesPageClient />
    </Suspense>
  );
}

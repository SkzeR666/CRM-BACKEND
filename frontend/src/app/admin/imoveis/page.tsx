import { Suspense } from "react";
import { AdminPropertiesPageClient } from "./properties-client";
import { resolveTheme } from "@/lib/utils/theme";

function AdminPropertiesFallback() {
  return (
    <div className="admin-auth-loading">
      <p>Carregando painel...</p>
    </div>
  );
}

type Props = {
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export default async function AdminPropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);

  return (
    <Suspense fallback={<AdminPropertiesFallback />}>
      <AdminPropertiesPageClient theme={theme} />
    </Suspense>
  );
}

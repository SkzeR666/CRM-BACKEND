import { Suspense } from "react";
import { resolveTheme } from "@/lib/utils/theme";
import { AdminLeadsPageClient } from "./leads-client";

function AdminLeadsFallback() {
  return (
    <div className="admin-auth-loading">
      <p>Carregando leads...</p>
    </div>
  );
}

type Props = {
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export default async function AdminLeadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);

  return (
    <Suspense fallback={<AdminLeadsFallback />}>
      <AdminLeadsPageClient theme={theme} />
    </Suspense>
  );
}

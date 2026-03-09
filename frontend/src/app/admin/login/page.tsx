import { Suspense } from "react";
import { AdminLoginFormLocal } from "./admin-login-form";
import { resolveTheme } from "@/lib/utils/theme";

function AdminLoginFallback() {
  return (
    <div className="admin-auth-loading">
      <p>Carregando login...</p>
    </div>
  );
}

type Props = {
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);

  return (
    <div className={`admin-app admin-login-page ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="admin-login-shell">
        <Suspense fallback={<AdminLoginFallback />}>
          <AdminLoginFormLocal theme={theme} />
        </Suspense>
      </div>
    </div>
  );
}

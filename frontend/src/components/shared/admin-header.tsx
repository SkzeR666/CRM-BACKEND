"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminThemeToggle } from "@/components/shared/admin-theme-toggle";
import { withTheme } from "@/lib/samfer-links";
import type { SamferTheme } from "@/lib/utils/theme";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminHeaderProps = {
  theme: SamferTheme;
  backHref?: string;
  backLabel?: string;
  showLogout?: boolean;
};

export function AdminHeader({ theme, backHref, backLabel, showLogout = true }: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace(withTheme("/admin/login", theme));
    router.refresh();
  }

  return (
    <header className="admin-header">
      <div className="admin-header-shell">
        <div className="admin-header-left">
          {backHref ? (
            <Link href={withTheme(backHref, theme)} className="admin-header-link is-back">
              <ArrowLeft size={14} />
              {backLabel || "Voltar"}
            </Link>
          ) : null}
          <Link href={withTheme("/admin/imoveis", theme)} className="admin-header-brand">
            SAMFER ADMIN
          </Link>
        </div>

        <div className="admin-header-actions">
          <Link href={withTheme("/", theme)} className="admin-header-link" target="_blank" rel="noreferrer">
            Ver site
          </Link>
          {showLogout ? (
            <button type="button" className="admin-header-link" onClick={handleLogout}>
              Sair
            </button>
          ) : null}
          <AdminThemeToggle theme={theme} />
        </div>
      </div>
    </header>
  );
}

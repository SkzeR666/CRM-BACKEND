"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminHeaderProps = {
  backHref?: string;
  backLabel?: string;
  showLogout?: boolean;
};

export function AdminHeader({ backHref, backLabel, showLogout = true }: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-header">
      <div className="admin-header-shell">
        <div className="admin-header-left">
          {backHref ? (
            <Link href={backHref} className="admin-header-link is-back">
              <ArrowLeft size={14} />
              {backLabel || "Voltar"}
            </Link>
          ) : null}
          <Link href="/admin/imoveis" className="admin-header-brand">
            SAMFER ADMIN
          </Link>
        </div>

        <div className="admin-header-actions">
          <Link href="/imoveis" className="admin-header-link" target="_blank" rel="noreferrer">
            Ver site
          </Link>
          {showLogout ? (
            <button type="button" className="admin-header-link" onClick={handleLogout}>
              Sair
            </button>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

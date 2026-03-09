import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

type AdminHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export function AdminHeader({ backHref, backLabel }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-shell">
        <div className="admin-header-left">
          {backHref ? (
            <Link href={backHref} className="admin-header-link is-back">
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
          <Link href="/admin/login" className="admin-header-link">
            Chave API
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

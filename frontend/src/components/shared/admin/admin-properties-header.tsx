import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export function AdminPropertiesHeader() {
  return (
    <PageHeader
      title="Admin Properties List"
      description="Lista administrativa conectada ao endpoint /api/projects."
      actions={
        <>
          <Link
            href="/admin/login"
            className="inline-flex h-10 items-center justify-center rounded-[10px] border border-border px-4 text-sm font-medium text-foreground transition hover:bg-surface"
          >
            Configurar chave
          </Link>
          <Link
            href="/admin/imoveis/novo"
            className="inline-flex h-10 items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            Novo imovel
          </Link>
        </>
      }
    />
  );
}
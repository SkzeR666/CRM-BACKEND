import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const adminLinks = [
  { label: "Imoveis", href: "/admin/imoveis" },
  { label: "Novo imovel", href: "/admin/imoveis/novo" },
  { label: "Login", href: "/admin/login" },
  { label: "Site", href: "/imoveis" },
];

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
        <Link href="/admin/imoveis" className="text-sm font-semibold tracking-tight">
          PAINEL ADMIN
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex flex-wrap items-center gap-2" aria-label="Navegacao administrativa">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex h-9 items-center rounded-[10px] border border-border px-3 text-sm text-foreground-secondary transition hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Container } from "@/components/ui/container";

const navItems = [
  { label: "Imoveis", href: "/imoveis" },
  { label: "Empreendimentos", href: "/#destaques" },
  { label: "Financiamento", href: "/#contato" },
  { label: "Sobre", href: "/#sobre" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 py-4 backdrop-blur-[7.5px]">
      <Container>
        <div className="flex h-[72px] items-center justify-between rounded-[10px] border border-border bg-surface px-4 md:h-[100px] md:px-[26px]">
          <Link href="/" className="text-sm font-semibold tracking-tight text-foreground md:text-[22px]">
            SAMFER IMOVEIS
          </Link>

          <nav className="hidden items-center gap-4 md:flex" aria-label="Navegacao principal">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground transition hover:text-primary">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/#contato"
              className="hidden h-[53px] items-center rounded-[5px] bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover md:inline-flex"
            >
              Falar com especialista
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { label: "Imóveis", href: "#imoveis" },
  { label: "Empreendimentos", href: "#empreendimentos" },
  { label: "Financiamento", href: "#financiamento" },
  { label: "Sobre", href: "#sobre" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container>
        <div className="h-[100px]">
          <div
            className="
              bg-header-overlay
              flex h-full items-center justify-between
              rounded-b-[10px]
              px-6 py-3
              backdrop-blur-[7.5px]
            "
          >
            <Link
              href="/"
              className="
                text-primary
                flex h-[76px] items-center
                text-[18px] font-semibold leading-none
                tracking-[-0.01em]
              "
            >
              SAMFRE IMÓVEIS
            </Link>

            <nav className="hidden h-[76px] items-center md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="
                    text-primary
                    flex h-full items-center justify-center
                    px-4 py-3
                    text-[14px] font-medium leading-none
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noreferrer"
                className="
                  bg-primary text-on-primary
                  inline-flex h-[55px] items-center justify-center
                  rounded-[10px]
                  px-6 py-[18px]
                  text-[14px] font-medium leading-none
                "
              >
                Whatsapp
              </Link>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
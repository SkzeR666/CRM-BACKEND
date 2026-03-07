import Link from "next/link";
import { Container } from "@/components/ui/container";

const footerLinks = [
  { label: "Imóveis", href: "#imoveis" },
  { label: "Empreendimentos", href: "#empreendimentos" },
  { label: "Financiamento", href: "#financiamento" },
  { label: "Sobre", href: "#sobre" },
];

export function SiteFooter() {
  return (
    <footer className="pt-[72px] md:pt-[88px]">
      <Container>
        <div className="bg-surface border border-subtle rounded-[10px] px-4 py-5 md:px-10 md:py-10">
          <div className="grid gap-5 md:gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <p className="text-primary text-[18px] font-semibold tracking-[-0.01em]">
                SAMFRE IMÓVEIS
              </p>
              <p className="body-sm text-secondary mt-3 max-w-[320px]">
                Conectamos pessoas ao lugar certo para viver com mais conforto,
                segurança e tranquilidade.
              </p>
            </div>

            <div>
              <p className="label-lg text-primary">Navegação</p>
              <div className="mt-3 flex flex-col gap-2">
                {footerLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="body-sm text-secondary transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="label-lg text-primary">Contato</p>
              <div className="mt-3 flex flex-col gap-2">
                <p className="body-sm text-secondary">(12) 99999-9999</p>
                <p className="body-sm text-secondary">contato@samfre.com.br</p>
                <p className="body-sm text-secondary">Taubaté, São Paulo</p>
              </div>
            </div>
          </div>

          <div className="border-subtle mt-5 border-t pt-4 md:mt-8 md:pt-5">
            <p className="caption text-muted">
              © 2026 Samfre Imóveis. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
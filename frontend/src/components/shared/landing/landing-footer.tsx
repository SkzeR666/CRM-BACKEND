import Link from "next/link";
import { Container } from "@/components/ui/container";

export function LandingFooter() {
  return (
    <footer className="py-8">
      <Container className="animate-fade-up max-w-[1440px] px-3 anim-delay-3 md:px-0">
        <div className="space-y-8 rounded-[10px] border border-border bg-surface p-6 md:h-[301px] md:p-8">
          <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr] md:gap-[80px]">
            <div className="space-y-2">
              <h3 className="text-[22px] font-semibold tracking-[-0.22px] text-foreground">SAMFER IMÓVEIS</h3>
              <p className="max-w-[320px] text-[14px] text-foreground-secondary">
                Conectamos pessoas ao lugar certo para viver com mais conforto, segurança e tranquilidade.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[22px] font-semibold tracking-[-0.22px] text-foreground">Navegação</h4>
              <div className="space-y-1 text-[14px] text-foreground-secondary">
                <p><Link href="/imoveis">Imóveis</Link></p>
                <p><Link href="/#destaques">Empreendimentos</Link></p>
                <p>Financiamento</p>
                <p>Sobre</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[22px] font-semibold tracking-[-0.22px] text-foreground">Contato</h4>
              <div className="space-y-1 text-[14px] text-foreground-secondary">
                <p>(12) 99999-9999</p>
                <p>contato@samfer.com.br</p>
                <p>Taubaté, São Paulo</p>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-line" />

          <div className="flex flex-col gap-2 text-[12px] font-medium tracking-[0.12px] text-foreground-secondary md:flex-row md:items-center md:justify-between">
            <p>(c) 2026 Samfer Imóveis. Todos os direitos reservados.</p>
            <p>Augusto Santos WebDev0</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}


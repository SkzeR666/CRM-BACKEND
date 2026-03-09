import Link from "next/link";
import type { SamferTheme } from "@/lib/utils/theme";
import { withTheme, withThemeAndHash } from "@/lib/samfer-links";
import { SamferContactLink } from "./contact-link";

type Props = {
  theme: SamferTheme;
};

export function SamferFooter({ theme }: Props) {
  return (
    <footer className="samfer-footer" id="sobre">
      <div className="samfer-footer-top">
        <div>
          <strong>SAMFER IMÓVEIS</strong>
          <p>Conectamos pessoas ao lugar certo para viver com mais conforto, segurança e tranquilidade.</p>
        </div>
        <div>
          <strong>Navegação</strong>
          <p><Link href={withTheme("/imoveis", theme)}>Imóveis</Link></p>
          <p><Link href={withThemeAndHash("/", "empreendimentos", theme)}>Empreendimentos</Link></p>
          <p><Link href={withThemeAndHash("/", "financiamento", theme)}>Financiamento</Link></p>
          <p><Link href={withThemeAndHash("/", "sobre", theme)}>Sobre</Link></p>
        </div>
        <div>
          <strong>Contato</strong>
          <p><SamferContactLink href="tel:+5512999999999" location="footer_phone">(12) 99999-9999</SamferContactLink></p>
          <p><SamferContactLink href="mailto:contato@samfer.com.br" location="footer_email">contato@samfer.com.br</SamferContactLink></p>
          <p>Taubaté, São Paulo</p>
        </div>
      </div>
      <div className="samfer-footer-bottom">
        <p>© 2026 Samfer Imóveis. Todos os direitos reservados.</p>
        <p>Augusto Santos WebDev</p>
      </div>
    </footer>
  );
}

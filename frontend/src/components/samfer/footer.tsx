import Link from "next/link";
import type { SamferTheme } from "@/lib/utils/theme";
import { withTheme, withThemeAndHash } from "@/lib/samfer-links";

type Props = {
  theme: SamferTheme;
};

export function SamferFooter({ theme }: Props) {
  return (
    <footer className="samfer-footer" id="sobre">
      <div className="samfer-footer-top">
        <div>
          <strong>SAMFER IMOVEIS</strong>
          <p>Conectamos pessoas ao lugar certo para viver com mais conforto, seguranca e tranquilidade.</p>
        </div>
        <div>
          <strong>Navegacao</strong>
          <p><Link href={withTheme("/imoveis", theme)}>Imoveis</Link></p>
          <p><Link href={withThemeAndHash("/", "empreendimentos", theme)}>Empreendimentos</Link></p>
          <p><Link href={withThemeAndHash("/", "financiamento", theme)}>Financiamento</Link></p>
          <p><Link href={withThemeAndHash("/", "sobre", theme)}>Sobre</Link></p>
        </div>
        <div>
          <strong>Contato</strong>
          <p><a href="tel:+5512999999999">(12) 99999-9999</a></p>
          <p><a href="mailto:contato@samfer.com.br">contato@samfer.com.br</a></p>
          <p>Taubate, Sao Paulo</p>
        </div>
      </div>
      <div className="samfer-footer-bottom">
        <p>© 2026 Samfer Imoveis. Todos os direitos reservados.</p>
        <p>Augusto Santos WebDev</p>
      </div>
    </footer>
  );
}

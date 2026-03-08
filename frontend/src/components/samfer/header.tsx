import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { SamferTheme } from "@/lib/utils/theme";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  theme: SamferTheme;
  title?: string;
  backHref?: string;
};

function withTheme(href: string, theme: SamferTheme) {
  return `${href}${href.includes("?") ? "&" : "?"}theme=${theme}`;
}

export function SamferHeader({ theme, title, backHref }: Props) {
  return (
    <header className="samfer-header samfer-animate">
      <div className="samfer-header-left">
        {backHref ? (
          <Link href={withTheme(backHref, theme)} className="samfer-back-link">
            <ChevronLeft size={18} />
            <span>{title}</span>
          </Link>
        ) : (
          <strong className="samfer-logo">SAMFER IMOVEIS</strong>
        )}
      </div>

      <nav className="samfer-menu">
        <Link href={withTheme("/imoveis", theme)}>Imoveis</Link>
        <a href="#empreendimentos">Empreendimentos</a>
        <a href="#financiamento">Financiamento</a>
        <a href="#sobre">Sobre</a>
      </nav>

      <div className="samfer-header-actions">
        <button type="button" className="samfer-primary-btn">
          Falar com especialista
        </button>
        <ThemeToggle theme={theme} />
      </div>
    </header>
  );
}

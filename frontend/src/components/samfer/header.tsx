import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { SamferTheme } from "@/lib/utils/theme";
import { withTheme, withThemeAndHash } from "@/lib/samfer-links";
import { SamferContactLink } from "./contact-link";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  theme: SamferTheme;
  title?: string;
  backHref?: string;
  contactHref?: string;
};

export function SamferHeader({ theme, title, backHref, contactHref }: Props) {
  const defaultContactHref = withThemeAndHash("/", "financiamento", theme);
  const specialistHref = contactHref || defaultContactHref;
  const aboutHref = withThemeAndHash("/", "sobre", theme);
  const featuredHref = withThemeAndHash("/", "empreendimentos", theme);
  const financingHref = withThemeAndHash("/", "financiamento", theme);

  return (
    <header className="samfer-header samfer-animate">
      <div className="samfer-header-left">
        {backHref ? (
          <Link href={withTheme(backHref, theme)} className="samfer-back-link">
            <ChevronLeft size={18} />
            <span>{title}</span>
          </Link>
        ) : (
          <strong className="samfer-logo">SAMFER IMÓVEIS</strong>
        )}
      </div>

      <nav className="samfer-menu">
        <Link href={withTheme("/imoveis", theme)}>Imóveis</Link>
        <Link href={featuredHref}>Empreendimentos</Link>
        <Link href={financingHref}>Financiamento</Link>
        <Link href={aboutHref}>Sobre</Link>
      </nav>

      <div className="samfer-header-actions">
        <SamferContactLink href={specialistHref} className="samfer-primary-btn" location="header_specialist">
          Falar com especialista
        </SamferContactLink>
        <ThemeToggle theme={theme} />
      </div>
    </header>
  );
}

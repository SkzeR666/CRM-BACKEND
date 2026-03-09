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
  const specialistHref = contactHref || withThemeAndHash("/", "financiamento", theme);
  const isInnerPage = Boolean(title && backHref);

  return (
    <header className="samfer-header samfer-animate">
      <div className="samfer-header-left">
        {isInnerPage ? (
          <Link href={withTheme(backHref || "/", theme)} className="samfer-back-link">
            <ChevronLeft size={18} />
            <span>{title}</span>
          </Link>
        ) : (
          <strong className="samfer-logo">SAMFER IMOVEIS</strong>
        )}
      </div>

      <div className="samfer-header-actions">
        <SamferContactLink href={specialistHref} className="samfer-primary-btn" location="header_specialist">
          Falar com especialista
        </SamferContactLink>
        <ThemeToggle theme={theme} />
      </div>
    </header>
  );
}

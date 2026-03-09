import type { SamferTheme } from "@/lib/utils/theme";
import { withThemeAndHash } from "@/lib/samfer-links";
import { SamferContactLink } from "./contact-link";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  theme: SamferTheme;
  contactHref?: string;
};

export function SamferHeader({ theme, contactHref }: Props) {
  const specialistHref = contactHref || withThemeAndHash("/", "financiamento", theme);

  return (
    <header className="samfer-header samfer-animate">
      <div className="samfer-header-left">
        <strong className="samfer-logo">SAMFER IMOVEIS</strong>
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

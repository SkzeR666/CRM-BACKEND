"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminThemeToggle } from "@/components/shared/admin-theme-toggle";
import { withTheme } from "@/lib/samfer-links";
import type { SamferTheme } from "@/lib/utils/theme";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminHeaderProps = {
  theme: SamferTheme;
  backHref?: string;
  backLabel?: string;
  showLogout?: boolean;
  showNav?: boolean;
  section?: "imoveis" | "leads";
};

export function AdminHeader({
  theme,
  backHref,
  backLabel,
  showLogout = true,
  showNav = true,
  section = "imoveis",
}: AdminHeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".admin-app");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animatedElements = Array.from(root.querySelectorAll<HTMLElement>(".samfer-animate"));
    if (!animatedElements.length) return;

    root.classList.add("has-motion");

    animatedElements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 38, 220)}ms`);
    });

    if (reduceMotion) {
      animatedElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    animatedElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace(withTheme("/admin/login", theme));
    router.refresh();
  }

  return (
    <header className={`admin-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="admin-header-shell">
        <div className="admin-header-left">
          {backHref ? (
            <Link href={withTheme(backHref, theme)} className="admin-header-link is-back">
              <ArrowLeft size={14} />
              {backLabel || "Voltar"}
            </Link>
          ) : null}
          <Link href={withTheme("/admin/imoveis", theme)} className="admin-header-brand">
            SAMFER ADMIN
          </Link>
        </div>

        <div className="admin-header-actions">
          <Link href={withTheme("/", theme)} className="admin-header-link" target="_blank" rel="noreferrer">
            Ver site
          </Link>
          {showLogout ? (
            <button type="button" className="admin-header-link" onClick={handleLogout}>
              Sair
            </button>
          ) : null}
          <AdminThemeToggle theme={theme} />
        </div>
      </div>

      {showNav ? (
        <div className="admin-header-tabs">
          <nav className="admin-header-nav" aria-label="Navegação do admin">
            <Link
              href={withTheme("/admin/imoveis", theme)}
              className={`admin-header-link ${section === "imoveis" ? "is-active" : ""}`}
            >
              Imóveis
            </Link>
            <Link
              href={withTheme("/admin/leads", theme)}
              className={`admin-header-link ${section === "leads" ? "is-active" : ""}`}
            >
              Leads
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

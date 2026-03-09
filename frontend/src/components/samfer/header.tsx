"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
    const root = document.querySelector<HTMLElement>(".samfer-app");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animatedElements = Array.from(root.querySelectorAll<HTMLElement>(".samfer-animate"));
    if (!animatedElements.length) return;

    root.classList.add("has-motion");

    animatedElements.forEach((element, index) => {
      element.classList.add("is-pending");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 42, 240)}ms`);
    });

    if (reduceMotion) {
      animatedElements.forEach((element) => {
        element.classList.remove("is-pending");
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("is-pending");
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

  return (
    <header className={`samfer-header samfer-animate ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="samfer-header-left">
        {isInnerPage ? (
          <Link href={withTheme(backHref || "/", theme)} className="samfer-back-link">
            <ChevronLeft size={18} />
            <span>{title}</span>
          </Link>
        ) : (
          <strong className="samfer-logo">SAMFER IMÓVEIS</strong>
        )}
      </div>

      <div className="samfer-header-actions">
        <SamferContactLink href={specialistHref} className="samfer-primary-btn" location="header_specialist">
          <span className="samfer-contact-label-full">Falar com nossa equipe</span>
          <span className="samfer-contact-label-short">Falar agora</span>
        </SamferContactLink>
        <ThemeToggle theme={theme} />
      </div>
    </header>
  );
}

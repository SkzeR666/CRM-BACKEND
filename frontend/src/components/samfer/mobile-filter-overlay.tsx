"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";

type Props = {
  triggerLabel: string;
  overlayTitle: string;
  children: ReactNode;
};

export function SamferMobileFilterOverlay({ triggerLabel, overlayTitle, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className={`samfer-mobile-filter-shell ${isOpen ? "is-open" : ""}`}>
      <button type="button" className="samfer-mobile-filter-trigger" onClick={() => setIsOpen(true)}>
        <Search size={18} />
        <span>{triggerLabel}</span>
      </button>

      <div
        className={`samfer-mobile-filter-layer ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      <div className={`samfer-mobile-filter-panel ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <header className="samfer-mobile-filter-head">
          <strong>{overlayTitle}</strong>
          <button
            type="button"
            className="samfer-icon-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar busca"
          >
            <X size={18} />
          </button>
        </header>

        <div onSubmitCapture={() => setIsOpen(false)}>{children}</div>
      </div>
    </div>
  );
}


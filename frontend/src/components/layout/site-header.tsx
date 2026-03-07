"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { label: "Imóveis", href: "#imoveis" },
  { label: "Empreendimentos", href: "#empreendimentos" },
  { label: "Financiamento", href: "#financiamento" },
  { label: "Sobre", href: "#sobre" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-8 z-50">
      <Container>
        <div className="relative">
          <div
            className="
              bg-header-overlay border border-subtle
              flex min-h-[72px] items-center justify-between
              rounded-[10px]
              px-3 py-3
              backdrop-blur-[7.5px]
              md:min-h-[84px] md:px-4
            "
          >
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="
                text-primary
                flex items-center
                text-[16px] font-semibold leading-none tracking-[-0.01em]
                md:text-[18px]
              "
            >
              SAMFRE IMÓVEIS
            </Link>

            <nav className="hidden items-center md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="
                    text-primary
                    inline-flex h-[44px] items-center justify-center
                    rounded-[6px] px-4
                    text-[14px] font-medium leading-none
                    transition-colors duration-200 hover:text-secondary
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noreferrer"
                className="
                  bg-primary text-on-primary
                  inline-flex h-[52px] items-center justify-center
                  rounded-[6px] px-6
                  text-[14px] font-medium leading-none
                  transition duration-200 hover:brightness-[0.98]
                "
              >
                Whatsapp
              </Link>

              <ThemeToggle size="desktop" />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir WhatsApp"
                className="
                  bg-primary text-on-primary
                  inline-flex h-[46px] w-[46px] items-center justify-center
                  rounded-[6px]
                  transition duration-200 hover:brightness-[0.98]
                "
              >
                <MessageCircle size={18} strokeWidth={1.9} />
              </Link>

              <ThemeToggle size="mobile" />

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileMenuOpen}
                className="
                  bg-surface text-icon-default
                  inline-flex h-[46px] w-[46px] items-center justify-center
                  rounded-[6px]
                  transition duration-200 hover:opacity-95
                "
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileMenuOpen ? "close" : "menu"}
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center"
                  >
                    {mobileMenuOpen ? (
                      <X size={18} strokeWidth={1.9} />
                    ) : (
                      <Menu size={18} strokeWidth={1.9} />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[-1] bg-black/25 md:hidden"
                />

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-3 md:hidden"
                >
                  <div className="bg-header-overlay border border-subtle rounded-[10px] p-3 backdrop-blur-[7.5px]">
                    <nav className="flex flex-col gap-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="
                            bg-surface border border-subtle text-primary
                            flex min-h-[52px] items-center rounded-[6px]
                            px-4
                            text-[15px] font-medium
                            transition duration-200 hover:opacity-95
                          "
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </header>
  );
}
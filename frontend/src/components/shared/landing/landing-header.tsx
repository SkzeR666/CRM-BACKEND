import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function LandingHeader() {
  return (
    <>
      <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-[1440px] -translate-x-1/2 md:top-8 md:w-[calc(100%-64px)]">
        <header className="animate-fade-up backdrop-blur-[7.5px]">
          <div className="flex h-[72px] items-center justify-between rounded-[10px] border border-border bg-[rgba(236,236,231,0.9)] px-4 md:h-[100px] md:px-[26px] dark:bg-[rgba(21,21,21,0.88)]">
            <Link href="/" className="text-[11px] font-semibold tracking-tight text-foreground md:text-[22px] md:tracking-[-0.22px]">
              SAMFER IMÓVEIS
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/#contato"
                className="hidden h-[53px] items-center rounded-[5px] bg-primary px-6 text-[14px] font-medium text-primary-foreground transition hover:bg-primary-hover md:inline-flex"
              >
                Falar com nossa equipe
              </Link>
              <ThemeToggle className="size-[40px] md:size-[53px]" iconSize={15} />
            </div>
          </div>
        </header>
      </div>

      <div className="h-[96px] md:h-[148px]" aria-hidden />
    </>
  );
}


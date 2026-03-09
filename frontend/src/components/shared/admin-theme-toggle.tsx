"use client";

import { Moon, SunMedium } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SamferTheme } from "@/lib/utils/theme";

type Props = {
  theme: SamferTheme;
};

export function AdminThemeToggle({ theme }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function toggleTheme() {
    const params = new URLSearchParams(searchParams.toString());
    const nextTheme = theme === "dark" ? "light" : "dark";
    params.set("theme", nextTheme);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <button type="button" aria-label="Alternar tema" className="admin-theme-toggle" onClick={toggleTheme}>
      {theme === "dark" ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  );
}

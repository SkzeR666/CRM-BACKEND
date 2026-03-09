"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ThemeToggleProps = {
  className?: string;
  iconSize?: number;
};

function getInitialDarkState() {
  if (typeof window === "undefined") return false;

  const savedTheme = window.localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

  document.documentElement.classList.toggle("dark", shouldUseDark);
  return shouldUseDark;
}

export function ThemeToggle({ className, iconSize = 18 }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(getInitialDarkState);

  function handleToggle() {
    const nextDark = !isDark;
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem("theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  }

  return (
    <button
      type="button"
      aria-label="Alternar tema"
      onClick={handleToggle}
      className={cn(
        "admin-theme-toggle",
        className,
      )}
    >
      {isDark ? <Sun size={iconSize} strokeWidth={1.7} /> : <Moon size={iconSize} strokeWidth={1.7} />}
    </button>
  );
}

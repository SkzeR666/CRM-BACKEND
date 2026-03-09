"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ThemeToggleProps = {
  className?: string;
  iconSize?: number;
};

function getInitialTheme() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle({ className, iconSize = 18 }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(getInitialTheme);

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

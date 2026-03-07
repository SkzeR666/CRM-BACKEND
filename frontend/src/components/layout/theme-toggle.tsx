"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeToggleProps = {
  size?: "mobile" | "desktop";
};

export function ThemeToggle({ size = "desktop" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme ?? "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  const isMobile = size === "mobile";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className={`
        bg-surface border border-subtle text-icon-default
        inline-flex items-center justify-center rounded-[10px]
        transition duration-200 hover:opacity-95
        ${isMobile ? "h-[46px] w-[46px]" : "h-[55px] w-[55px]"}
      `}
    >
      {mounted && theme === "dark" ? (
        <Sun size={isMobile ? 18 : 22} strokeWidth={1.9} />
      ) : (
        <Moon size={isMobile ? 18 : 22} strokeWidth={1.9} />
      )}
    </button>
  );
}
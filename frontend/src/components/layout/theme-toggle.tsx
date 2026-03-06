"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
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

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className="
        flex h-[55px] w-[55px] items-center justify-center
        rounded-[10px]
        bg-[var(--bg-surface)]
        text-[var(--icon-default)]
      "
    >
      {mounted && theme === "dark" ? (
        <Sun size={24} strokeWidth={1.8} />
      ) : (
        <Moon size={24} strokeWidth={1.8} />
      )}
    </button>
  );
}
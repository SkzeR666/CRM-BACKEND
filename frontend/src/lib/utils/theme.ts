export type SamferTheme = "light" | "dark";

export function resolveTheme(theme?: string | string[] | null): SamferTheme {
  const value = Array.isArray(theme) ? theme[0] : theme;
  return value === "dark" ? "dark" : "light";
}


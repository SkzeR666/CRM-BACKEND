import type { Project } from "@/types/project";
import type { SamferTheme } from "@/lib/utils/theme";

const DEFAULT_PHONE = "5512999999999";
const DEFAULT_EMAIL = "contato@samfer.com.br";

export function withTheme(href: string, theme: SamferTheme) {
  return `${href}${href.includes("?") ? "&" : "?"}theme=${theme}`;
}

export function withThemeAndHash(pathname: string, hash: string, theme: SamferTheme) {
  return `${withTheme(pathname, theme)}#${hash}`;
}

export function buildContactMessage(project?: Project | null) {
  if (!project) return "Olá! Quero conversar com a equipe da Samfer sobre um imóvel.";

  const location = [project.city, project.state].filter(Boolean).join(" - ");
  return `Olá! Tenho interesse no imóvel "${project.title}"${location ? ` em ${location}` : ""}. Gostaria de mais informações.`;
}

export function buildWhatsAppLink(message: string, phone = DEFAULT_PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoLink(subject: string, body: string, email = DEFAULT_EMAIL) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}


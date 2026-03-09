import type { Project } from "@/types/project";

export const samferImages = {
  hero: "/images/hero-property.jpg",
  cardA: "/images/hero-property.jpg",
  cardB: "/images/hero-property.jpg",
  galleryA: "/images/hero-property.jpg",
  galleryB: "/images/hero-property.jpg",
  galleryC: "/images/hero-property.jpg",
  map: "/images/hero-property.jpg",
  floor: "/images/hero-property.jpg",
  avatar: "/images/hero-property.jpg",
};

export const testimonials = [
  {
    id: "t-1",
    title: "Atendimento claro e ágil",
    text: "A equipe explicou as opções de financiamento e ajudou a escolher o imóvel ideal para meu momento.",
    name: "Cliente Samfer",
    city: "Taubaté, SP",
    avatar: samferImages.avatar,
  },
  {
    id: "t-2",
    title: "Processo sem complicação",
    text: "Consegui visitar os imóveis que faziam sentido para meu perfil e fechei com segurança.",
    name: "Cliente Samfer",
    city: "Vale do Paraíba, SP",
    avatar: samferImages.avatar,
  },
];

export const faqItems = [
  {
    question: "Como agendar visita a um imóvel?",
    answer:
      "Na página do imóvel, use o botão de WhatsApp ou envie o formulário de contato. A equipe confirma horários disponíveis.",
  },
  {
    question: "Vocês ajudam com financiamento imobiliário?",
    answer:
      "Sim. A Samfer orienta as opções de financiamento e a documentação para facilitar a aprovação junto ao banco.",
  },
  {
    question: "As informações dos imóveis são atualizadas?",
    answer:
      "Sim. Mantemos os imóveis e valores sempre atualizados para você pesquisar com confiança e segurança.",
  },
];

export const differentials = [
  "Churrasqueira",
  "Espaço Kids",
  "Garrafão Basquete",
  "Piscina",
  "Playground",
  "Pet Place",
];

export function getFallbackCover(project?: Project | null, index = 0) {
  if (project?.cover_image) return project.cover_image;
  return index % 2 === 0 ? samferImages.cardA : samferImages.cardB;
}


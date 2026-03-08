import type { Project } from "@/types/project";

export const samferImages = {
  hero: "https://www.figma.com/api/mcp/asset/9944f4bc-88f9-4d58-a640-6f6d050a63d2",
  cardA: "https://www.figma.com/api/mcp/asset/4bdac277-165b-4c71-b139-21e3355b3fc7",
  cardB: "https://www.figma.com/api/mcp/asset/74492860-26a4-424f-af74-6c487d31f9c0",
  galleryA: "https://www.figma.com/api/mcp/asset/46fb7dab-c218-4a09-b3b0-cea768358171",
  galleryB: "https://www.figma.com/api/mcp/asset/c6e4a1f1-96d3-40c6-9505-651ed62bf8c9",
  galleryC: "https://www.figma.com/api/mcp/asset/1c2c021a-c1f3-4350-bbeb-7c464ff61004",
  map: "https://www.figma.com/api/mcp/asset/94910e8c-e3b5-4c26-96fd-e000a7638f42",
  floor: "https://www.figma.com/api/mcp/asset/1134a37f-2f6f-44b6-bb7e-1c62f401c55b",
  avatar: "https://www.figma.com/api/mcp/asset/2a71e821-f1ed-49a8-8679-024d28a111cd",
};

export const testimonials = Array.from({ length: 3 }).map((_, index) => ({
  id: `t-${index}`,
  title: "Trabalho incrível!",
  text: "Consegui entender melhor meu financiamento e escolher uma opção que cabia no meu bolso.",
  name: "João Carlos",
  city: "Taubaté, SP",
  avatar: samferImages.avatar,
}));

export const faqItems = [
  {
    question: "Como posso agendar uma visita ao imóvel?",
    answer:
      "Você pode entrar em contato pelo WhatsApp ou pelo formulário da página. Nossa equipe organiza a visita conforme sua disponibilidade.",
  },
  { question: "Vocês ajudam com financiamento imobiliário?", answer: "" },
  { question: "Os imóveis anunciados estão atualizados?", answer: "" },
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


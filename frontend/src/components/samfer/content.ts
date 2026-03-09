import type { Project } from "@/types/project";

export const samferImages = {
  hero: "https://www.figma.com/api/mcp/asset/9944f4bc-88f9-4d58-a640-6f6d050a63d2",
  cardA: "https://www.figma.com/api/mcp/asset/4bdac277-165b-4c71-b139-21e3355b3fc7",
  cardB: "https://www.figma.com/api/mcp/asset/74492860-26a4-424f-af74-6c487d31f9c0",
  galleryA: "https://www.figma.com/api/mcp/asset/46fb7dab-c218-4a09-b3b0-cea768358171",
  galleryB: "https://www.figma.com/api/mcp/asset/c6e4a1f1-96d3-40c6-9505-651ed62bf8c9",
  galleryC: "https://www.figma.com/api/mcp/asset/1c2c021a-c1f3-4350-bbeb-7c464ff61004",
  map: "https://www.figma.com/api/mcp/asset/94910e8c-e3b5-4c26-96fd-e000a7638f42",
  floor: "https://www.figma.com/api/mcp/asset/950ad8a8-196f-439a-8624-2f19536b8a86",
  avatar: "https://www.figma.com/api/mcp/asset/2a71e821-f1ed-49a8-8679-024d28a111cd",
};

export const testimonials = [
  {
    id: "t-1",
    title: "Atendimento claro e agil",
    text: "A equipe explicou as opcoes de financiamento e ajudou a escolher o imovel ideal para meu momento.",
    name: "Cliente Samfer",
    city: "Taubate, SP",
    avatar: samferImages.avatar,
  },
  {
    id: "t-2",
    title: "Processo sem complicacao",
    text: "Consegui visitar os imoveis que faziam sentido para meu perfil e fechei com seguranca.",
    name: "Cliente Samfer",
    city: "Vale do Paraiba, SP",
    avatar: samferImages.avatar,
  },
];

export const faqItems = [
  {
    question: "Como agendar visita a um imovel?",
    answer:
      "Na pagina do imovel, use o botao de WhatsApp ou envie o formulario de contato. A equipe confirma horarios disponiveis.",
  },
  {
    question: "Vocês ajudam com financiamento imobiliario?",
    answer:
      "Sim. A Samfer orienta as opcoes de financiamento e a documentacao para facilitar a aprovacao junto ao banco.",
  },
  {
    question: "As informacoes dos imoveis sao atualizadas?",
    answer:
      "Sim. A listagem e o detalhe usam os dados atuais da base de projetos conectada ao backend.",
  },
];

export const differentials = [
  "Churrasqueira",
  "Espaco Kids",
  "Garrafao Basquete",
  "Piscina",
  "Playground",
  "Pet Place",
];

export function getFallbackCover(project?: Project | null, index = 0) {
  if (project?.cover_image) return project.cover_image;
  return index % 2 === 0 ? samferImages.cardA : samferImages.cardB;
}

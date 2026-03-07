export type PropertyItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: "Apartamento" | "Casa" | "Terreno" | "Cobertura";
  price: number;
  suites: number;
  parkingSpots: number;
  bedrooms: number;
  imageSrc: string;
};

export const featuredProperties: PropertyItem[] = [
  {
    id: "1",
    title: "Residencial Vista Verde",
    description:
      "Um empreendimento pensado para quem busca conforto, privacidade e qualidade de vida em uma excelente localização.",
    location: "Taubaté, SP",
    type: "Apartamento",
    price: 550000,
    suites: 2,
    parkingSpots: 1,
    bedrooms: 3,
    imageSrc: "/images/property-1.jpg",
  },
  {
    id: "2",
    title: "Residencial Céu Azul",
    description:
      "Um empreendimento pensado para quem busca conforto, praticidade e qualidade de vida em uma excelente localização.",
    location: "São José dos Campos, SP",
    type: "Apartamento",
    price: 650000,
    suites: 2,
    parkingSpots: 1,
    bedrooms: 3,
    imageSrc: "/images/property-2.jpg",
  },
  {
    id: "3",
    title: "Jardins do Vale",
    description:
      "Uma opção acolhedora para famílias que valorizam espaço, segurança e um bairro tranquilo para viver bem.",
    location: "Pindamonhangaba, SP",
    type: "Casa",
    price: 890000,
    suites: 3,
    parkingSpots: 2,
    bedrooms: 4,
    imageSrc: "/images/property-3.jpg",
  },
  {
    id: "4",
    title: "Altitude Prime",
    description:
      "Design contemporâneo, vista privilegiada e acabamentos de alto padrão para um estilo de vida sofisticado.",
    location: "Taubaté, SP",
    type: "Cobertura",
    price: 1200000,
    suites: 2,
    parkingSpots: 3,
    bedrooms: 4,
    imageSrc: "/images/property-4.jpg",
  },
];

export type TestimonialItem = {
  id: string;
  title: string;
  content: string;
  name: string;
  role: string;
  avatarSrc: string;
  rating: number;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const testimonials: TestimonialItem[] = [
  {
    id: "1",
    title: "Trabalho incrível!",
    content:
      "Consegui encontrar meu lar com muita clareza e acolhimento durante todo o processo. O atendimento foi muito atencioso e transparente.",
    name: "João Carlos",
    role: "Taubaté, SP",
    avatarSrc: "/images/avatar-1.jpg",
    rating: 5,
  },
  {
    id: "2",
    title: "Atendimento eficiente",
    content:
      "Recebi todo o suporte necessário para escolher minha opção e seguir com mais confiança. O processo foi muito mais simples do que eu imaginava.",
    name: "Mariana Souza",
    role: "Taubaté, SP",
    avatarSrc: "/images/avatar-2.jpg",
    rating: 4,
  },
  {
    id: "3",
    title: "Equipe de confiança",
    content:
      "A turma deu atenção durante todo o processo. Tiraram minhas dúvidas e explicaram cada etapa com muita segurança e cuidado.",
    name: "Carlos Henrique",
    role: "Pindamonhangaba, SP",
    avatarSrc: "/images/avatar-3.jpg",
    rating: 4,
  },
];

export const faqs: FaqItem[] = [
  {
    id: "1",
    question: "Como posso agendar uma visita ao imóvel?",
    answer:
      "Você pode entrar em contato pelo WhatsApp ou pelo formulário da página. Nossa equipe organiza a visita conforme sua disponibilidade.",
  },
  {
    id: "2",
    question: "Vocês ajudam com financiamento imobiliário?",
    answer:
      "Sim. Podemos orientar sobre opções de financiamento, documentação necessária e próximos passos para facilitar sua decisão.",
  },
  {
    id: "3",
    question: "Os imóveis anunciados estão atualizados?",
    answer:
      "Nossa equipe busca manter tudo atualizado com frequência. Mesmo assim, antes da visita confirmamos disponibilidade e condições do imóvel.",
  },
  {
    id: "4",
    question: "Posso usar o filtro para encontrar imóveis pelo meu perfil?",
    answer:
      "Sim. Você pode filtrar por região, tipo, preço, suítes, vagas e quartos para encontrar opções mais alinhadas ao que procura.",
  },
];
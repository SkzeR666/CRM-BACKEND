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
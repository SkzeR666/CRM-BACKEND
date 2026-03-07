export type PropertyStatus = "available" | "reserved" | "sold";
export type PropertyType =
  | "apartamento"
  | "casa"
  | "terreno"
  | "cobertura";

export type Property = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
  type: PropertyType | null;
  price: number | null;
  bedrooms: number;
  suites: number;
  parking_spots: number;
  bathrooms: number;
  area_m2: number | null;
  cover_image: string | null;
  gallery: string[];
  is_featured: boolean;
  status: PropertyStatus;
  created_at: string;
};
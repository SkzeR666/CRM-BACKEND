export type ProjectStatus = "available" | "reserved" | "sold";

export type Project = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  type?: string | null;
  status?: ProjectStatus | string | null;
  price?: number | null;
  bedrooms?: number | null;
  suites?: number | null;
  parking_spots?: number | null;
  bathrooms?: number | null;
  area_m2?: number | null;
  cover_image?: string | null;
  gallery?: string[] | null;
  is_featured?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateProjectPayload = {
  slug: string;
  title: string;
  city?: string;
  status?: ProjectStatus;
};

export type UpdateProjectPayload = Partial<CreateProjectPayload> & {
  slug?: string;
};

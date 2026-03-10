import { z } from "zod";

const optText = z.string().trim().transform((value) => (value === "" ? undefined : value)).optional();

const optUrl = optText.refine((value) => value === undefined || /^https?:\/\//i.test(value), {
  message: "Invalid URL",
});

const optNumber = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (value === undefined) return undefined;
  const number = typeof value === "string" ? Number(value.replace(",", ".")) : value;
  return Number.isFinite(number) ? number : undefined;
});

const optInt = z.union([z.number().int(), z.string()]).optional().transform((value) => {
  if (value === undefined) return undefined;
  const number = typeof value === "string" ? Number(value) : value;
  return Number.isInteger(number) ? number : undefined;
});

const optGallery = z.union([z.array(z.string()), z.string()]).optional().transform((value) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean);

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
});

const ProjectInputSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  title: z.string().min(2).optional(),
  nome: z.string().min(2).optional(),
  description: optText,
  descricao: optText,
  city: optText,
  cidade: optText,
  state: optText,
  neighborhood: optText,
  bairro: optText,
  type: optText,
  status: optText,
  price: optNumber,
  bedrooms: optInt,
  suites: optInt,
  parking_spots: optInt,
  bathrooms: optInt,
  area_m2: optNumber,
  cover_image: optUrl,
  hero_image_url: optUrl,
  gallery: optGallery,
  gallery_urls: optGallery,
  is_featured: z.coerce.boolean().optional(),
  destaque: z.coerce.boolean().optional(),
});

export const CreateProjectSchema = ProjectInputSchema.strict().transform((object) => {
  const title = object.title ?? object.nome;
  if (!title) throw new Error("Title is required.");

  return {
    slug: object.slug,
    title,
    description: object.description ?? object.descricao,
    city: object.city ?? object.cidade,
    state: object.state,
    neighborhood: object.neighborhood ?? object.bairro,
    type: object.type,
    status: object.status,
    price: object.price,
    bedrooms: object.bedrooms,
    suites: object.suites,
    parking_spots: object.parking_spots,
    bathrooms: object.bathrooms,
    area_m2: object.area_m2,
    cover_image: object.cover_image ?? object.hero_image_url,
    gallery: object.gallery ?? object.gallery_urls,
    is_featured: object.is_featured ?? object.destaque,
  };
});

export const UpdateProjectSchema = ProjectInputSchema.partial().strict().transform((object) => {
  const patch: Record<string, unknown> = {};

  if (object.slug !== undefined) patch.slug = object.slug;
  if (object.title !== undefined || object.nome !== undefined) patch.title = object.title ?? object.nome;
  if (object.description !== undefined || object.descricao !== undefined) {
    patch.description = object.description ?? object.descricao;
  }
  if (object.city !== undefined || object.cidade !== undefined) patch.city = object.city ?? object.cidade;
  if (object.state !== undefined) patch.state = object.state;
  if (object.neighborhood !== undefined || object.bairro !== undefined) {
    patch.neighborhood = object.neighborhood ?? object.bairro;
  }
  if (object.type !== undefined) patch.type = object.type;
  if (object.status !== undefined) patch.status = object.status;
  if (object.price !== undefined) patch.price = object.price;
  if (object.bedrooms !== undefined) patch.bedrooms = object.bedrooms;
  if (object.suites !== undefined) patch.suites = object.suites;
  if (object.parking_spots !== undefined) patch.parking_spots = object.parking_spots;
  if (object.bathrooms !== undefined) patch.bathrooms = object.bathrooms;
  if (object.area_m2 !== undefined) patch.area_m2 = object.area_m2;
  if (object.cover_image !== undefined || object.hero_image_url !== undefined) {
    patch.cover_image = object.cover_image ?? object.hero_image_url;
  }
  if (object.gallery !== undefined || object.gallery_urls !== undefined) {
    patch.gallery = object.gallery ?? object.gallery_urls;
  }
  if (object.is_featured !== undefined || object.destaque !== undefined) {
    patch.is_featured = object.is_featured ?? object.destaque;
  }

  return patch;
});

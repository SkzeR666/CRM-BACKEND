import { z } from "zod";

const optText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

const optUrl = optText.refine((v) => v === undefined || /^https?:\/\//i.test(v), {
  message: "Invalid URL",
});

const optNumber = z
  .union([z.number(), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    const n = typeof v === "string" ? Number(v.replace(",", ".")) : v;
    return Number.isFinite(n) ? n : undefined;
  });

const optInt = z
  .union([z.number().int(), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isInteger(n) ? n : undefined;
  });

const optGallery = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    if (Array.isArray(v)) return v.filter(Boolean);
    return v
      .split(",")
      .map((s) => s.trim())
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

export const CreateProjectSchema = ProjectInputSchema.strict().transform((obj) => {
  const title = obj.title ?? obj.nome;
  if (!title) throw new Error("Title is required.");

  return {
    slug: obj.slug,
    title,
    description: obj.description ?? obj.descricao,
    city: obj.city ?? obj.cidade,
    state: obj.state,
    neighborhood: obj.neighborhood ?? obj.bairro,
    type: obj.type,
    status: obj.status,
    price: obj.price,
    bedrooms: obj.bedrooms,
    suites: obj.suites,
    parking_spots: obj.parking_spots,
    bathrooms: obj.bathrooms,
    area_m2: obj.area_m2,
    cover_image: obj.cover_image ?? obj.hero_image_url,
    gallery: obj.gallery ?? obj.gallery_urls,
    is_featured: obj.is_featured ?? obj.destaque,
  };
});

export const UpdateProjectSchema = ProjectInputSchema.partial()
  .strict()
  .transform((obj) => {
    const patch: Record<string, unknown> = {};

    if (obj.slug !== undefined) patch.slug = obj.slug;

    if (obj.title !== undefined || obj.nome !== undefined) {
      patch.title = obj.title ?? obj.nome;
    }

    if (obj.description !== undefined || obj.descricao !== undefined) {
      patch.description = obj.description ?? obj.descricao;
    }

    if (obj.city !== undefined || obj.cidade !== undefined) {
      patch.city = obj.city ?? obj.cidade;
    }

    if (obj.state !== undefined) patch.state = obj.state;

    if (obj.neighborhood !== undefined || obj.bairro !== undefined) {
      patch.neighborhood = obj.neighborhood ?? obj.bairro;
    }

    if (obj.type !== undefined) patch.type = obj.type;
    if (obj.status !== undefined) patch.status = obj.status;
    if (obj.price !== undefined) patch.price = obj.price;
    if (obj.bedrooms !== undefined) patch.bedrooms = obj.bedrooms;
    if (obj.suites !== undefined) patch.suites = obj.suites;
    if (obj.parking_spots !== undefined) patch.parking_spots = obj.parking_spots;
    if (obj.bathrooms !== undefined) patch.bathrooms = obj.bathrooms;
    if (obj.area_m2 !== undefined) patch.area_m2 = obj.area_m2;

    if (obj.cover_image !== undefined || obj.hero_image_url !== undefined) {
      patch.cover_image = obj.cover_image ?? obj.hero_image_url;
    }

    if (obj.gallery !== undefined || obj.gallery_urls !== undefined) {
      patch.gallery = obj.gallery ?? obj.gallery_urls;
    }

    if (obj.is_featured !== undefined || obj.destaque !== undefined) {
      patch.is_featured = obj.is_featured ?? obj.destaque;
    }

    return patch;
  });

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

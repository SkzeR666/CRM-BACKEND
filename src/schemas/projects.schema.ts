import { z } from "zod";

const optText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

const optUrl = optText.refine((v) => v === undefined || /^https?:\/\//i.test(v), {
  message: "URL inválida",
});

const optStringArray = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    if (Array.isArray(v)) return v.filter(Boolean);
    return v.split(",").map((s) => s.trim()).filter(Boolean);
  });

export const CreateProjectSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  nome: z.string().min(2),

  cidade: optText,
  bairro: optText,
  descricao: optText,

  faixa_preco: optText,

  // ✅ booleans
  mcmv: z.coerce.boolean().optional(),
  mrv: z.coerce.boolean().optional(),
  destaque: z.coerce.boolean().optional(),

  hero_image_url: optUrl,
  gallery_urls: optStringArray,
  plantas_urls: optStringArray,

  brochure_url: optUrl,
  maps_url: optUrl,
  model_3d_url: optUrl,
});

export const UpdateProjectSchema = CreateProjectSchema.partial()
  // ✅ por enquanto, NÃO strict pra não te travar em dev
  .passthrough()
  .transform((obj) => {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) clean[k] = v;
    }
    return clean;
  });

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
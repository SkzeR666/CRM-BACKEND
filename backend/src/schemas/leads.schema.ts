import { z } from "zod";

const optText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

const optUuid = z.string().uuid("Invalid UUID").optional();

const optDate = z
  .union([z.string(), z.date()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    const d = v instanceof Date ? v : new Date(v);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString().slice(0, 10);
  });

export const CreateLeadSchema = z.object({
  nome: z.string().min(2, "Name is too short"),
  telefone: z.string().min(8, "Phone is too short"),

  email: optText.refine((v) => v === undefined || /^\S+@\S+\.\S+$/.test(v), {
    message: "Invalid email",
  }),

  cidade: optText,
  renda: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      const n = typeof v === "string" ? Number(v.replace(",", ".")) : v;
      return Number.isFinite(n) ? n : undefined;
    }),

  interesse_project_id: optUuid,
  project_id: optUuid,

  origem: optText,

  utm_source: optText,
  utm_medium: optText,
  utm_campaign: optText,
  utm_content: optText,
  utm_term: optText,
});

export const UpdateLeadSchema = z
  .object({
    nome: z.string().min(2).optional(),
    telefone: z.string().min(8).optional(),

    email: optText.refine((v) => v === undefined || /^\S+@\S+\.\S+$/.test(v), {
      message: "Invalid email",
    }),

    cidade: optText,
    renda: z
      .union([z.number(), z.string()])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        const n = typeof v === "string" ? Number(v.replace(",", ".")) : v;
        return Number.isFinite(n) ? n : undefined;
      }),

    interesse_project_id: optUuid,
    project_id: optUuid,

    origem: optText,
    status: optText,
    proximo_passo: optText,
    proximo_passo_em: optDate,

    utm_source: optText,
    utm_medium: optText,
    utm_campaign: optText,
    utm_content: optText,
    utm_term: optText,
  })
  .strict()
  .transform((obj) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) clean[k] = v;
    }
    return clean;
  });

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;

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

const optIncome = z
  .union([z.number(), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    const n = typeof v === "string" ? Number(v.replace(",", ".")) : v;
    return Number.isFinite(n) ? n : undefined;
  });

export const CreateLeadSchema = z
  .object({
    name: z.string().min(2, "Name is too short").optional(),
    nome: z.string().min(2, "Name is too short").optional(),

    phone: z.string().min(8, "Phone is too short").optional(),
    telefone: z.string().min(8, "Phone is too short").optional(),

    email: optText.refine((v) => v === undefined || /^\S+@\S+\.\S+$/.test(v), {
      message: "Invalid email",
    }),

    city: optText,
    cidade: optText,

    income: optIncome,
    renda: optIncome,

    interested_project_id: optUuid,
    interesse_project_id: optUuid,
    project_id: optUuid,

    source: optText,
    origem: optText,
    subject: optText,
    assunto: optText,
    message: optText,
    mensagem: optText,

    status: optText,
    next_step: optText,
    proximo_passo: optText,
    next_step_at: optDate,
    proximo_passo_em: optDate,

    utm_source: optText,
    utm_medium: optText,
    utm_campaign: optText,
    utm_content: optText,
    utm_term: optText,
  })
  .strict()
  .transform((obj) => {
    const name = obj.name ?? obj.nome;
    const phone = obj.phone ?? obj.telefone;

    if (!name) throw new Error("Name is required.");
    if (!phone) throw new Error("Phone is required.");

    return {
      name,
      phone,
      email: obj.email,
      city: obj.city ?? obj.cidade,
      income: obj.income ?? obj.renda,
      interested_project_id:
        obj.interested_project_id ?? obj.interesse_project_id ?? obj.project_id,
    source: obj.source ?? obj.origem,
    subject: obj.subject ?? obj.assunto,
    message: obj.message ?? obj.mensagem,
    status: obj.status,
      next_step: obj.next_step ?? obj.proximo_passo,
      next_step_at: obj.next_step_at ?? obj.proximo_passo_em,
      utm_source: obj.utm_source,
      utm_medium: obj.utm_medium,
      utm_campaign: obj.utm_campaign,
      utm_content: obj.utm_content,
      utm_term: obj.utm_term,
    };
  });

export const UpdateLeadSchema = z
  .object({
    name: z.string().min(2).optional(),
    nome: z.string().min(2).optional(),

    phone: z.string().min(8).optional(),
    telefone: z.string().min(8).optional(),

    email: optText.refine((v) => v === undefined || /^\S+@\S+\.\S+$/.test(v), {
      message: "Invalid email",
    }),

    city: optText,
    cidade: optText,

    income: optIncome,
    renda: optIncome,

    interested_project_id: optUuid,
    interesse_project_id: optUuid,
    project_id: optUuid,

    source: optText,
    origem: optText,
    subject: optText,
    assunto: optText,
    message: optText,
    mensagem: optText,

    status: optText,
    next_step: optText,
    proximo_passo: optText,
    next_step_at: optDate,
    proximo_passo_em: optDate,

    utm_source: optText,
    utm_medium: optText,
    utm_campaign: optText,
    utm_content: optText,
    utm_term: optText,
  })
  .strict()
  .transform((obj) => {
    const patch: Record<string, unknown> = {};

    if (obj.name !== undefined || obj.nome !== undefined) {
      patch.name = obj.name ?? obj.nome;
    }

    if (obj.phone !== undefined || obj.telefone !== undefined) {
      patch.phone = obj.phone ?? obj.telefone;
    }

    if (obj.email !== undefined) patch.email = obj.email;
    if (obj.city !== undefined || obj.cidade !== undefined) {
      patch.city = obj.city ?? obj.cidade;
    }

    if (obj.income !== undefined || obj.renda !== undefined) {
      patch.income = obj.income ?? obj.renda;
    }

    if (
      obj.interested_project_id !== undefined ||
      obj.interesse_project_id !== undefined ||
      obj.project_id !== undefined
    ) {
      patch.interested_project_id =
        obj.interested_project_id ?? obj.interesse_project_id ?? obj.project_id;
    }

    if (obj.source !== undefined || obj.origem !== undefined) {
      patch.source = obj.source ?? obj.origem;
    }

    if (obj.subject !== undefined || obj.assunto !== undefined) {
      patch.subject = obj.subject ?? obj.assunto;
    }

    if (obj.message !== undefined || obj.mensagem !== undefined) {
      patch.message = obj.message ?? obj.mensagem;
    }

    if (obj.status !== undefined) patch.status = obj.status;

    if (obj.next_step !== undefined || obj.proximo_passo !== undefined) {
      patch.next_step = obj.next_step ?? obj.proximo_passo;
    }

    if (obj.next_step_at !== undefined || obj.proximo_passo_em !== undefined) {
      patch.next_step_at = obj.next_step_at ?? obj.proximo_passo_em;
    }

    if (obj.utm_source !== undefined) patch.utm_source = obj.utm_source;
    if (obj.utm_medium !== undefined) patch.utm_medium = obj.utm_medium;
    if (obj.utm_campaign !== undefined) patch.utm_campaign = obj.utm_campaign;
    if (obj.utm_content !== undefined) patch.utm_content = obj.utm_content;
    if (obj.utm_term !== undefined) patch.utm_term = obj.utm_term;

    return patch;
  });

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;

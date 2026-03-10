import { z } from "zod";

const optText = z.string().trim().transform((value) => (value === "" ? undefined : value)).optional();
const optUuid = z.string().uuid("Invalid UUID").optional();

const optDate = z.union([z.string(), z.date()]).optional().transform((value) => {
  if (value === undefined) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
});

const optIncome = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (value === undefined) return undefined;
  const number = typeof value === "string" ? Number(value.replace(",", ".")) : value;
  return Number.isFinite(number) ? number : undefined;
});

export const CreateLeadSchema = z
  .object({
    name: z.string().min(2, "Name is too short").optional(),
    nome: z.string().min(2, "Name is too short").optional(),
    phone: z.string().min(8, "Phone is too short").optional(),
    telefone: z.string().min(8, "Phone is too short").optional(),
    email: optText.refine((value) => value === undefined || /^\S+@\S+\.\S+$/.test(value), {
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
  .transform((object) => {
    const name = object.name ?? object.nome;
    const phone = object.phone ?? object.telefone;

    if (!name) throw new Error("Name is required.");
    if (!phone) throw new Error("Phone is required.");

    return {
      name,
      phone,
      email: object.email,
      city: object.city ?? object.cidade,
      income: object.income ?? object.renda,
      interested_project_id: object.interested_project_id ?? object.interesse_project_id ?? object.project_id,
      source: object.source ?? object.origem,
      subject: object.subject ?? object.assunto,
      message: object.message ?? object.mensagem,
      status: object.status,
      next_step: object.next_step ?? object.proximo_passo,
      next_step_at: object.next_step_at ?? object.proximo_passo_em,
      utm_source: object.utm_source,
      utm_medium: object.utm_medium,
      utm_campaign: object.utm_campaign,
      utm_content: object.utm_content,
      utm_term: object.utm_term,
    };
  });

export const UpdateLeadSchema = z
  .object({
    name: z.string().min(2).optional(),
    nome: z.string().min(2).optional(),
    phone: z.string().min(8).optional(),
    telefone: z.string().min(8).optional(),
    email: optText.refine((value) => value === undefined || /^\S+@\S+\.\S+$/.test(value), {
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
  .transform((object) => {
    const patch: Record<string, unknown> = {};

    if (object.name !== undefined || object.nome !== undefined) patch.name = object.name ?? object.nome;
    if (object.phone !== undefined || object.telefone !== undefined) patch.phone = object.phone ?? object.telefone;
    if (object.email !== undefined) patch.email = object.email;
    if (object.city !== undefined || object.cidade !== undefined) patch.city = object.city ?? object.cidade;
    if (object.income !== undefined || object.renda !== undefined) patch.income = object.income ?? object.renda;
    if (
      object.interested_project_id !== undefined ||
      object.interesse_project_id !== undefined ||
      object.project_id !== undefined
    ) {
      patch.interested_project_id =
        object.interested_project_id ?? object.interesse_project_id ?? object.project_id;
    }
    if (object.source !== undefined || object.origem !== undefined) patch.source = object.source ?? object.origem;
    if (object.subject !== undefined || object.assunto !== undefined) patch.subject = object.subject ?? object.assunto;
    if (object.message !== undefined || object.mensagem !== undefined) patch.message = object.message ?? object.mensagem;
    if (object.status !== undefined) patch.status = object.status;
    if (object.next_step !== undefined || object.proximo_passo !== undefined) {
      patch.next_step = object.next_step ?? object.proximo_passo;
    }
    if (object.next_step_at !== undefined || object.proximo_passo_em !== undefined) {
      patch.next_step_at = object.next_step_at ?? object.proximo_passo_em;
    }
    if (object.utm_source !== undefined) patch.utm_source = object.utm_source;
    if (object.utm_medium !== undefined) patch.utm_medium = object.utm_medium;
    if (object.utm_campaign !== undefined) patch.utm_campaign = object.utm_campaign;
    if (object.utm_content !== undefined) patch.utm_content = object.utm_content;
    if (object.utm_term !== undefined) patch.utm_term = object.utm_term;

    return patch;
  });

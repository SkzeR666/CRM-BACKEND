import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreateLeadSchema, UpdateLeadSchema } from "@/schemas/leads.schema";

export async function createLead(input: unknown) {
  const data = CreateLeadSchema.parse(input);

  const interesse_project_id = data.interesse_project_id ?? data.project_id ?? null;

  const { data: created, error } = await supabaseAdmin
    .from("leads")
    .insert({
      nome: data.nome,
      telefone: data.telefone,
      email: data.email ?? null,
      cidade: data.cidade ?? null,
      renda: data.renda ?? null,

      origem: data.origem ?? "site",
      status: "novo",

      // ✅ coluna certa no DB
      interesse_project_id,

      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return created;
}

export async function listLeads(params: {
  q?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const limit = Math.min(params.limit ?? 50, 200);
  const offset = Math.max(params.offset ?? 0, 0);

  let query = supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);

  if (params.q?.trim()) {
    const q = params.q.trim();
    query = query.or(`nome.ilike.%${q}%,telefone.ilike.%${q}%`);
  }

  const { data, error } = await query.range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateLead(id: string, input: unknown) {
  const patch = UpdateLeadSchema.parse(input) as Record<string, any>;

  // Se vier alias project_id, converte pra coluna real
  if (patch.project_id && !patch.interesse_project_id) {
    patch.interesse_project_id = patch.project_id;
  }
  delete patch.project_id;

  const { data, error } = await supabaseAdmin
    .from("leads")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLead(id: string) {
  const { error } = await supabaseAdmin.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
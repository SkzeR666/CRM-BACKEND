import "server-only";
import { assertSupabaseAdminEnv, supabaseAdmin } from "@/lib/supabase/admin";
import { CreateLeadSchema, UpdateLeadSchema } from "@/schemas/leads.schema";

export async function createLead(input: unknown) {
  assertSupabaseAdminEnv();
  const data = CreateLeadSchema.parse(input);

  const { data: created, error } = await supabaseAdmin
    .from("leads")
    .insert({
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      city: data.city ?? null,
      income: data.income ?? null,
      source: data.source ?? "site",
      status: data.status ?? "new",
      interested_project_id: data.interested_project_id ?? null,
      next_step: data.next_step ?? null,
      next_step_at: data.next_step_at ?? null,
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
  assertSupabaseAdminEnv();
  const limit = Math.min(params.limit ?? 50, 200);
  const offset = Math.max(params.offset ?? 0, 0);

  let query = supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);

  if (params.q?.trim()) {
    const q = params.q.trim();
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`);
  }

  const { data, error } = await query.range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateLead(id: string, input: unknown) {
  assertSupabaseAdminEnv();
  const patch = UpdateLeadSchema.parse(input) as Record<string, unknown>;

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
  assertSupabaseAdminEnv();
  const { error } = await supabaseAdmin.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

import "server-only";
import { assertSupabaseAdminEnv, supabaseAdmin } from "@/lib/supabase/admin";
import { CreateProjectSchema, UpdateProjectSchema } from "@/schemas/projects.schema";

export async function listProjects(params: {
  city?: string;
  status?: string;
  type?: string;
  is_featured?: string;
  limit?: number;
}) {
  assertSupabaseAdminEnv();
  const limit = Math.min(params.limit ?? 50, 200);

  let query = supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (params.city) query = query.eq("city", params.city);
  if (params.status) query = query.eq("status", params.status);
  if (params.type) query = query.eq("type", params.type);
  if (params.is_featured === "true") query = query.eq("is_featured", true);
  if (params.is_featured === "false") query = query.eq("is_featured", false);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProjectBySlug(slug: string) {
  assertSupabaseAdminEnv();
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createProject(input: unknown) {
  assertSupabaseAdminEnv();
  const data = CreateProjectSchema.parse(input);

  const { data: created, error } = await supabaseAdmin
    .from("projects")
    .insert(data)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return created;
}

export async function updateProject(id: string, input: unknown) {
  assertSupabaseAdminEnv();
  const patch = UpdateProjectSchema.parse(input);

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Project not found.");
  return data;
}

export async function deleteProject(id: string) {
  assertSupabaseAdminEnv();
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

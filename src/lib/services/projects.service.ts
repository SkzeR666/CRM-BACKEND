import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreateProjectSchema, UpdateProjectSchema } from "@/schemas/projects.schema";

export async function listProjects(params: { cidade?: string; mcmv?: string; limit?: number }) {
  const limit = Math.min(params.limit ?? 50, 200);

  let query = supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (params.cidade) query = query.eq("cidade", params.cidade);
  if (params.mcmv === "true") query = query.eq("mcmv", true);
  if (params.mcmv === "false") query = query.eq("mcmv", false);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createProject(input: unknown) {
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
  const patch = UpdateProjectSchema.parse(input);

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Projeto não encontrado.");
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
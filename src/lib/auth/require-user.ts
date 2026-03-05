import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unauthorized } from "@/lib/http/errors";

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) throw unauthorized("Precisa estar logado.");
  return { user: data.user, supabase };
}
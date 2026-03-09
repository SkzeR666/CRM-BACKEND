import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assertSupabaseAdminEnv, supabaseAdmin } from "@/lib/supabase/admin";
import { unauthorized } from "@/lib/http/errors";

function readBearerToken(req?: Request) {
  if (!req) return null;
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim() || null;
}

export async function requireUser(req?: Request) {
  const bearerToken = readBearerToken(req);

  if (bearerToken) {
    assertSupabaseAdminEnv();
    const { data, error } = await supabaseAdmin.auth.getUser(bearerToken);
    if (error || !data?.user) throw unauthorized("Precisa estar logado.");
    return { user: data.user, supabase: supabaseAdmin };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) throw unauthorized("Precisa estar logado.");
  return { user: data.user, supabase };
}

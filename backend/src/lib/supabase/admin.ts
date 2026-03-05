import "server-only";
import { createClient } from "@supabase/supabase-js";
import { HttpError } from "@/lib/http/errors";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321";
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "SUPABASE_SERVICE_ROLE_KEY_NOT_SET";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export function assertSupabaseAdminEnv() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new HttpError(
      500,
      "Missing Supabase server configuration (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
}

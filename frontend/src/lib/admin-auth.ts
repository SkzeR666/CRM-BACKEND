"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export async function getAdminAccessToken() {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

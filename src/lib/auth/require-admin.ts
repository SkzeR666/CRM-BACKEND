import "server-only";
import { unauthorized } from "@/lib/http/errors";
import { requireUser } from "@/lib/auth/require-user";

/**
 * Admin guard:
 * - Em DEV: aceita header x-admin-key = ADMIN_API_KEY
 * - Em PROD (ou quando tiver front logado): cai no Supabase session (requireUser)
 */
export async function requireAdmin(req?: Request) {
  const adminKey = process.env.ADMIN_API_KEY;

  if (adminKey && req) {
    const sent = req.headers.get("x-admin-key");
    if (sent && sent === adminKey) {
      return { user: { id: "dev-admin" } as any };
    }
  }

  // fallback: sessão supabase (quando tiver login/cookie)
  try {
    return await requireUser();
  } catch {
    throw unauthorized("Admin: envie x-admin-key (DEV) ou faça login.");
  }
}
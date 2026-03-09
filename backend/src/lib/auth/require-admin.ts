import "server-only";
import { unauthorized } from "@/lib/http/errors";
import { requireUser } from "@/lib/auth/require-user";

/**
 * Admin guard:
 * - Requires authenticated Supabase user
 */
export async function requireAdmin(req?: Request) {
  try {
    return await requireUser(req);
  } catch {
    throw unauthorized("Admin auth required.");
  }
}

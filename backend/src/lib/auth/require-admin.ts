import "server-only";
import { timingSafeEqual } from "node:crypto";
import { unauthorized } from "@/lib/http/errors";
import { requireUser } from "@/lib/auth/require-user";

/**
 * Admin guard:
 * - In non-production: allows x-admin-key = ADMIN_API_KEY
 * - Otherwise: requires Supabase authenticated user
 */
export async function requireAdmin(req?: Request) {
  const adminKey = process.env.ADMIN_API_KEY;
  const allowHeaderKey = process.env.NODE_ENV !== "production";

  if (allowHeaderKey && adminKey && req) {
    const sent = req.headers.get("x-admin-key");
    if (sent && safeEqual(sent, adminKey)) {
      return { user: { id: "dev-admin" as const } };
    }
  }

  try {
    return await requireUser();
  } catch {
    throw unauthorized("Admin auth required.");
  }
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

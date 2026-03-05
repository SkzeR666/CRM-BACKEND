import { ok, fail } from "@/lib/http/response";
import { requireUser } from "@/lib/auth/require-user";

export async function GET() {
  try {
    const { user } = await requireUser();
    return ok({ user });
  } catch (e: any) {
    return fail(e, e?.status ?? 401);
  }
}
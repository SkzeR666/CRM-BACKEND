import { requireUser } from "@/lib/auth/require-user";
import { getErrorStatus } from "@/lib/http/errors";
import { fail, ok } from "@/lib/http/response";

export async function GET() {
  try {
    const { user } = await requireUser();
    return ok({ user });
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 401));
  }
}

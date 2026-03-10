import { ok } from "@/lib/http/response";

export async function GET() {
  return ok({ ok: true });
}

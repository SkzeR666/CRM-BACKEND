import { ok, fail } from "@/lib/http/response";
import { parseBody } from "@/lib/http/parse";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createLead, listLeads } from "@/lib/services/leads.service";

export async function POST(req: Request) {
  try {
    const payload = await parseBody(req);
    const lead = await createLead(payload);
    return ok({ lead }, 201);
  } catch (e: any) {
    return fail(e, 400);
  }
}

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;

    const leads = await listLeads({ q, status, limit, offset });
    return ok({ leads });
  } catch (e: any) {
    return fail(e, e?.status ?? 401);
  }
}
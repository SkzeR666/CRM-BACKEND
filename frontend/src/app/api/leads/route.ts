import { requireAdmin } from "@/lib/auth/require-admin";
import { getErrorStatus } from "@/lib/http/errors";
import { parseBody, parsePositiveInt } from "@/lib/http/parse";
import { fail, ok } from "@/lib/http/response";
import { enforceRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { createLead, listLeads } from "@/lib/services/leads.service";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    enforceRateLimit({
      key: `leads:create:${ip}`,
      windowMs: 60_000,
      maxRequests: 10,
    });

    const payload = await parseBody(req);
    const lead = await createLead(payload);
    return ok({ lead }, 201);
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 400));
  }
}

export async function GET(req: Request) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const limit = parsePositiveInt(searchParams.get("limit"), "limit", { min: 1, max: 200 });
    const offset = parsePositiveInt(searchParams.get("offset"), "offset", { min: 0 });

    const leads = await listLeads({ q, status, limit, offset });
    return ok({ leads });
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 401));
  }
}

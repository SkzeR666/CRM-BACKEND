import { ok, fail } from "@/lib/http/response";
import { parseBody } from "@/lib/http/parse";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deleteLead, updateLead } from "@/lib/services/leads.service";

type Ctx = { params: Promise<{ id: string }> | { id: string } };

async function getId(ctx: Ctx) {
  const p = await ctx.params; // funciona se vier Promise ou objeto
  return p.id;
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const payload = await parseBody(req);

    const id = await getId(ctx);
    const lead = await updateLead(id, payload);

    return ok({ lead });
  } catch (e: any) {
    console.error("PATCH /api/leads/[id] error:", e);
    return fail(e, e?.status ?? 400);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    await requireAdmin(req);

    const id = await getId(ctx);
    const res = await deleteLead(id);

    return ok(res);
  } catch (e: any) {
    console.error("DELETE /api/leads/[id] error:", e);
    return fail(e, e?.status ?? 400);
  }
}
import { ok, fail } from "@/lib/http/response";
import { parseBody } from "@/lib/http/parse";
import { requireAdmin } from "@/lib/auth/require-admin";
import { deleteProject, updateProject } from "@/lib/services/projects.service";

type Ctx = { params: Promise<{ id: string }> | { id: string } };

async function getId(ctx: Ctx) {
  const p = await ctx.params;
  return p.id;
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const payload = await parseBody(req);

    const id = await getId(ctx);
    const project = await updateProject(id, payload);

    return ok({ project });
  } catch (e: any) {
    console.error("PATCH /api/projects/[id] error:", e);
    return fail(e, e?.status ?? 400);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    await requireAdmin(req);

    const id = await getId(ctx);
    const res = await deleteProject(id);

    return ok(res);
  } catch (e: any) {
    console.error("DELETE /api/projects/[id] error:", e);
    return fail(e, e?.status ?? 400);
  }
}
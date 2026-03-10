import { requireAdmin } from "@/lib/auth/require-admin";
import { getErrorStatus, notFound } from "@/lib/http/errors";
import { parseBody, parseUuid } from "@/lib/http/parse";
import { fail, ok } from "@/lib/http/response";
import { deleteProject, getProjectById, updateProject } from "@/lib/services/projects.service";

type Ctx = { params: Promise<{ id: string }> | { id: string } };

async function getId(ctx: Ctx) {
  const params = await ctx.params;
  return parseUuid(params.id, "id");
}

export async function GET(_: Request, ctx: Ctx) {
  try {
    const id = await getId(ctx);
    const project = await getProjectById(id);

    if (!project) return fail(notFound("Project not found."), 404);
    return ok({ project });
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 400));
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const payload = await parseBody(req);
    const id = await getId(ctx);
    const project = await updateProject(id, payload);
    return ok({ project });
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 400));
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    await requireAdmin(req);
    const id = await getId(ctx);
    const result = await deleteProject(id);
    return ok(result);
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 400));
  }
}

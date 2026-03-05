import { getErrorStatus, notFound } from "@/lib/http/errors";
import { fail, ok } from "@/lib/http/response";
import { getProjectBySlug } from "@/lib/services/projects.service";

type Ctx = { params: Promise<{ slug: string }> | { slug: string } };

export async function GET(_: Request, ctx: Ctx) {
  try {
    const { slug } = await ctx.params;
    const project = await getProjectBySlug(slug);

    if (!project) return fail(notFound("Project not found."), 404);
    return ok({ project });
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 400));
  }
}

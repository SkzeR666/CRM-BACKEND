import { ok, fail } from "@/lib/http/response";
import { getProjectBySlug } from "@/lib/services/projects.service";

type Ctx = { params: Promise<{ slug: string }> | { slug: string } };

export async function GET(_: Request, ctx: Ctx) {
  try {
    const { slug } = await ctx.params;
    const project = await getProjectBySlug(slug);

    if (!project) return fail(new Error("Não encontrado."), 404);
    return ok({ project });
  } catch (e: any) {
    console.error("GET /api/projects/by-slug/[slug] error:", e);
    return fail(e, e?.status ?? 400);
  }
}
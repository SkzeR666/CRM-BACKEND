import { ok, fail } from "@/lib/http/response";
import { parseBody } from "@/lib/http/parse";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createProject, listProjects } from "@/lib/services/projects.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cidade = searchParams.get("cidade") ?? undefined;
    const mcmv = searchParams.get("mcmv") ?? undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const projects = await listProjects({ cidade, mcmv, limit });
    return ok({ projects });
  } catch (e: any) {
    return fail(e, 400);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const payload = await parseBody(req);
    const project = await createProject(payload);
    return ok({ project }, 201);
  } catch (e: any) {
    return fail(e, e?.status ?? 400);
  }
}
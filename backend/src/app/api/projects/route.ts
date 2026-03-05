import { requireAdmin } from "@/lib/auth/require-admin";
import { getErrorStatus } from "@/lib/http/errors";
import { parseBody, parsePositiveInt } from "@/lib/http/parse";
import { fail, ok } from "@/lib/http/response";
import { createProject, listProjects } from "@/lib/services/projects.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cidade = searchParams.get("cidade") ?? undefined;
    const mcmv = searchParams.get("mcmv") ?? undefined;
    const limit = parsePositiveInt(searchParams.get("limit"), "limit", {
      min: 1,
      max: 200,
    });

    const projects = await listProjects({ cidade, mcmv, limit });
    return ok({ projects });
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 400));
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const payload = await parseBody(req);
    const project = await createProject(payload);
    return ok({ project }, 201);
  } catch (error: unknown) {
    return fail(error, getErrorStatus(error, 400));
  }
}

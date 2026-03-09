import { requireAdmin } from "@/lib/auth/require-admin";
import { getErrorStatus } from "@/lib/http/errors";
import { parseBody, parsePositiveInt } from "@/lib/http/parse";
import { fail, ok } from "@/lib/http/response";
import { createProject, listProjects } from "@/lib/services/projects.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city =
      searchParams.get("city") ?? searchParams.get("cidade") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const type = searchParams.get("type") ?? undefined;
    const bedrooms = parsePositiveInt(searchParams.get("bedrooms"), "bedrooms");
    const suites = parsePositiveInt(searchParams.get("suites"), "suites");
    const parking_spots = parsePositiveInt(searchParams.get("parking_spots"), "parking_spots");
    const min_price = parsePositiveInt(searchParams.get("min_price"), "min_price");
    const max_price = parsePositiveInt(searchParams.get("max_price"), "max_price");
    const is_featured =
      searchParams.get("is_featured") ??
      searchParams.get("featured") ??
      searchParams.get("mcmv") ??
      undefined;

    const limit = parsePositiveInt(searchParams.get("limit"), "limit", {
      min: 1,
      max: 200,
    });

    const projects = await listProjects({
      city,
      status,
      type,
      bedrooms,
      suites,
      parking_spots,
      min_price,
      max_price,
      is_featured,
      limit,
    });

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

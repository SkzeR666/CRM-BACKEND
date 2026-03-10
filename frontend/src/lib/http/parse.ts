import { badRequest } from "@/lib/http/errors";

export async function parseBody(req: Request) {
  const contentType = (req.headers.get("content-type") || "").toLowerCase();

  if (contentType.includes("application/json")) {
    return await req.json();
  }

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const form = await req.formData();
    const object: Record<string, FormDataEntryValue> = {};

    for (const [key, value] of form.entries()) {
      object[key] = value;
    }

    return object;
  }

  try {
    return await req.json();
  } catch {
    return {};
  }
}

export function parsePositiveInt(
  raw: string | null,
  fieldName: string,
  options: { min?: number; max?: number } = {},
) {
  if (raw === null || raw.trim() === "") return undefined;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    throw badRequest(`${fieldName} must be an integer.`);
  }

  const min = options.min ?? 0;
  if (parsed < min) {
    throw badRequest(`${fieldName} must be >= ${min}.`);
  }

  if (options.max !== undefined && parsed > options.max) {
    throw badRequest(`${fieldName} must be <= ${options.max}.`);
  }

  return parsed;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseUuid(raw: string, fieldName: string) {
  if (!UUID_RE.test(raw)) {
    throw badRequest(`${fieldName} must be a valid UUID.`);
  }

  return raw;
}

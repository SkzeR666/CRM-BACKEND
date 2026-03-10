import { NextResponse } from "next/server";
import { getErrorStatus } from "@/lib/http/errors";

type JsonObject = Record<string, unknown>;
type ZodLikeError = { issues: unknown[] };

function isZodLikeError(error: unknown): error is ZodLikeError {
  return (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown }).issues)
  );
}

export function ok(data: JsonObject, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function fail(error: unknown, fallbackStatus = 400) {
  const status = getErrorStatus(error, fallbackStatus);

  if (isZodLikeError(error)) {
    return NextResponse.json({ ok: false, error: { type: "zod", issues: error.issues } }, { status });
  }

  const message =
    status >= 500
      ? "Internal Server Error"
      : error instanceof Error
        ? error.message
        : String(error);

  return NextResponse.json({ ok: false, error: { message } }, { status });
}

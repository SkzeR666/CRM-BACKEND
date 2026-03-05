import { NextResponse } from "next/server";

export function ok(data: any, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function fail(e: any, status = 400) {
  // Zod error
  if (e?.issues) {
    return NextResponse.json(
      { ok: false, error: { type: "zod", issues: e.issues } },
      { status }
    );
  }

  // generic
  return NextResponse.json(
    { ok: false, error: { message: e?.message ?? String(e) } },
    { status }
  );
}
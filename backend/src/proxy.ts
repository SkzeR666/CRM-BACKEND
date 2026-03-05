import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_ALLOWED_ORIGIN = "http://localhost:3000";

function applyCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization,x-admin-key");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Vary", "Origin");
  return response;
}

export function proxy(req: NextRequest) {
  const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? DEFAULT_ALLOWED_ORIGIN)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const fallbackOrigin = allowedOrigins[0] ?? DEFAULT_ALLOWED_ORIGIN;
  const requestOrigin = req.headers.get("origin");
  const origin =
    requestOrigin && allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : fallbackOrigin;

  if (req.method === "OPTIONS") {
    return applyCorsHeaders(new NextResponse(null, { status: 204 }), origin);
  }

  return applyCorsHeaders(NextResponse.next(), origin);
}

export const config = {
  matcher: ["/api/:path*"],
};

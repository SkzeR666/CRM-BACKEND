import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSessionValue } from "@/lib/admin-session";

export async function POST(request) {
  try {
    const body = await request.json();
    const password = String(body.password ?? "");
    const expectedPassword = process.env.ADMIN_LOGIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: "Missing ADMIN_LOGIN_PASSWORD" },
        { status: 500 }
      );
    }

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Senha inválida" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: createAdminSessionValue(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
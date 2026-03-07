import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  isValidAdminSession,
} from "@/lib/admin-session";

function getSupabase() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

async function isAdmin() {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return isValidAdminSession(sessionValue);
}

export async function PATCH(request, context) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const { id } = await context.params;
    const body = await request.json();

    const payload = {
      title: body.title,
      slug: body.slug,
      description: body.description,
      city: body.city,
      state: body.state,
      neighborhood: body.neighborhood,
      type: body.type,
      price: body.price ? Number(body.price) : null,
      bedrooms: Number(body.bedrooms ?? 0),
      suites: Number(body.suites ?? 0),
      parking_spots: Number(body.parking_spots ?? 0),
      bathrooms: Number(body.bathrooms ?? 0),
      area_m2: body.area_m2 ? Number(body.area_m2) : null,
      cover_image: body.cover_image,
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      is_featured: Boolean(body.is_featured),
      status: body.status,
    };

    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
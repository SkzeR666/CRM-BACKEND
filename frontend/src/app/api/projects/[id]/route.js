import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminApiKey = process.env.ADMIN_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

function isAdmin(request) {
  return request.headers.get("x-admin-key") === adminApiKey;
}

export async function PATCH(request, context) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
      {
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}
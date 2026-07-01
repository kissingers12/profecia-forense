import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const auth = req.headers.get("x-admin-password") ?? "";
  return auth === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name, plan, activated, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: "Error al obtener usuarios.", detail: error.message }, { status: 500 });
  }

  return Response.json({ users });
}

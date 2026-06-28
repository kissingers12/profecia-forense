import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const auth = req.headers.get("x-admin-password") ?? "";
  return auth === adminPassword;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { email, activated } = await req.json();

  if (!email) {
    return Response.json({ error: "Email requerido." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update({ activated: activated ?? true })
    .eq("email", email.toLowerCase());

  if (error) {
    return Response.json({ error: "Error al actualizar usuario." }, { status: 500 });
  }

  return Response.json({ ok: true });
}

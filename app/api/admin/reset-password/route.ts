import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";

function checkAuth(req: NextRequest): boolean {
  return checkAdmin(req);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { email, newPassword } = await req.json();
  if (!email || !newPassword) return Response.json({ error: "Datos incompletos." }, { status: 400 });
  if (newPassword.length < 6) return Response.json({ error: "Mínimo 6 caracteres." }, { status: 400 });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabaseAdmin
    .from("users")
    .update({ password_hash: passwordHash, reset_token: null, reset_expires: null })
    .eq("email", email.toLowerCase());

  if (error) return Response.json({ error: "Error al actualizar." }, { status: 500 });
  return Response.json({ ok: true });
}

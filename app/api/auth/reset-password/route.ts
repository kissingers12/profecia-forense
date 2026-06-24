import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json();
  if (!email || !code || !newPassword) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, reset_token, reset_expires")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user || user.reset_token !== code) {
    return Response.json({ error: "Código incorrecto." }, { status: 400 });
  }

  if (!user.reset_expires || new Date(user.reset_expires) < new Date()) {
    return Response.json({ error: "El código expiró. Solicita uno nuevo." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await supabaseAdmin
    .from("users")
    .update({ password_hash: passwordHash, reset_token: null, reset_expires: null })
    .eq("id", user.id);

  return Response.json({ success: true });
}

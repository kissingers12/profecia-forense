import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { allow, reset as resetLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json();
  if (!email || !code || !newPassword) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }

  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return Response.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
  }

  // El código es de 6 dígitos: sin este freno se podría adivinar probando
  // combinaciones hasta robar la cuenta.
  const cuenta = String(email).toLowerCase();
  if (!allow("reset-cuenta", cuenta, 5, 15 * 60_000) || !allow("reset-ip", clientIp(req), 20, 15 * 60_000)) {
    return Response.json(
      { error: "Demasiados intentos. Solicita un código nuevo en 15 minutos." },
      { status: 429 }
    );
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, reset_token, reset_expires")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user || !user.reset_token || user.reset_token !== code) {
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

  resetLimit("reset-cuenta", cuenta);

  return Response.json({ success: true });
}

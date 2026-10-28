import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { allow, clientIp } from "@/lib/rate-limit";
import { hashToken } from "@/lib/invitacion";

const ENLACE_INVALIDO =
  "Este enlace de invitación no es válido, ya se usó o no corresponde a ese correo. Si ya creaste tu contraseña, inicia sesión normalmente.";

export async function POST(req: NextRequest) {
  const { token, email: rawEmail, password } = await req.json().catch(() => ({}));

  if (!allow("invitacion-ip", clientIp(req), 15, 60 * 60_000)) {
    return Response.json({ error: "Demasiados intentos. Espera un rato e inténtalo de nuevo." }, { status: 429 });
  }

  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (typeof token !== "string" || !token || !email) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return Response.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
  }

  const { data: invitacion } = await supabaseAdmin
    .from("activity_logs")
    .select("id")
    .eq("user_name", "INVITACION")
    .eq("user_email", email)
    .eq("action", hashToken(token))
    .maybeSingle();

  if (!invitacion) return Response.json({ error: ENLACE_INVALIDO }, { status: 400 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, email, name, plan, activated")
    .eq("email", email)
    .maybeSingle();

  if (!user) return Response.json({ error: ENLACE_INVALIDO }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const { error } = await supabaseAdmin.from("users").update({ password_hash: passwordHash }).eq("id", user.id);
  if (error) return Response.json({ error: "No se pudo guardar la contraseña." }, { status: 500 });

  // El enlace queda gastado: no se puede volver a usar para cambiar la contraseña
  await supabaseAdmin
    .from("activity_logs")
    .update({ action: `usada:${hashToken(token)}` })
    .eq("id", invitacion.id);

  return Response.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan, activated: user.activated },
  });
}

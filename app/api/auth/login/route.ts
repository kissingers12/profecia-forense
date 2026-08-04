import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { allow, reset, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }

  // Freno anti fuerza bruta: por cuenta y por dispositivo
  const ip = clientIp(req);
  const cuenta = String(email).toLowerCase();
  if (!allow("login-cuenta", cuenta, 10, 15 * 60_000) || !allow("login-ip", ip, 40, 15 * 60_000)) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo." },
      { status: 429 }
    );
  }

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name, plan, activated, password_hash")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error || !user) {
    return Response.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return Response.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  }

  // Entró bien: se limpia el contador de intentos de esa cuenta
  reset("login-cuenta", cuenta);

  // Log login or course access depending on activation status
  supabaseAdmin.from("activity_logs").insert({
    user_email: user.email,
    user_name: user.name,
    action: user.activated ? "course_access" : "login",
  }).then(() => {});

  return Response.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      activated: user.activated,
    },
  });
}

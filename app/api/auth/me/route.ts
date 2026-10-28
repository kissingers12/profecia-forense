import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { allow, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return Response.json({ error: "No autenticado." }, { status: 401 });

  // Freno para que nadie pueda ir probando correos en masa para averiguar
  // quién está registrado y en qué plan
  if (!allow("me-ip", clientIp(req), 60, 10 * 60_000)) {
    return Response.json({ error: "Demasiadas peticiones." }, { status: 429 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("plan, activated")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) return Response.json({ error: "Usuario no encontrado." }, { status: 404 });

  // Registro de visitas al panel para la pestaña Progreso del admin (máx. una cada 30 min)
  if (user.activated) {
    const cuenta = email.toLowerCase();
    const desde = new Date(Date.now() - 30 * 60_000).toISOString();
    const { data: reciente } = await supabaseAdmin
      .from("activity_logs")
      .select("id")
      .eq("user_name", "VISITA")
      .eq("user_email", cuenta)
      .gte("created_at", desde)
      .limit(1);
    if (!reciente?.length) {
      await supabaseAdmin.from("activity_logs").insert({ user_email: cuenta, user_name: "VISITA", action: "panel" });
    }
  }

  // Solo se devuelve lo imprescindible para refrescar la sesión
  return Response.json({ user: { plan: user.plan, activated: user.activated } });
}

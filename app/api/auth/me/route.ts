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

  // Solo se devuelve lo imprescindible para refrescar la sesión
  return Response.json({ user: { plan: user.plan, activated: user.activated } });
}

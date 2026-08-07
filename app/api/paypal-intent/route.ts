import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * Deja constancia de que alguien pulsó "ir a pagar con PayPal".
 *
 * Ese pago no genera ningún aviso automático (a diferencia de las
 * criptomonedas), así que sin esto no habría forma de saber quién se fue a
 * pagar por PayPal y hay que esperar su comprobante.
 */
export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({ email: null }));
  if (!email || typeof email !== "string") {
    return Response.json({ ok: false }, { status: 400 });
  }

  const cuenta = email.toLowerCase();

  // Un par de registros por persona bastan; evita llenar el historial
  if (!allow("paypal-cuenta", cuenta, 5, 24 * 60 * 60_000) || !allow("paypal-ip", clientIp(req), 20, 60 * 60_000)) {
    return Response.json({ ok: true, omitido: true });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("email, activated")
    .eq("email", cuenta)
    .maybeSingle();

  if (!user || user.activated) return Response.json({ ok: true, omitido: true });

  await supabaseAdmin.from("activity_logs").insert({
    user_email: user.email,
    user_name: "PAYPAL",
    action: "intento",
  });

  return Response.json({ ok: true });
}

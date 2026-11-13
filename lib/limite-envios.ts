import { supabaseAdmin } from "./supabase";

// Envíos de formularios guardados en activity_logs: a diferencia de lib/rate-limit
// (en memoria), sobreviven a los reinicios de Vercel y permiten ventanas de días.
export type TipoEnvio = "FORM_ORACION" | "FORM_OTRO" | "FORM_CONTACTO" | "FORM_SOPORTE";

export const DIA = 24 * 60 * 60_000;

export async function enviosRecientes(tipo: TipoEnvio | TipoEnvio[], email: string, ventanaMs: number): Promise<number> {
  const desde = new Date(Date.now() - ventanaMs).toISOString();
  const { count } = await supabaseAdmin
    .from("activity_logs")
    .select("id", { count: "exact", head: true })
    .in("user_name", Array.isArray(tipo) ? tipo : [tipo])
    .eq("user_email", email.trim().toLowerCase())
    .gte("created_at", desde);
  return count ?? 0;
}

export async function registrarEnvio(tipo: TipoEnvio, email: string, detalle: string) {
  await supabaseAdmin.from("activity_logs").insert({
    user_email: email.trim().toLowerCase(),
    user_name: tipo,
    action: detalle.slice(0, 200),
  });
}

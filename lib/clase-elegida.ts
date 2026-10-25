import { supabaseAdmin } from "./supabase";

// Última clase elegida por cada correo: al registrarse/comprar (CLASE_ELEGIDA)
// o en el aviso de pago de NOWPayments (order_id "email:clase:videoId").
export async function clasesElegidas(): Promise<Map<string, number>> {
  const { data } = await supabaseAdmin
    .from("activity_logs")
    .select("user_email, user_name, action, created_at")
    .or("user_name.eq.CLASE_ELEGIDA,and(user_name.eq.PAGO,user_email.like.*:clase:*)")
    .order("created_at", { ascending: false })
    .limit(2000);

  const map = new Map<string, number>();
  for (const l of data ?? []) {
    const raw = (l.user_email ?? "").toLowerCase();
    let email = raw;
    let id = NaN;
    if (l.user_name === "CLASE_ELEGIDA") {
      id = parseInt(l.action ?? "", 10);
    } else {
      const [e, v] = raw.split(":clase:");
      email = e;
      id = parseInt(v ?? "", 10);
    }
    if (!isNaN(id) && !map.has(email)) map.set(email, id);
  }
  return map;
}

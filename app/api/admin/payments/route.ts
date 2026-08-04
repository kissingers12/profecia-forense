import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";

function checkAuth(req: NextRequest): boolean {
  return checkAdmin(req);
}

type PaymentRow = {
  id: number;
  email: string;
  fecha: string;
  status: string;
  precio: number;          // USD que debía pagar
  pagado: number;          // cripto que envió
  requerido: number;       // cripto que se le pidió
  moneda: string;          // moneda enviada (btc, usdt…)
  recibido: number;        // lo que llegó a la cartera
  monedaRecibida: string;  // moneda en que llegó
  paymentId: string;
  nombre: string | null;
  plan: string | null;
  activado: boolean | null;
  avisoEnviado: string | null;      // fecha del correo "no completaste el pago"
  bienvenidaEnviada: string | null; // fecha del correo de bienvenida
};

// Avisos de pago recibidos de NOWPayments, cruzados con los datos del cliente.
// Permite ver quién pagó, su correo y cuánto, sin entrar en NOWPayments.
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { data: logs, error } = await supabaseAdmin
    .from("activity_logs")
    .select("id, user_email, action, created_at")
    .eq("user_name", "PAGO")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return Response.json({ error: "Error al cargar los pagos." }, { status: 500 });

  const emails = [...new Set((logs ?? []).map((l) => l.user_email.toLowerCase()))];
  const { data: users } = emails.length
    ? await supabaseAdmin.from("users").select("email, name, plan, activated").in("email", emails)
    : { data: [] };

  const byEmail = new Map((users ?? []).map((u) => [u.email.toLowerCase(), u]));

  // Correos ya enviados a estas personas, para no repetirlos
  const { data: correos } = emails.length
    ? await supabaseAdmin
        .from("activity_logs")
        .select("user_email, action, created_at")
        .eq("user_name", "CORREO")
        .in("user_email", emails)
        .order("created_at", { ascending: false })
    : { data: [] };

  const avisos = new Map<string, string>();
  const bienvenidas = new Map<string, string>();
  for (const c of correos ?? []) {
    const key = c.user_email.toLowerCase();
    if (c.action === "aviso-pago" && !avisos.has(key)) avisos.set(key, c.created_at);
    if (c.action === "bienvenida" && !bienvenidas.has(key)) bienvenidas.set(key, c.created_at);
  }

  const payments: PaymentRow[] = (logs ?? []).map((l) => {
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(l.action);
    } catch {
      // registro antiguo o texto suelto — se muestra igualmente
    }
    const u = byEmail.get(l.user_email.toLowerCase());
    return {
      id: l.id,
      email: l.user_email,
      fecha: l.created_at,
      status: String(parsed.status ?? "desconocido"),
      precio: Number(parsed.precio ?? 0),
      pagado: Number(parsed.pagado ?? 0),
      requerido: Number(parsed.requerido ?? 0),
      moneda: String(parsed.moneda ?? ""),
      recibido: Number(parsed.recibido ?? 0),
      monedaRecibida: String(parsed.monedaRecibida ?? ""),
      paymentId: String(parsed.paymentId ?? ""),
      nombre: u?.name ?? null,
      plan: u?.plan ?? null,
      activado: u?.activated ?? null,
      avisoEnviado: avisos.get(l.user_email.toLowerCase()) ?? null,
      bienvenidaEnviada: bienvenidas.get(l.user_email.toLowerCase()) ?? null,
    };
  });

  return Response.json({ payments });
}

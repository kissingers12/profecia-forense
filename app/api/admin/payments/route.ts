import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";
import { clasesElegidas } from "@/lib/clase-elegida";

function checkAuth(req: NextRequest): boolean {
  return checkAdmin(req);
}

type PaymentRow = {
  id: number;
  email: string;
  fecha: string;
  status: string;
  tipo: "cripto" | "paypal";
  precio: number;
  pagado: number;
  requerido: number;
  moneda: string;
  recibido: number;
  monedaRecibida: string;
  paymentId: string;
  nombre: string | null;
  plan: string | null;
  activado: boolean | null;
  avisoEnviado: string | null;
  bienvenidaEnviada: string | null;
  claseId: number | null;  // para pagos de clase_individual
};

// Avisos de pago recibidos de NOWPayments, cruzados con los datos del cliente.
// Permite ver quién pagó, su correo y cuánto, sin entrar en NOWPayments.
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { data: logs, error } = await supabaseAdmin
    .from("activity_logs")
    .select("id, user_email, user_name, action, created_at")
    .in("user_name", ["PAGO", "PAYPAL"])
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return Response.json({ error: "Error al cargar los pagos." }, { status: 500 });

  // Para clase_individual, user_email es "email:clase:videoId" — extraer email real
  const parseOrderEmail = (raw: string): { email: string; claseId: number | null } => {
    const lower = raw.toLowerCase();
    if (lower.includes(":clase:")) {
      const [emailPart, idPart] = lower.split(":clase:");
      const claseId = parseInt(idPart ?? "");
      return { email: emailPart, claseId: isNaN(claseId) ? null : claseId };
    }
    return { email: lower, claseId: null };
  };

  const emails = [...new Set((logs ?? []).map((l) => parseOrderEmail(l.user_email).email))];
  const { data: users } = emails.length
    ? await supabaseAdmin.from("users").select("email, name, plan, activated").in("email", emails)
    : { data: [] };

  const byEmail = new Map((users ?? []).map((u) => [u.email.toLowerCase(), u]));

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
    if ((c.action === "bienvenida" || c.action === "bienvenida_clase") && !bienvenidas.has(key))
      bienvenidas.set(key, c.created_at);
  }

  const elegidas = await clasesElegidas();

  const payments: PaymentRow[] = (logs ?? []).map((l) => {
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(l.action);
    } catch {
      // registro antiguo o texto suelto
    }
    const { email: realEmail, claseId } = parseOrderEmail(l.user_email);
    const u = byEmail.get(realEmail);
    const esPayPal = l.user_name === "PAYPAL";
    return {
      tipo: (esPayPal ? "paypal" : "cripto") as "cripto" | "paypal",
      id: l.id,
      email: realEmail,
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
      avisoEnviado: avisos.get(realEmail) ?? null,
      bienvenidaEnviada: bienvenidas.get(realEmail) ?? null,
      claseId: claseId ?? (u?.plan === "clase_individual" ? elegidas.get(realEmail) ?? null : null),
    };
  });

  return Response.json({ payments });
}

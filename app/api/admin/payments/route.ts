import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest): boolean {
  return (req.headers.get("x-admin-password") ?? "") === process.env.ADMIN_PASSWORD;
}

type PaymentRow = {
  id: number;
  email: string;
  fecha: string;
  status: string;
  precio: number;
  pagado: number;
  moneda: string;
  recibido: number;
  paymentId: string;
  nombre: string | null;
  plan: string | null;
  activado: boolean | null;
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
      moneda: String(parsed.moneda ?? ""),
      recibido: Number(parsed.recibido ?? 0),
      paymentId: String(parsed.paymentId ?? ""),
      nombre: u?.name ?? null,
      plan: u?.plan ?? null,
      activado: u?.activated ?? null,
    };
  });

  return Response.json({ payments });
}

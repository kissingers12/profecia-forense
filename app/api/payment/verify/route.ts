import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) return Response.json({ error: "Sin configuración." }, { status: 500 });

  // Check if already activated in Supabase
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("activated, plan")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) return Response.json({ error: "Cuenta no encontrada." }, { status: 404 });
  if (user.activated) return Response.json({ activated: true });

  // Query NOWPayments for payments with this email as order_id
  try {
    const res = await fetch(
      `https://api.nowpayments.io/v1/payment/?order_id=${encodeURIComponent(email.toLowerCase())}&limit=10`,
      { headers: { "x-api-key": apiKey } }
    );
    const data = await res.json();
    const payments = data.data ?? [];
    const confirmed = payments.find((p: Record<string, unknown>) =>
      p.payment_status === "finished" || p.payment_status === "confirmed"
    );

    if (confirmed) {
      await supabaseAdmin
        .from("users")
        .update({ activated: true })
        .eq("email", email.toLowerCase());
      return Response.json({ activated: true });
    }

    return Response.json({ activated: false, message: "No encontramos un pago confirmado para esta cuenta." });
  } catch {
    return Response.json({ error: "Error al consultar pagos." }, { status: 500 });
  }
}

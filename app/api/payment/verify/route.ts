import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PARTIAL_TOLERANCE = 0.02; // accept if paid ≥ 98% of required

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) return Response.json({ error: "Sin configuración." }, { status: 500 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("activated, plan")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) return Response.json({ error: "Cuenta no encontrada." }, { status: 404 });
  if (user.activated) return Response.json({ activated: true });

  try {
    // Query payments by order_id (email)
    const res = await fetch(
      `https://api.nowpayments.io/v1/payment?order_id=${encodeURIComponent(email.toLowerCase())}&limit=20`,
      { headers: { "x-api-key": apiKey } }
    );

    if (!res.ok) {
      console.error("[verify] NOWPayments API error:", res.status);
      return Response.json({ error: "Error al consultar pagos." }, { status: 500 });
    }

    const data = await res.json();
    const payments: Record<string, unknown>[] = data.data ?? [];

    const confirmed = payments.find((p) => {
      const status = p.payment_status as string;
      const priceAmount = Number(p.price_amount ?? 0);
      const actuallyPaid = Number(p.actually_paid ?? 0);

      if (status === "finished" || status === "confirmed") return true;

      // Accept partially_paid if within tolerance
      if (status === "partially_paid" && actuallyPaid > 0 && priceAmount > 0) {
        return actuallyPaid >= priceAmount * (1 - PARTIAL_TOLERANCE);
      }

      return false;
    });

    if (confirmed) {
      await supabaseAdmin
        .from("users")
        .update({ activated: true })
        .eq("email", email.toLowerCase());
      return Response.json({ activated: true });
    }

    return Response.json({
      activated: false,
      message: "No encontramos un pago confirmado. Si acabas de pagar, espera 5 minutos e intenta de nuevo.",
    });
  } catch (err) {
    console.error("[verify] Error:", err);
    return Response.json({ error: "Error al consultar pagos." }, { status: 500 });
  }
}

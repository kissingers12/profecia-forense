import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const FIAT_TOLERANCE = 20;    // accept if within $20 of required price
const CRYPTO_TOLERANCE = 0.026; // 2.6% for crypto-to-crypto comparison

// La lista de pagos de NOWPayments exige un token JWT obtenido con el
// email/contraseña de la cuenta (env NOWPAYMENTS_EMAIL / NOWPAYMENTS_PASSWORD)
async function getJwtToken(): Promise<string | null> {
  const npEmail = process.env.NOWPAYMENTS_EMAIL;
  const npPassword = process.env.NOWPAYMENTS_PASSWORD;
  if (!npEmail || !npPassword) return null;
  try {
    const res = await fetch("https://api.nowpayments.io/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: npEmail, password: npPassword }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token ?? null;
  } catch {
    return null;
  }
}

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

  const PLAN_PRICES: Record<string, number> = { escuela: 777, clases: 555, meditaciones: 333 };

  try {
    const token = await getJwtToken();
    if (!token) {
      // Sin credenciales de cuenta no podemos listar pagos; el webhook activa solo
      return Response.json({
        activated: false,
        message:
          "Tu pago se activa automáticamente al confirmarse en la red (suele tardar 10-30 minutos). Si ya pasó más tiempo, usa el botón de ayuda y te activamos manualmente.",
      });
    }

    // Query payments by order_id (email)
    const res = await fetch(
      `https://api.nowpayments.io/v1/payment?order_id=${encodeURIComponent(email.toLowerCase())}&limit=20`,
      { headers: { "x-api-key": apiKey, Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      console.error("[verify] NOWPayments API error:", res.status);
      return Response.json({ error: "Error al consultar pagos." }, { status: 500 });
    }

    const data = await res.json();
    const payments: Record<string, unknown>[] = data.data ?? [];

    const expectedPrice = user.plan ? (PLAN_PRICES[user.plan] ?? 0) : 0;

    const confirmed = payments.find((p) => {
      const status = p.payment_status as string;
      const priceAmount = Number(p.price_amount ?? 0);    // USD requested
      const actuallyPaid = Number(p.actually_paid ?? 0);  // crypto paid
      const payAmount = Number(p.pay_amount ?? 0);        // crypto required
      const outcomeAmount = Number(p.outcome_amount ?? 0); // fiat/USDC received

      // Verify this payment was for the correct plan (price_amount set by our system)
      if (expectedPrice > 0 && priceAmount < expectedPrice - FIAT_TOLERANCE) return false;

      if (status === "finished" || status === "confirmed") return true;

      // Accept partially_paid if within tolerance
      if (status === "partially_paid" && actuallyPaid > 0) {
        const payCurrency = ((p.pay_currency as string) ?? "").toLowerCase();
        const isStablecoin = ["usd", "usdc", "usdp", "usdt", "busd", "dai"].includes(payCurrency);
        return (
          (outcomeAmount > 0 && outcomeAmount >= priceAmount - FIAT_TOLERANCE) ||
          (payAmount > 0 && actuallyPaid >= payAmount * (1 - CRYPTO_TOLERANCE)) ||
          // Only compare directly when pay_currency is a USD stablecoin
          (isStablecoin && actuallyPaid >= priceAmount - FIAT_TOLERANCE)
        );
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

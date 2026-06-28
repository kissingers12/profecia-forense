import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PLAN_PRICES: Record<string, number> = {
  meditaciones: 333,
  escuela: 777,
};

const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditación Profética - 100x100Cristianos",
  escuela: "Escuela Avanzada de Profecía - 100x100Cristianos",
};

const FALLBACK_URLS: Record<string, string> = {
  meditaciones: "https://nowpayments.io/payment/?iid=6358579774&paymentId=4532704630",
  escuela: "https://nowpayments.io/payment/?iid=5100234736&paymentId=5746183612",
};

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "Email requerido." }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("email, plan, activated")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) {
    return Response.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  if (user.activated) {
    return Response.json({ error: "Esta cuenta ya está activada." }, { status: 400 });
  }

  const plan = user.plan;
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  let paymentUrl = FALLBACK_URLS[plan] ?? null;

  if (apiKey) {
    try {
      const res = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          price_amount: PLAN_PRICES[plan],
          price_currency: "usd",
          order_id: email.toLowerCase(),
          order_description: PLAN_LABELS[plan],
          ipn_callback_url: "https://kissingersaraque.com/api/webhooks/nowpayments",
          success_url: "https://kissingersaraque.com/dashboard",
          cancel_url: "https://kissingersaraque.com/login",
        }),
      });
      const data = await res.json();
      if (data.invoice_url) paymentUrl = data.invoice_url;
    } catch {
      // usa fallback
    }
  }

  if (!paymentUrl) {
    return Response.json({ error: "No se pudo generar el enlace de pago." }, { status: 500 });
  }

  return Response.json({ paymentUrl, price: PLAN_PRICES[plan], plan });
}

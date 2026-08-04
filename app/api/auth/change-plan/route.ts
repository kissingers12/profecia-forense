import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PLAN_PRICES: Record<string, number> = {
  meditaciones: 333,
  escuela: 777,
  clases: 555,
};

const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditación Profética - 100x100Cristianos",
  escuela: "Escuela Avanzada de Profecía - 100x100Cristianos",
  clases: "Escuela de Profetas Todas las Clases - 100x100Cristianos",
};

const FALLBACK_URLS: Record<string, string> = {
  meditaciones: "https://nowpayments.io/payment/?iid=6358579774&paymentId=4532704630",
  escuela: "https://nowpayments.io/payment/?iid=5100234736&paymentId=5746183612",
};

export async function PATCH(req: NextRequest) {
  const { email, newPlan } = await req.json();

  if (!email || !newPlan || !PLAN_PRICES[newPlan]) {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  if (newPlan === "escuela") {
    return Response.json({ error: "Las plazas de la Escuela Avanzada están agotadas por el momento." }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, plan, activated")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) {
    return Response.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  if (user.activated) {
    return Response.json({ error: "Tu cuenta ya está activada y no puede cambiar de plan." }, { status: 400 });
  }

  await supabaseAdmin
    .from("users")
    .update({ plan: newPlan })
    .eq("email", email.toLowerCase());

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  let paymentUrl = FALLBACK_URLS[newPlan];

  if (apiKey) {
    try {
      const res = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          price_amount: PLAN_PRICES[newPlan],
          price_currency: "usd",
          order_id: email.toLowerCase(),
          order_description: PLAN_LABELS[newPlan],
          ipn_callback_url: "https://www.kissingersaraque.com/api/webhooks/nowpayments",
          success_url: "https://www.kissingersaraque.com/dashboard",
          cancel_url: "https://www.kissingersaraque.com/login",
        }),
      });
      const data = await res.json();
      if (data.invoice_url) paymentUrl = data.invoice_url;
    } catch {
      // usa fallback
    }
  }

  return Response.json({
    success: true,
    plan: newPlan,
    paymentUrl,
    price: PLAN_PRICES[newPlan],
  });
}

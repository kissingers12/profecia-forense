import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
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

async function createNowPaymentsInvoice(email: string, plan: string): Promise<string | null> {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        price_amount: PLAN_PRICES[plan],
        price_currency: "usd",
        order_id: email,
        order_description: PLAN_LABELS[plan],
        ipn_callback_url: "https://kissingersaraque.com/api/webhooks/nowpayments",
        success_url: "https://kissingersaraque.com/dashboard",
        cancel_url: "https://kissingersaraque.com/login",
      }),
    });
    const data = await res.json();
    return data.invoice_url ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { email, name, password, plan, whatsapp } = await req.json();

  if (!email || !name || !password || !plan) {
    return Response.json({ error: "Todos los campos son requeridos." }, { status: 400 });
  }

  if (plan === "escuela" && !whatsapp) {
    return Response.json({ error: "El número de WhatsApp es obligatorio para este programa." }, { status: 400 });
  }

  if (!PLAN_PRICES[plan]) {
    return Response.json({ error: "Plan inválido." }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existing) {
    return Response.json({ error: "Ya existe una cuenta con ese correo." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .insert({
      email: email.toLowerCase(),
      name,
      password_hash: passwordHash,
      plan,
      activated: false,
      ...(whatsapp ? { whatsapp } : {}),
    })
    .select("id, email, name, plan")
    .single();

  if (error || !user) {
    return Response.json({ error: "Error al crear la cuenta." }, { status: 500 });
  }

  // Log registration event (silent fail)
  supabaseAdmin.from("activity_logs").insert({
    user_email: user.email,
    user_name: user.name,
    action: "register",
  }).then(() => {});

  // Create unique payment per user so webhook knows who paid
  const invoiceUrl = await createNowPaymentsInvoice(email.toLowerCase(), plan);

  return Response.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan, activated: false },
    paymentUrl: invoiceUrl ?? FALLBACK_URLS[plan],
    price: PLAN_PRICES[plan],
  });
}

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { allow, clientIp } from "@/lib/rate-limit";

const PLAN_PRICES: Record<string, number> = {
  meditaciones: 333,
  escuela: 777,
  clases: 555,
  clase_individual: 30,
};

const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditación Profética - 100x100Cristianos",
  mentoria: "Mentoría Profética - 100x100Cristianos",
  escuela: "Escuela Avanzada de Profecía - 100x100Cristianos",
  clases: "Escuela de Profetas Todas las Clases - 100x100Cristianos",
  clase_individual: "Clase Individual - 100x100Cristianos",
};

const FALLBACK_URLS: Record<string, string> = {
  meditaciones: "https://nowpayments.io/payment/?iid=6358579774&paymentId=4532704630",
  escuela: "https://nowpayments.io/payment/?iid=5100234736&paymentId=5746183612",
};

const BUNDLE_PRICES: Record<number, number> = { 100: 120 };
const INDIVIDUAL_PRICES: Record<number, number> = { 201: 40, 202: 40, 203: 40, 204: 40, 205: 40, 206: 40, 207: 40, 208: 40, 209: 40, 210: 40, 301: 40, 401: 40, 402: 40 };

async function createNowPaymentsInvoice(email: string, plan: string, videoId?: number): Promise<{ url: string | null; price: number }> {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const basePrice = PLAN_PRICES[plan] ?? 30;
  const price = (videoId !== undefined && BUNDLE_PRICES[videoId])
    ? BUNDLE_PRICES[videoId]
    : (videoId !== undefined && INDIVIDUAL_PRICES[videoId])
      ? INDIVIDUAL_PRICES[videoId]
      : basePrice;
  if (!apiKey) return { url: null, price };

  const orderId = videoId ? `${email}:clase:${videoId}` : email;

  try {
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        price_amount: price,
        price_currency: "usd",
        order_id: orderId,
        order_description: PLAN_LABELS[plan],
        ipn_callback_url: "https://www.kissingersaraque.com/api/webhooks/nowpayments",
        success_url: "https://www.kissingersaraque.com/dashboard",
        cancel_url: "https://www.kissingersaraque.com/login",
      }),
    });
    const data = await res.json();
    return { url: data.invoice_url ?? null, price };
  } catch {
    return { url: null, price };
  }
}

export async function POST(req: NextRequest) {
  const { email, name, password, plan, whatsapp, videoId } = await req.json();

  if (!email || !name || !password || !plan) {
    return Response.json({ error: "Todos los campos son requeridos." }, { status: 400 });
  }

  // Freno anti-bots: evita que se creen cientos de cuentas basura
  if (!allow("registro", clientIp(req), 5, 60 * 60_000)) {
    return Response.json(
      { error: "Demasiados registros desde este dispositivo. Inténtalo más tarde." },
      { status: 429 }
    );
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json({ error: "El correo no es válido." }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < 6) {
    return Response.json({ error: "La contraseña debe tener al menos 6 caracteres." }, { status: 400 });
  }

  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
    return Response.json({ error: "El nombre no es válido." }, { status: 400 });
  }

  if (plan === "escuela") {
    return Response.json({ error: "Las plazas de la Escuela Avanzada están agotadas por el momento." }, { status: 400 });
  }

  if (plan === "clase_individual" && !videoId) {
    return Response.json({ error: "Selecciona una clase para continuar." }, { status: 400 });
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
    // Log the real Supabase error so we can diagnose it
    supabaseAdmin.from("activity_logs").insert({
      user_email: email.toLowerCase(),
      user_name: "REGISTER_ERROR",
      action: error?.message ?? "no user returned",
    }).then(() => {});
    return Response.json({ error: "Error al crear la cuenta." }, { status: 500 });
  }

  // Log registration event (silent fail)
  supabaseAdmin.from("activity_logs").insert({
    user_email: user.email,
    user_name: user.name,
    action: "register",
  }).then(() => {});

  // Guardar la clase elegida: si no llega a pagar con cripto, NOWPayments nunca avisa y no quedaría en ningún sitio
  if (plan === "clase_individual" && videoId) {
    await supabaseAdmin.from("activity_logs").insert({
      user_email: user.email,
      user_name: "CLASE_ELEGIDA",
      action: String(videoId),
    });
  }

  // Create unique payment per user so webhook knows who paid
  const { url: invoiceUrl, price: invoicePrice } = await createNowPaymentsInvoice(email.toLowerCase(), plan, plan === "clase_individual" ? videoId : undefined);

  return Response.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan, activated: false },
    paymentUrl: invoiceUrl ?? FALLBACK_URLS[plan],
    price: invoicePrice,
  });
}

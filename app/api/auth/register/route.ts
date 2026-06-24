import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

const PLAN_PRICES: Record<string, number> = {
  meditaciones: 333,
  escuela: 777,
};

const PLAN_PAYMENT_URLS: Record<string, string> = {
  meditaciones: "https://nowpayments.io/payment/?iid=6358579774&paymentId=4532704630",
  escuela: "https://nowpayments.io/payment/?iid=5100234736&paymentId=5746183612",
};

export async function POST(req: NextRequest) {
  const { email, name, password, plan } = await req.json();

  if (!email || !name || !password || !plan) {
    return Response.json({ error: "Todos los campos son requeridos." }, { status: 400 });
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
    })
    .select("id, email, name, plan")
    .single();

  if (error || !user) {
    return Response.json({ error: "Error al crear la cuenta." }, { status: 500 });
  }

  return Response.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan, activated: false },
    paymentUrl: PLAN_PAYMENT_URLS[plan],
    price: PLAN_PRICES[plan],
  });
}

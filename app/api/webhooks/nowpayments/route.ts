import { NextRequest } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const PRICE_TO_PLAN: Record<number, string> = {
  333: "meditaciones",
  555: "clases",
  777: "escuela",
};

// $20 absolute fiat tolerance (covers crypto conversion fees)
const FIAT_TOLERANCE = 20;
// 2.6% crypto-to-crypto tolerance (for when outcome_amount is unavailable)
const CRYPTO_TOLERANCE = 0.026;

async function log(event: string, detail: string) {
  await supabaseAdmin.from("activity_logs").insert({
    user_email: "webhook@nowpayments",
    user_name: event,
    action: detail,
  }).then(() => {});
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const parsed = JSON.parse(rawBody);
    const sortedKeys = Object.keys(parsed).sort();
    const sortedBody = JSON.stringify(parsed, sortedKeys);
    const hmac = crypto.createHmac("sha512", secret).update(sortedBody).digest("hex");
    if (hmac === signature) return true;
  } catch {}
  const hmac = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hmac === signature;
}

function findPlanByAmount(priceAmount: number): string | null {
  const entries = Object.entries(PRICE_TO_PLAN).sort((a, b) => Number(b[0]) - Number(a[0]));
  for (const [price, plan] of entries) {
    const expected = Number(price);
    if (priceAmount >= expected - FIAT_TOLERANCE && priceAmount <= expected * 1.15) {
      return plan;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  const signature = req.headers.get("x-nowpayments-sig") ?? "";

  await log("WEBHOOK_RECEIVED", `sig_present=${!!signature} body_len=${rawBody.length}`);

  if (!ipnSecret) {
    await log("WEBHOOK_ERROR", "NOWPAYMENTS_IPN_SECRET not set");
    return Response.json({ error: "Server misconfigured." }, { status: 500 });
  }

  if (!verifySignature(rawBody, signature, ipnSecret)) {
    await log("WEBHOOK_SIG_FAIL", `sig=${signature.slice(0, 30)}`);
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    await log("WEBHOOK_ERROR", "Invalid JSON body");
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const status = payload.payment_status as string;
  const orderId = (payload.order_id as string | undefined) ?? "";
  const priceAmount = Number(payload.price_amount);          // USD requested (e.g. 777)
  const actuallyPaid = Number(payload.actually_paid ?? 0);   // crypto paid (e.g. 0.012 BTC)
  const payAmount = Number(payload.pay_amount ?? 0);         // crypto required (e.g. 0.01231 BTC)
  const outcomeAmount = Number(payload.outcome_amount ?? 0); // fiat/USDC actually received (e.g. 765)

  await log("WEBHOOK_OK", `status=${status} order_id=${orderId} price=${priceAmount} actually_paid=${actuallyPaid} outcome=${outcomeAmount}`);

  // Registro legible para el panel /admin → pestaña Pagos.
  // Guarda TODOS los avisos (también parciales y en espera) para que Kissingers
  // pueda ver quién pagó y cuánto sin entrar en NOWPayments.
  await supabaseAdmin.from("activity_logs").insert({
    user_email: orderId || "sin-email",
    user_name: "PAGO",
    action: JSON.stringify({
      status,
      precio: priceAmount,
      pagado: actuallyPaid,
      moneda: payload.pay_currency ?? "",
      recibido: outcomeAmount,
      paymentId: payload.payment_id ?? "",
    }),
  }).then(() => {});

  const isFinished = status === "finished" || status === "confirmed";
  const isPartialOk =
    status === "partially_paid" &&
    actuallyPaid > 0 &&
    (
      // Best: outcome_amount is already converted to stablecoin/fiat — compare directly
      (outcomeAmount > 0 && outcomeAmount >= priceAmount - FIAT_TOLERANCE) ||
      // Good: compare crypto paid vs crypto required (same units, no currency mismatch)
      (payAmount > 0 && actuallyPaid >= payAmount * (1 - CRYPTO_TOLERANCE)) ||
      // Fallback: stablecoin payments where actually_paid ≈ USD
      actuallyPaid >= priceAmount - FIAT_TOLERANCE
    );

  if (!isFinished && !isPartialOk) {
    await log("WEBHOOK_SKIP", `status=${status} — not final`);
    return Response.json({ ok: true, skipped: true });
  }

  if (orderId && orderId.includes("@")) {
    const { data: planUser } = await supabaseAdmin
      .from("users")
      .select("plan")
      .eq("email", orderId.toLowerCase())
      .maybeSingle();

    const planForAmount = findPlanByAmount(priceAmount);

    if (planUser && planForAmount && planForAmount !== planUser.plan) {
      await log("WEBHOOK_PLAN_MISMATCH", `email=${orderId} paid_plan=${planForAmount} registered_plan=${planUser.plan} amount=${priceAmount}`);
      return Response.json({ ok: true, skipped: true });
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({ activated: true })
      .eq("email", orderId.toLowerCase());

    if (error) {
      await log("WEBHOOK_DB_ERROR", error.message);
      return Response.json({ error: "DB error." }, { status: 500 });
    }

    await log("WEBHOOK_ACTIVATED", `email=${orderId}`);
    return Response.json({ ok: true });
  }

  const plan = findPlanByAmount(priceAmount);
  await log("WEBHOOK_NO_EMAIL", `fallback plan=${plan} amount=${priceAmount}`);

  if (plan) {
    const { data: pending } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("plan", plan)
      .eq("activated", false)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (pending) {
      await supabaseAdmin.from("users").update({ activated: true }).eq("id", pending.id);
      await log("WEBHOOK_FALLBACK_ACTIVATED", `email=${pending.email}`);
    } else {
      await log("WEBHOOK_FALLBACK_NONE", `no pending user for plan=${plan}`);
    }
  }

  return Response.json({ ok: true });
}

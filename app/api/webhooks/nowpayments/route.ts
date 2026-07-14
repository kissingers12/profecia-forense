import { NextRequest } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const PRICE_TO_PLAN: Record<number, string> = {
  333: "meditaciones",
  777: "escuela",
};

const PARTIAL_TOLERANCE = 0.02;

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
    if (priceAmount >= expected * (1 - PARTIAL_TOLERANCE) && priceAmount <= expected * 1.15) {
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
  const priceAmount = Number(payload.price_amount);
  const actuallyPaid = Number(payload.actually_paid ?? 0);

  await log("WEBHOOK_OK", `status=${status} order_id=${orderId} amount=${priceAmount}`);

  const isFinished = status === "finished" || status === "confirmed";
  const isPartialOk =
    status === "partially_paid" &&
    actuallyPaid > 0 &&
    actuallyPaid >= priceAmount * (1 - PARTIAL_TOLERANCE);

  if (!isFinished && !isPartialOk) {
    await log("WEBHOOK_SKIP", `status=${status} — not final`);
    return Response.json({ ok: true, skipped: true });
  }

  if (orderId && orderId.includes("@")) {
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

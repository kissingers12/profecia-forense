import { NextRequest } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const PRICE_TO_PLAN: Record<number, string> = {
  333: "meditaciones",
  777: "escuela",
};

// Accept payment if it's within 2% of the expected price (covers rounding/fees)
const PARTIAL_TOLERANCE = 0.02;

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
  for (const [price, plan] of Object.entries(PRICE_TO_PLAN)) {
    const expected = Number(price);
    if (priceAmount >= expected * (1 - PARTIAL_TOLERANCE)) {
      return plan;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  const signature = req.headers.get("x-nowpayments-sig") ?? "";

  console.log("[webhook] Received IPN call");

  if (!ipnSecret) {
    console.error("[webhook] NOWPAYMENTS_IPN_SECRET not configured in env vars");
    return Response.json({ error: "Server misconfigured." }, { status: 500 });
  }

  if (!verifySignature(rawBody, signature, ipnSecret)) {
    console.error("[webhook] Signature verification FAILED. Signature:", signature?.slice(0, 20) + "...");
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }

  console.log("[webhook] Signature OK");

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const status = payload.payment_status as string;
  const orderId = (payload.order_id as string | undefined) ?? "";
  const priceAmount = Number(payload.price_amount);
  const actuallyPaid = Number(payload.actually_paid ?? 0);

  console.log(`[webhook] status=${status} order_id=${orderId} price_amount=${priceAmount} actually_paid=${actuallyPaid}`);

  // Accept finished, confirmed, and partially_paid within tolerance
  const isFinished = status === "finished" || status === "confirmed";
  const isPartialOk =
    status === "partially_paid" &&
    actuallyPaid > 0 &&
    actuallyPaid >= priceAmount * (1 - PARTIAL_TOLERANCE);

  if (!isFinished && !isPartialOk) {
    console.log(`[webhook] Skipping status=${status}`);
    return Response.json({ ok: true, skipped: true });
  }

  // Try to activate by email (order_id)
  if (orderId && orderId.includes("@")) {
    console.log(`[webhook] Activating user by email: ${orderId}`);
    const { error } = await supabaseAdmin
      .from("users")
      .update({ activated: true })
      .eq("email", orderId.toLowerCase());

    if (error) {
      console.error("[webhook] Supabase update error:", error.message);
      return Response.json({ error: "DB error." }, { status: 500 });
    }

    console.log(`[webhook] User ${orderId} activated successfully`);
    return Response.json({ ok: true });
  }

  // Fallback: activate by plan + amount
  const plan = findPlanByAmount(priceAmount);
  console.log(`[webhook] No email in order_id. Fallback plan by amount: plan=${plan}`);

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
      console.log(`[webhook] Fallback: activating ${pending.email}`);
      await supabaseAdmin
        .from("users")
        .update({ activated: true })
        .eq("id", pending.id);
    } else {
      console.log("[webhook] No pending user found for fallback activation");
    }
  }

  return Response.json({ ok: true });
}

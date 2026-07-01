import { NextRequest } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

// Price → plan mapping
const PRICE_TO_PLAN: Record<number, string> = {
  333: "meditaciones",
  777: "escuela",
};

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    // NOWPayments signs the alphabetically sorted JSON, not the raw body
    const parsed = JSON.parse(rawBody);
    const sortedKeys = Object.keys(parsed).sort();
    const sortedBody = JSON.stringify(parsed, sortedKeys);
    const hmac = crypto.createHmac("sha512", secret).update(sortedBody).digest("hex");
    if (hmac === signature) return true;
  } catch {}
  // Fallback: try raw body as-is
  const hmac = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hmac === signature;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  const signature = req.headers.get("x-nowpayments-sig") ?? "";

  // Reject all requests without a valid signature.
  // If the secret is not configured, block everything to prevent fake activations.
  if (!ipnSecret || !verifySignature(rawBody, signature, ipnSecret)) {
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const status = payload.payment_status as string;
  if (status !== "finished" && status !== "confirmed") {
    return Response.json({ ok: true, skipped: true });
  }

  // Try to identify the user by order_id (email) first
  const orderId = payload.order_id as string | undefined;
  const priceAmount = Number(payload.price_amount);
  const plan = PRICE_TO_PLAN[priceAmount];

  if (orderId && orderId.includes("@")) {
    // order_id is the user's email
    await supabaseAdmin
      .from("users")
      .update({ activated: true })
      .eq("email", orderId.toLowerCase())
      .eq("activated", false);
  } else if (plan) {
    // Fallback: activate the oldest unactivated user with that plan
    const { data: pending } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("plan", plan)
      .eq("activated", false)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (pending) {
      await supabaseAdmin
        .from("users")
        .update({ activated: true })
        .eq("id", pending.id);
    }
  }

  return Response.json({ ok: true });
}

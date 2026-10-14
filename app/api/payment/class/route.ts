import { NextRequest } from "next/server";

const BUNDLE_PRICES: Record<number, number> = { 100: 120 };
const INDIVIDUAL_PRICES: Record<number, number> = { 201: 40, 206: 40, 301: 40, 401: 40 };

export async function POST(req: NextRequest) {
  const { email, videoId, videoTitle } = await req.json();
  if (!email || !videoId) {
    return Response.json({ error: "Email y clase requeridos." }, { status: 400 });
  }

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) return Response.json({ error: "Servidor no configurado." }, { status: 500 });

  const orderId = `${email.toLowerCase()}:clase:${videoId}`;
  const price = BUNDLE_PRICES[videoId] ?? INDIVIDUAL_PRICES[videoId] ?? 30;

  try {
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        price_amount: price,
        price_currency: "usd",
        order_id: orderId,
        order_description: `Clase Individual: ${videoTitle ?? `Video #${videoId}`} - 100x100Cristianos`,
        ipn_callback_url: "https://www.kissingersaraque.com/api/webhooks/nowpayments",
        success_url: "https://www.kissingersaraque.com/dashboard",
        cancel_url: "https://www.kissingersaraque.com/dashboard",
      }),
    });
    const data = await res.json();
    return Response.json({ paymentUrl: data.invoice_url ?? null });
  } catch {
    return Response.json({ paymentUrl: null });
  }
}

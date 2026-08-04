import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest): boolean {
  return (req.headers.get("x-admin-password") ?? "") === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) return Response.json({ error: "NOWPAYMENTS_API_KEY no configurada." }, { status: 500 });

  try {
    const res = await fetch(
      "https://api.nowpayments.io/v1/payment?limit=50&sortBy=created_at&orderBy=desc",
      { headers: { "x-api-key": apiKey } }
    );

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: `NOWPayments error: ${err}` }, { status: 500 });
    }

    const data = await res.json();
    const rawPayments: Record<string, unknown>[] = data.data ?? [];

    // Collect unique emails to batch-lookup users
    const emails = [...new Set(
      rawPayments
        .map((p) => (p.order_id as string | undefined) ?? "")
        .filter((e) => e.includes("@"))
        .map((e) => e.toLowerCase())
    )];

    const { data: users } = await supabaseAdmin
      .from("users")
      .select("email, name, activated, plan")
      .in("email", emails);

    const userMap: Record<string, { name: string; activated: boolean; plan: string }> = {};
    for (const u of users ?? []) {
      userMap[u.email] = { name: u.name, activated: u.activated, plan: u.plan };
    }

    const payments = rawPayments.map((p) => {
      const email = ((p.order_id as string) ?? "").toLowerCase();
      const user = userMap[email] ?? null;
      return {
        payment_id: p.payment_id,
        payment_status: p.payment_status,
        order_id: p.order_id,
        price_amount: Number(p.price_amount ?? 0),
        price_currency: p.price_currency ?? "usd",
        pay_amount: Number(p.pay_amount ?? 0),
        actually_paid: Number(p.actually_paid ?? 0),
        pay_currency: p.pay_currency ?? "",
        outcome_amount: Number(p.outcome_amount ?? 0),
        outcome_currency: p.outcome_currency ?? "usd",
        created_at: p.created_at,
        user_name: user?.name ?? null,
        user_activated: user?.activated ?? null,
        user_plan: user?.plan ?? null,
      };
    });

    return Response.json({ payments });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

// Activate a user directly from the payments panel
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { email } = await req.json();
  if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("users")
    .update({ activated: true })
    .eq("email", email.toLowerCase());

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

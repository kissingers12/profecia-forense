import { NextRequest } from "next/server";

function checkAuth(req: NextRequest): boolean {
  return (req.headers.get("x-admin-password") ?? "") === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

  const result: Record<string, unknown> = {
    NOWPAYMENTS_API_KEY: apiKey ? "configurada ✓" : "FALTA ✗",
    NOWPAYMENTS_IPN_SECRET: ipnSecret ? "configurada ✓" : "FALTA ✗",
    apiKeyWorks: null as boolean | null,
    apiError: null as string | null,
  };

  if (apiKey) {
    try {
      const res = await fetch("https://api.nowpayments.io/v1/status", {
        headers: { "x-api-key": apiKey },
      });
      const data = await res.json() as Record<string, unknown>;
      if (res.ok && data.message === "OK") {
        result.apiKeyWorks = true;
      } else {
        result.apiKeyWorks = false;
        result.apiError = `NOWPayments respondió: ${JSON.stringify(data)}`;
      }
    } catch (e) {
      result.apiKeyWorks = false;
      result.apiError = String(e);
    }
  }

  return Response.json(result);
}

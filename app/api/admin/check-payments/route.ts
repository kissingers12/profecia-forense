import { NextRequest } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";

function checkAuth(req: NextRequest): boolean {
  return checkAdmin(req);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

  // Huella de la clave IPN con el mismo formato que muestra NOWPayments
  // (4 primeros...4 últimos) para poder compararlas a simple vista sin exponerla
  const ipnFingerprint = ipnSecret
    ? `${ipnSecret.slice(0, 4)}...${ipnSecret.slice(-4)}`
    : "—";

  const result: Record<string, unknown> = {
    NOWPAYMENTS_API_KEY: apiKey ? "configurada ✓" : "FALTA ✗",
    NOWPAYMENTS_IPN_SECRET: ipnSecret ? "configurada ✓" : "FALTA ✗",
    claveIPN_enLaWeb: ipnFingerprint,
    compararCon: "NOWPayments → Configuración → Pagos → Notificaciones. Deben ser IGUALES.",
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

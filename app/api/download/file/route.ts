import { NextRequest } from "next/server";
import crypto from "crypto";

function verifyToken(token: string): { url: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const secret = process.env.DOWNLOAD_TOKEN_SECRET || process.env.ADMIN_PASSWORD || "fallback";
  const expected = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  // Constant-time comparison to prevent timing attacks
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (typeof payload.url !== "string" || typeof payload.exp !== "number") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t");
  if (!token) return new Response("Enlace inválido.", { status: 400 });

  const payload = verifyToken(token);
  if (!payload) return new Response("Enlace inválido o manipulado.", { status: 403 });
  if (payload.exp < Date.now()) return new Response("Este enlace ha expirado. Vuelve a ingresar tu código.", { status: 410 });

  // Only allow Google Drive and Supabase Storage URLs
  const url = payload.url;
  if (!url.startsWith("https://drive.google.com/") && !url.includes(".supabase.co/")) {
    return new Response("Destino no permitido.", { status: 403 });
  }

  return Response.redirect(url, 302);
}

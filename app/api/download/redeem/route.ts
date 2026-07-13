import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

// In-memory rate limiting: max 8 attempts per IP per hour
const ipAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return true;
  }
  if (entry.count >= 8) return false;
  entry.count++;
  return true;
}

function signToken(payload: object): string {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET || process.env.ADMIN_PASSWORD || "fallback";
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function parseFiles(fileUrl: string, fileName: string): { url: string; name: string }[] {
  try {
    const urls = JSON.parse(fileUrl);
    const names = JSON.parse(fileName);
    if (Array.isArray(urls) && Array.isArray(names))
      return urls.map((url: string, i: number) => ({ url, name: names[i] }));
  } catch { /* single file */ }
  return [{ url: fileUrl, name: fileName }];
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip))
    return Response.json({ error: "Demasiados intentos. Espera una hora e intenta de nuevo." }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body?.code || typeof body.code !== "string")
    return Response.json({ error: "Código requerido." }, { status: 400 });

  const code = body.code.trim().toUpperCase();
  // Only allow expected code format to reduce DB queries from bots
  if (code.length < 4 || code.length > 40)
    return Response.json({ error: "Código incorrecto. Verifica e intenta de nuevo." }, { status: 404 });

  const { data } = await supabaseAdmin
    .from("download_codes")
    .select("id, file_url, file_name, used")
    .eq("code", code)
    .maybeSingle();

  if (!data) return Response.json({ error: "Código incorrecto. Verifica e intenta de nuevo." }, { status: 404 });
  if (data.used) return Response.json({ error: "Este código ya fue utilizado." }, { status: 400 });

  await supabaseAdmin
    .from("download_codes")
    .update({ used: true, used_at: new Date().toISOString() })
    .eq("id", data.id);

  // Return signed tokens instead of raw Google Drive URLs
  const files = parseFiles(data.file_url, data.file_name);
  const exp = Date.now() + 15 * 60 * 1000; // 15 minutes

  const tokenFiles = files.map((f) => ({
    name: f.name,
    downloadUrl: `/api/download/file?t=${signToken({ url: f.url, exp })}`,
  }));

  return Response.json({ files: tokenFiles });
}

import { NextRequest } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return Response.json({ error: "Correo requerido." }, { status: 400 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, name")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  // Always return success to avoid leaking which emails are registered
  if (!user) return Response.json({ success: true });

  const code = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await supabaseAdmin
    .from("users")
    .update({ reset_token: code, reset_expires: expires.toISOString() })
    .eq("id", user.id);

  await resend.emails.send({
    from: "100x100Cristianos <noreply@kissingersaraque.com>",
    to: email.toLowerCase(),
    subject: "Recupera tu contraseña — 100x100Cristianos",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#050510;color:#c8b89a;padding:32px;border-radius:12px;">
        <h2 style="color:#c9a84c;margin-bottom:8px;">100x100Cristianos</h2>
        <p>Hola <strong style="color:#fff;">${user.name}</strong>,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Usa este código:</p>
        <div style="background:#0a0a20;border:1px solid #c9a84c33;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
          <span style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#c9a84c;">${code}</span>
        </div>
        <p style="color:#6a5a4a;font-size:13px;">Este código expira en <strong>15 minutos</strong>. Si no solicitaste esto, ignora este mensaje.</p>
      </div>
    `,
  });

  return Response.json({ success: true });
}

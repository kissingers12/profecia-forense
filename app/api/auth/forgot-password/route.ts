import { NextRequest } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import nodemailer from "nodemailer";
import { allow, clientIp } from "@/lib/rate-limit";


export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return Response.json({ error: "Correo requerido." }, { status: 400 });

  // Evita que alguien inunde de correos a un alumno pidiendo códigos sin parar:
  // 4 códigos por alumno cada 4 h, y 15 por dispositivo cada 24 h
  if (
    !allow("olvide-cuenta", String(email).toLowerCase(), 4, 4 * 60 * 60_000) ||
    !allow("olvide-ip", clientIp(req), 15, 24 * 60 * 60_000)
  ) {
    // Se responde igual que en el caso normal para no dar pistas
    return Response.json({ success: true });
  }

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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  let errorEnvio: { message: string } | null = null;
  try {
    await transporter.sendMail({
    from: `"Servicio al Estudiante · 100x100Cristianos" <${process.env.EMAIL_USER}>`,
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
  } catch (err) {
    errorEnvio = { message: err instanceof Error ? err.message : String(err) };
  }

  // Antes el fallo se perdía en silencio: el alumno esperaba un código que
  // nunca salía. Ahora queda anotado y se ve en /admin -> Actividad.
  if (errorEnvio) {
    console.error("[recuperar-contrasena]", errorEnvio.message);
    await supabaseAdmin.from("activity_logs").insert({
      user_email: "sistema@correo",
      user_name: "ERROR_CORREO",
      action: `No salió el código de recuperación para ${email.toLowerCase()}: ${errorEnvio.message}`.slice(0, 300),
    });
  }

  // Se responde igual haya salido o no, para no revelar qué correos existen
  return Response.json({ success: true });
}

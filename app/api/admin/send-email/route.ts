import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function checkAuth(req: NextRequest): boolean {
  return (req.headers.get("x-admin-password") ?? "") === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { to, subject, body } = await req.json();
  if (!to || !subject || !body) {
    return Response.json({ error: "Faltan campos: to, subject, body." }, { status: 400 });
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "100x100Cristianos <onboarding@resend.dev>";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#050510;color:#c8b89a;padding:36px;border-radius:14px;">
      <div style="margin-bottom:28px;">
        <h2 style="color:#c9a84c;margin:0 0 4px 0;font-size:20px;">100x100Cristianos</h2>
        <p style="color:#6a5a4a;font-size:12px;margin:0;">kissingersaraque.com</p>
      </div>
      <div style="background:#0a0a20;border:1px solid #c9a84c22;border-radius:10px;padding:28px;white-space:pre-line;line-height:1.8;font-size:15px;color:#d8c8b8;">
${body.trim()}
      </div>
      <p style="color:#4a3a2a;font-size:11px;margin-top:28px;text-align:center;">
        Este correo fue enviado desde el panel de administración de 100x100Cristianos.
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

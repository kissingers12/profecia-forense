import { NextRequest } from "next/server";
import { Resend } from "resend";
import { checkAdmin } from "@/lib/admin-auth";

const resend = new Resend(process.env.RESEND_API_KEY);

function checkAuth(req: NextRequest): boolean {
  return checkAdmin(req);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { to, subject, body } = await req.json();
  if (!to || !subject || !body) {
    return Response.json({ error: "Faltan campos: to, subject, body." }, { status: 400 });
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "100x100Cristianos <onboarding@resend.dev>";

  // Se escapa el texto y luego se convierten las direcciones web en enlaces,
  // para que el alumno pueda pulsarlas en vez de tener que copiarlas
  const texto = body
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" style="color:#c9a84c;text-decoration:underline">$1</a>'
    );

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#050510;color:#f0e6d3;padding:36px 32px;border-radius:14px;border:1px solid #c9a84c33">
      <p style="color:#c9a84c;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:0 0 22px">100×100 Cristianos</p>

      <div style="font-size:15px;line-height:1.8;color:#e8dcc8;white-space:pre-line">
${texto}
      </div>

      <div style="text-align:center;margin:30px 0 6px">
        <a href="https://www.kissingersaraque.com/login"
           style="display:inline-block;background:#c9a84c;color:#050510;font-weight:bold;font-size:15px;text-decoration:none;padding:14px 34px;border-radius:10px">
          Entrar a mi cuenta →
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #c9a84c22;margin:24px 0"/>

      <p style="font-size:13px;color:#6a5a4a;margin:0">
        <strong style="color:#8a7a6a">Servicio al Estudiante</strong> ·
        <a href="https://www.kissingersaraque.com" style="color:#c9a84c;text-decoration:none">kissingersaraque.com</a>
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({ from, to, subject, html, reply_to: "100x100cristianos@gmail.com" });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, programa, mensaje } = body;

    if (!nombre || !email) {
      return NextResponse.json({ ok: false, error: "Datos incompletos." }, { status: 400 });
    }

    const safeName = escapeHtml(nombre || "");
    const safeEmail = escapeHtml(email || "");
    const safePhone = escapeHtml(telefono || "");
    const safeProg = escapeHtml(programa || "");
    const safeMsg = escapeHtml(mensaje || "");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"100x100Cristianos" <${process.env.EMAIL_USER}>`,
      to: "100x100cristianos@gmail.com",
      replyTo: email,
      subject: `Nuevo mensaje — ${safeProg || "Sin programa"} | ${safeName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#050510;color:#f0e6d3;padding:32px;border-radius:12px;border:1px solid #c9a84c33">
          <h2 style="color:#c9a84c;margin-bottom:24px">Nuevo mensaje de contacto</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px;width:130px">Nombre</td><td style="padding:8px 0;font-weight:bold">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#c9a84c">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Teléfono</td><td style="padding:8px 0">${safePhone || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Programa</td><td style="padding:8px 0;color:#c9a84c;font-weight:bold">${safeProg || "—"}</td></tr>
          </table>
          <hr style="border-color:#c9a84c22;margin:20px 0"/>
          <p style="color:#8a7a6a;font-size:13px;margin-bottom:8px">Mensaje:</p>
          <p style="background:#0a0a20;padding:16px;border-radius:8px;border-left:3px solid #c9a84c;line-height:1.6">${safeMsg || "—"}</p>
          <p style="color:#4a3a2a;font-size:11px;margin-top:24px">Enviado desde kissingersaraque.com</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ ok: false, error: "No se pudo enviar el mensaje" }, { status: 500 });
  }
}

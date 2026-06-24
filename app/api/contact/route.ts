import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, programa, mensaje } = body;

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
      subject: `Nuevo mensaje — ${programa || "Sin programa"} | ${nombre}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#050510;color:#f0e6d3;padding:32px;border-radius:12px;border:1px solid #c9a84c33">
          <h2 style="color:#c9a84c;margin-bottom:24px">Nuevo mensaje de contacto</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px;width:130px">Nombre</td><td style="padding:8px 0;font-weight:bold">${nombre}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#c9a84c">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Teléfono</td><td style="padding:8px 0">${telefono || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Programa</td><td style="padding:8px 0;color:#c9a84c;font-weight:bold">${programa || "—"}</td></tr>
          </table>
          <hr style="border-color:#c9a84c22;margin:20px 0"/>
          <p style="color:#8a7a6a;font-size:13px;margin-bottom:8px">Mensaje:</p>
          <p style="background:#0a0a20;padding:16px;border-radius:8px;border-left:3px solid #c9a84c;line-height:1.6">${mensaje || "—"}</p>
          <p style="color:#4a3a2a;font-size:11px;margin-top:24px">Enviado desde profeciaforense.com</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ ok: false, error: "No se pudo enviar el mensaje" }, { status: 500 });
  }
}

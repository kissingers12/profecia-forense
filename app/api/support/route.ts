import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditación Profética — $333",
  escuela: "Escuela Avanzada de Profecía — $777",
};

export async function POST(req: NextRequest) {
  try {
    const { name, email, plan, message } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email requerido." }, { status: 400 });
    }

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
      subject: `⚠️ PAGO SIN ACCESO — ${name || email} | ${PLAN_LABELS[plan] ?? plan ?? "Plan desconocido"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#050510;color:#f0e6d3;padding:32px;border-radius:12px;border:1px solid #c9a84c33">
          <h2 style="color:#c9a84c;margin-bottom:8px">⚠️ Cliente con pago sin acceso</h2>
          <p style="color:#8a7a6a;font-size:13px;margin-bottom:24px">Este cliente dice haber pagado pero no puede ingresar. Revisa su pago y actívalo manualmente.</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px;width:130px">Nombre</td><td style="padding:8px 0;font-weight:bold">${name || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#c9a84c">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Programa</td><td style="padding:8px 0;color:#c9a84c;font-weight:bold">${PLAN_LABELS[plan] ?? plan ?? "—"}</td></tr>
          </table>
          ${message ? `
          <hr style="border-color:#c9a84c22;margin:20px 0"/>
          <p style="color:#8a7a6a;font-size:13px;margin-bottom:8px">Mensaje del cliente:</p>
          <p style="background:#0a0a20;padding:16px;border-radius:8px;border-left:3px solid #c9a84c;line-height:1.6">${message}</p>
          ` : ""}
          <hr style="border-color:#c9a84c22;margin:20px 0"/>
          <p style="color:#c9a84c;font-size:13px;font-weight:bold">Acción requerida:</p>
          <p style="color:#8a7a6a;font-size:13px">1. Verifica el pago en NowPayments buscando por email: <strong style="color:#f0e6d3">${email}</strong></p>
          <p style="color:#8a7a6a;font-size:13px">2. Si el pago está confirmado, actívalo en: <a href="https://kissingersaraque.com/admin" style="color:#c9a84c">kissingersaraque.com/admin</a></p>
          <p style="color:#8a7a6a;font-size:13px">3. Responde a este email para informarle al cliente.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Support email error:", err);
    return NextResponse.json({ ok: false, error: "No se pudo enviar." }, { status: 500 });
  }
}

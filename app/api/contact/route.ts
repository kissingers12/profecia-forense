import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { limpiarMensaje, limpiarCabecera } from "@/lib/sanitizar";

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
    const { nombre, email, telefono, programa, mensaje, iglesia, ciudad, direccion, rol } = body;

    if (!nombre || !email) {
      return NextResponse.json({ ok: false, error: "Datos incompletos." }, { status: 400 });
    }

    const safeName = escapeHtml(limpiarCabecera(nombre));
    const safeEmail = escapeHtml(email || "");
    const safePhone = escapeHtml(limpiarCabecera(telefono, 40));
    const safeProg = escapeHtml(limpiarCabecera(programa, 60));
    // Sin enlaces: el formulario es público y es la vía típica de spam
    const safeMsg = escapeHtml(limpiarMensaje(mensaje));

    // Datos de la iglesia: solo llegan en las invitaciones ministeriales
    const safeIglesia = escapeHtml(limpiarCabecera(iglesia, 120));
    const safeCiudad = escapeHtml(limpiarCabecera(ciudad, 80));
    const safeDireccion = escapeHtml(limpiarCabecera(direccion, 160));
    const safeRol = escapeHtml(limpiarCabecera(rol, 60));
    const esInvitacion = Boolean(safeIglesia);

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
      subject: esInvitacion
        ? `⛪ INVITACIÓN MINISTERIAL — ${safeIglesia} | ${safeName}`
        : `Nuevo mensaje — ${safeProg || "Sin programa"} | ${safeName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#050510;color:#f0e6d3;padding:32px;border-radius:12px;border:1px solid #c9a84c33">
          <h2 style="color:#c9a84c;margin-bottom:24px">${esInvitacion ? "⛪ Invitación para visitar una iglesia" : "Nuevo mensaje de contacto"}</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px;width:130px">Nombre</td><td style="padding:8px 0;font-weight:bold">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#c9a84c">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Teléfono</td><td style="padding:8px 0">${safePhone || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Programa</td><td style="padding:8px 0;color:#c9a84c;font-weight:bold">${safeProg || "—"}</td></tr>
          </table>
          ${esInvitacion ? `
          <div style="background:#0a0a20;border:1px solid #c9a84c33;border-radius:8px;padding:16px;margin-top:18px">
            <p style="color:#c9a84c;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px">Datos de la iglesia</p>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#8a7a6a;font-size:13px;width:130px">Iglesia</td><td style="padding:6px 0;font-weight:bold">${safeIglesia}</td></tr>
              <tr><td style="padding:6px 0;color:#8a7a6a;font-size:13px">Ciudad y país</td><td style="padding:6px 0">${safeCiudad || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#8a7a6a;font-size:13px">Dirección</td><td style="padding:6px 0">${safeDireccion || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#8a7a6a;font-size:13px">Su rol</td><td style="padding:6px 0;color:#c9a84c">${safeRol || "—"}</td></tr>
            </table>
          </div>
          ` : ""}
          <hr style="border-color:#c9a84c22;margin:20px 0"/>
          <p style="color:#8a7a6a;font-size:13px;margin-bottom:8px">${esInvitacion ? "Por qué quiere que visitemos su iglesia:" : "Mensaje:"}</p>
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

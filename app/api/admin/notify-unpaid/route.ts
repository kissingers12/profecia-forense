import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Aviso al alumno que dice haber pagado pero cuyo pago nunca llegó a completarse.
 * Mismo diseño que el correo de bienvenida, firmado por Servicio al Estudiante.
 */
export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { email } = await req.json();
  if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("email, name, activated")
    .eq("email", String(email).toLowerCase())
    .maybeSingle();

  if (!user) return Response.json({ error: "Ese correo no tiene cuenta." }, { status: 404 });
  if (user.activated) {
    return Response.json({ error: "Esta persona ya tiene acceso activo; no procede este aviso." }, { status: 400 });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return Response.json({ error: "Faltan las credenciales de correo (EMAIL_USER / EMAIL_PASS)." }, { status: 500 });
  }

  const safeName = escapeHtml(user.name?.trim() ?? "");
  const safeEmail = escapeHtml(user.email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"Servicio al Estudiante · 100x100Cristianos" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Sobre tu pago — no llegó a completarse 🙏",
    text:
      `¡Bendiciones${safeName ? ", " + user.name.trim() : ""}! 🙏\n\n` +
      `Gracias por escribirnos. Revisamos tu inscripción con detalle y vimos que tu pago quedó iniciado pero no llegó a completarse: ` +
      `el sistema generó tu enlace de pago, pero no se recibió ningún envío. Por eso tu acceso sigue bloqueado.\n\n` +
      `Esto suele ocurrir cuando se abre la pantalla de pago y se cierra antes de enviar la criptomoneda desde el monedero, ` +
      `o cuando el envío se queda a medias.\n\n` +
      `Para completarlo:\n` +
      `1. Entra en www.kissingersaraque.com e inicia sesión con este correo (${user.email}).\n` +
      `2. Pulsa "Quiero pagar ahora".\n` +
      `3. Elige tu criptomoneda y envía el importe exacto que te indique la pantalla.\n` +
      `4. Espera la confirmación de la red. En Bitcoin puede tardar entre 20 y 40 minutos: tu acceso se activará automáticamente.\n\n` +
      `Si tú crees que sí llegaste a enviar el dinero, respóndenos con el comprobante o el ID de la transacción de tu monedero y lo verificamos enseguida.\n\n` +
      `Quedamos atentos para ayudarte en lo que necesites.\n\n` +
      `Servicio al Estudiante · 100x100Cristianos`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#050510;color:#f0e6d3;padding:36px 32px;border-radius:14px;border:1px solid #c9a84c33">
        <p style="color:#c9a84c;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:0 0 14px">100×100 Cristianos</p>
        <h1 style="color:#ffffff;font-size:24px;margin:0 0 22px;line-height:1.3">¡Bendiciones${safeName ? `, ${safeName}` : ""}! 🙏</h1>

        <p style="font-size:15px;line-height:1.7;color:#e8dcc8;margin:0 0 18px">
          Gracias por escribirnos. Revisamos tu inscripción con detalle y vimos que
          <strong style="color:#c9a84c">tu pago quedó iniciado pero no llegó a completarse</strong>:
          el sistema generó tu enlace de pago, pero no se recibió ningún envío. Por eso tu acceso sigue bloqueado.
        </p>

        <p style="font-size:15px;line-height:1.7;color:#e8dcc8;margin:0 0 22px">
          Esto suele ocurrir cuando se abre la pantalla de pago y se cierra antes de enviar la criptomoneda
          desde el monedero, o cuando el envío se queda a medias.
        </p>

        <div style="background:#0a0a20;border:1px solid #c9a84c33;border-radius:10px;padding:20px;margin:0 0 24px">
          <p style="color:#c9a84c;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;margin:0 0 14px">Cómo completarlo</p>
          <p style="font-size:14px;line-height:1.7;color:#e8dcc8;margin:0 0 10px"><strong style="color:#c9a84c">1.</strong> Entra en la web e inicia sesión con este correo.</p>
          <p style="font-size:14px;line-height:1.7;color:#e8dcc8;margin:0 0 10px"><strong style="color:#c9a84c">2.</strong> Pulsa «Quiero pagar ahora».</p>
          <p style="font-size:14px;line-height:1.7;color:#e8dcc8;margin:0 0 10px"><strong style="color:#c9a84c">3.</strong> Elige tu criptomoneda y envía el <strong>importe exacto</strong> que te indique la pantalla.</p>
          <p style="font-size:14px;line-height:1.7;color:#e8dcc8;margin:0">
            <strong style="color:#c9a84c">4.</strong> Espera la confirmación de la red. En Bitcoin puede tardar entre 20 y 40 minutos:
            tu acceso <strong>se activará automáticamente</strong>.
          </p>
        </div>

        <div style="background:#0a0a20;border:1px solid #c9a84c33;border-radius:10px;padding:16px;margin:0 0 24px">
          <p style="color:#8a7a6a;font-size:12px;margin:0 0 4px">Tu correo de acceso</p>
          <p style="color:#c9a84c;font-size:15px;font-weight:bold;margin:0">${safeEmail}</p>
        </div>

        <div style="text-align:center;margin:0 0 26px">
          <a href="https://www.kissingersaraque.com/login"
             style="display:inline-block;background:#c9a84c;color:#050510;font-weight:bold;font-size:15px;text-decoration:none;padding:14px 34px;border-radius:10px">
            Completar mi pago →
          </a>
        </div>

        <p style="font-size:14px;line-height:1.7;color:#b8a888;margin:0 0 18px;border-left:2px solid #c9a84c66;padding-left:14px">
          Si tú crees que sí llegaste a enviar el dinero, respóndenos con el <strong style="color:#e8dcc8">comprobante
          o el ID de la transacción</strong> de tu monedero y lo verificamos enseguida.
        </p>

        <hr style="border:none;border-top:1px solid #c9a84c22;margin:24px 0"/>

        <p style="font-size:13px;line-height:1.6;color:#8a7a6a;margin:0 0 6px">
          Quedamos atentos para ayudarte en lo que necesites.
        </p>
        <p style="font-size:13px;color:#6a5a4a;margin:0">
          <strong style="color:#8a7a6a">Servicio al Estudiante</strong> ·
          <a href="https://www.kissingersaraque.com" style="color:#c9a84c;text-decoration:none">kissingersaraque.com</a>
        </p>
      </div>
    `,
  });

  return Response.json({ ok: true });
}

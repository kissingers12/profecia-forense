import nodemailer from "nodemailer";
import { supabaseAdmin } from "./supabase";
import { nombreDeSaludo } from "./nombre";
import { generoPorNombre } from "./genero";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Correo de bienvenida del alumno.
 *
 * Lo usan tanto el botón "Activar acceso" del panel como la activación
 * automática al confirmarse un pago, para que nadie se quede sin recibirlo.
 * Deja constancia en activity_logs para poder mostrar en /admin que ya se envió.
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false;

  const nombre = nombreDeSaludo(name);
  const safeName = escapeHtml(nombre);
  const safeEmail = escapeHtml(email);

  // Saludo en femenino o masculino según el nombre; neutro si no está claro
  const g = generoPorNombre(name);
  const bienvenida =
    g === "f" ? "¡Bienvenida a la familia de 100×100 Cristianos!"
    : g === "m" ? "¡Bienvenido a la familia de 100×100 Cristianos!"
    : "¡Te damos la bienvenida a la familia de 100×100 Cristianos!";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"Servicio al Estudiante · 100x100Cristianos" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "¡Tu acceso ya está activado! 🙏",
    text:
      `¡Bendiciones${nombre ? ", " + nombre : ""}! 🙏\n\n` +
      `Nos alegra informarte que tu acceso ya ha sido activado. Ya puedes ingresar iniciando sesión con el correo con el que te registraste (${email}), y tendrás acceso tanto al contenido disponible ahora como a todo el contenido que se vaya liberando en el futuro.\n\n` +
      `Entra aquí: https://www.kissingersaraque.com/login\n\n` +
      `${bienvenida}\n\n` +
      `Oramos para que este tiempo de formación sea de mucha edificación.\n\n` +
      `Si llegas a tener alguna dificultad, escríbenos y con gusto te ayudaremos.\n\n` +
      `Servicio al Estudiante · 100x100Cristianos`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#050510;color:#f0e6d3;padding:36px 32px;border-radius:14px;border:1px solid #c9a84c33">
        <p style="color:#c9a84c;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:0 0 14px">100×100 Cristianos</p>
        <h1 style="color:#ffffff;font-size:24px;margin:0 0 22px;line-height:1.3">¡Bendiciones${safeName ? `, ${safeName}` : ""}! 🙏</h1>

        <p style="font-size:15px;line-height:1.7;color:#e8dcc8;margin:0 0 18px">
          Nos alegra informarte que <strong style="color:#c9a84c">tu acceso ya ha sido activado</strong>.
          Ya puedes ingresar iniciando sesión con el correo con el que te registraste, y tendrás acceso
          tanto al contenido disponible ahora como a todo el contenido que se vaya liberando en el futuro.
        </p>

        <div style="background:#0a0a20;border:1px solid #c9a84c33;border-radius:10px;padding:16px;margin:0 0 24px">
          <p style="color:#8a7a6a;font-size:12px;margin:0 0 4px">Tu correo de acceso</p>
          <p style="color:#c9a84c;font-size:15px;font-weight:bold;margin:0">${safeEmail}</p>
        </div>

        <div style="text-align:center;margin:0 0 26px">
          <a href="https://www.kissingersaraque.com/login"
             style="display:inline-block;background:#c9a84c;color:#050510;font-weight:bold;font-size:15px;text-decoration:none;padding:14px 34px;border-radius:10px">
            Entrar a mi formación →
          </a>
        </div>

        <p style="font-size:16px;line-height:1.7;color:#c9a84c;font-weight:bold;margin:0 0 14px;text-align:center">
          ${bienvenida}
        </p>

        <p style="font-size:15px;line-height:1.7;color:#e8dcc8;margin:0 0 18px">
          Oramos para que este tiempo de formación sea de mucha edificación.
        </p>

        <hr style="border:none;border-top:1px solid #c9a84c22;margin:24px 0"/>

        <p style="font-size:13px;line-height:1.6;color:#8a7a6a;margin:0 0 6px">
          Si llegas a tener alguna dificultad, escríbenos y con gusto te ayudaremos.
        </p>
        <p style="font-size:13px;color:#6a5a4a;margin:0">
          <strong style="color:#8a7a6a">Servicio al Estudiante</strong> · <a href="https://www.kissingersaraque.com" style="color:#c9a84c;text-decoration:none">kissingersaraque.com</a>
        </p>
      </div>
    `,
  });

  // Deja constancia para la etiqueta "Bienvenida enviada" del panel
  await supabaseAdmin.from("activity_logs").insert({
    user_email: email,
    user_name: "CORREO",
    action: "bienvenida",
  });

  return true;
}

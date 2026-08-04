import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase";
import { allow, clientIp } from "@/lib/rate-limit";

const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditación Profética — $333",
  // La Escuela Avanzada está agotada: quien siga registrado en ella tiene que
  // cambiar de formación, así que el aviso lo deja claro en vez de pedir $777
  escuela: "⚠️ Registrado en la Escuela Avanzada (AGOTADA) — debe cambiar de formación",
  clases: "Escuela de Profetas · Todas las Clases — $555",
  mentoria: "Mentoría Profética — $555",
};

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
    const { name, email, plan, message } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email requerido." }, { status: 400 });
    }

    // Evita que un bot llene el buzón de soporte de mensajes:
    // 3 por persona y 10 por dispositivo cada 24 h
    const DIA = 24 * 60 * 60_000;
    if (
      !allow("soporte-cuenta", String(email).toLowerCase(), 3, DIA) ||
      !allow("soporte-ip", clientIp(req), 10, DIA)
    ) {
      return NextResponse.json(
        { ok: false, error: "Ya recibimos tu solicitud. Te responderemos pronto." },
        { status: 429 }
      );
    }

    if (typeof message === "string" && message.length > 2000) {
      return NextResponse.json({ ok: false, error: "El mensaje es demasiado largo." }, { status: 400 });
    }

    // Only allow registered users to send support requests
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, plan, activated")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Usuario no encontrado." }, { status: 404 });
    }

    // El plan se toma de la base de datos, no de lo que envía el navegador:
    // la sesión guardada puede estar anticuada y mostrar un plan que ya no tiene
    const planReal = user.plan ?? plan;

    // Último aviso de NOWPayments de este cliente, para saber de un vistazo
    // si realmente pagó o solo generó el enlace de pago
    const { data: ultimoPago } = await supabaseAdmin
      .from("activity_logs")
      .select("action, created_at")
      .eq("user_email", email.toLowerCase())
      .eq("user_name", "PAGO")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let resumenPago = "Sin ningún aviso de pago registrado. Este cliente no ha iniciado ningún pago.";
    if (ultimoPago) {
      try {
        const d = JSON.parse(ultimoPago.action) as Record<string, unknown>;
        const enviado = Number(d.pagado ?? 0);
        const requerido = Number(d.requerido ?? 0);
        const moneda = String(d.moneda ?? "").toUpperCase();
        const fecha = new Date(ultimoPago.created_at).toLocaleString("es-ES");
        if (enviado <= 0) {
          resumenPago = `NO ha enviado el pago todavía. Generó el enlace de pago (${fecha}) pero no llegó ningún importe. Estado: ${d.status}.`;
        } else {
          const pct = requerido > 0 ? ((enviado / requerido) * 100).toFixed(1) : "?";
          resumenPago = `SÍ envió ${enviado} ${moneda} de los ${requerido} ${moneda} pedidos (${pct}%). Estado: ${d.status}. Fecha: ${fecha}.`;
        }
      } catch {
        resumenPago = "Hay un aviso de pago pero no se pudo leer. Revísalo en /admin → Pagos.";
      }
    }

    const safeName = escapeHtml(name || "");
    const safeEmail = escapeHtml(email || "");
    const safeMessage = escapeHtml(message || "");
    const safePlanLabel = escapeHtml(PLAN_LABELS[planReal] ?? planReal ?? "Plan desconocido");
    const safeResumen = escapeHtml(resumenPago);
    const yaActivo = user.activated;

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
      subject: `⚠️ PAGO SIN ACCESO — ${safeName || safeEmail} | ${safePlanLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#050510;color:#f0e6d3;padding:32px;border-radius:12px;border:1px solid #c9a84c33">
          <h2 style="color:#c9a84c;margin-bottom:8px">⚠️ Cliente con pago sin acceso</h2>
          <p style="color:#8a7a6a;font-size:13px;margin-bottom:24px">Este cliente dice haber pagado pero no puede ingresar. Revisa su pago y actívalo manualmente.</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px;width:130px">Nombre</td><td style="padding:8px 0;font-weight:bold">${safeName || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#c9a84c">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Programa</td><td style="padding:8px 0;color:#c9a84c;font-weight:bold">${safePlanLabel}</td></tr>
            <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Acceso</td><td style="padding:8px 0;font-weight:bold;color:${yaActivo ? "#4ade80" : "#f87171"}">${yaActivo ? "YA TIENE acceso activo" : "Sin acceso"}</td></tr>
          </table>
          <div style="background:#0a0a20;border-left:3px solid ${resumenPago.startsWith("SÍ") ? "#4ade80" : "#f87171"};padding:14px 16px;border-radius:8px;margin-top:18px">
            <p style="color:#8a7a6a;font-size:12px;margin:0 0 6px">Comprobación automática en NOWPayments</p>
            <p style="margin:0;line-height:1.6;font-size:14px">${safeResumen}</p>
          </div>
          ${safeMessage ? `
          <hr style="border-color:#c9a84c22;margin:20px 0"/>
          <p style="color:#8a7a6a;font-size:13px;margin-bottom:8px">Mensaje del cliente:</p>
          <p style="background:#0a0a20;padding:16px;border-radius:8px;border-left:3px solid #c9a84c;line-height:1.6">${safeMessage}</p>
          ` : ""}
          <hr style="border-color:#c9a84c22;margin:20px 0"/>
          <p style="color:#c9a84c;font-size:13px;font-weight:bold">Qué hacer:</p>
          <p style="color:#8a7a6a;font-size:13px">1. Mira el recuadro de arriba: ya indica si envió el dinero o no.</p>
          <p style="color:#8a7a6a;font-size:13px">2. Si <strong style="color:#f0e6d3">SÍ pagó</strong>, actívalo con un clic en <a href="https://www.kissingersaraque.com/admin" style="color:#c9a84c">/admin → Pagos</a> (recibirá el correo de bienvenida automáticamente).</p>
          <p style="color:#8a7a6a;font-size:13px">3. Si <strong style="color:#f0e6d3">NO pagó</strong>, respóndele pidiéndole el comprobante de su monedero, o que repita el pago desde su cuenta.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Support email error:", err);
    return NextResponse.json({ ok: false, error: "No se pudo enviar." }, { status: 500 });
  }
}

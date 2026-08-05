import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";
import { sendWelcomeEmail } from "@/lib/emails";

function checkAuth(req: NextRequest): boolean {
  return checkAdmin(req);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { email, activated, notify } = await req.json();

  if (!email) {
    return Response.json({ error: "Email requerido." }, { status: 400 });
  }

  const willActivate = activated ?? true;

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .update({ activated: willActivate })
    .eq("email", email.toLowerCase())
    .select("email, name")
    .maybeSingle();

  if (error) {
    return Response.json({ error: "Error al actualizar usuario." }, { status: 500 });
  }

  // Avisar al alumno solo cuando se le DA acceso (nunca al desactivar)
  let emailSent = false;
  let emailError: string | null = null;
  if (willActivate && notify !== false && user) {
    try {
      emailSent = await sendWelcomeEmail(user.email, user.name ?? "");
      if (!emailSent) emailError = "Faltan las credenciales de correo (EMAIL_USER / EMAIL_PASS).";
    } catch (err) {
      emailError = err instanceof Error ? err.message : "No se pudo enviar el correo.";
      console.error("[activate] Error enviando correo de bienvenida:", err);
    }
  }

  return Response.json({ ok: true, emailSent, emailError });
}

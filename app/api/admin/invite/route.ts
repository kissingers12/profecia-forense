import { NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";
import { sendInvitationEmail } from "@/lib/emails";
import { hashToken } from "@/lib/invitacion";

const BUNDLE_IDS: Record<number, number[]> = {
  100: [101, 102, 103, 104, 105, 106, 107, 108],
  208: [208, 209],
};

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { email: rawEmail, name: rawName, videoIds } = await req.json();
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json({ error: "El correo no es válido." }, { status: 400 });
  }
  const ids = Array.isArray(videoIds) ? videoIds.map(Number).filter((n) => !isNaN(n)) : [];
  if (ids.length === 0) {
    return Response.json({ error: "Selecciona al menos una clase." }, { status: 400 });
  }
  const allIds = [...new Set(ids.flatMap((v) => BUNDLE_IDS[v] ?? [v]))];

  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("email, name, plan")
    .eq("email", email)
    .maybeSingle();

  // Invitación anterior sin usar: la persona aún no ha creado su contraseña
  const { data: pendiente } = await supabaseAdmin
    .from("activity_logs")
    .select("id")
    .eq("user_name", "INVITACION")
    .eq("user_email", email)
    .not("action", "like", "usada:%")
    .not("action", "like", "anulada:%")
    .limit(1);

  const name = (typeof rawName === "string" && rawName.trim()) || existing?.name || email.split("@")[0];
  let necesitaClave = false;

  if (!existing) {
    // Contraseña aleatoria imposible de adivinar: la persona pone la suya desde el enlace
    const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
    const { error } = await supabaseAdmin.from("users").insert({
      email,
      name,
      password_hash: passwordHash,
      plan: "clase_individual",
      activated: true,
    });
    if (error) return Response.json({ error: `No se pudo crear la cuenta: ${error.message}` }, { status: 500 });
    necesitaClave = true;
  } else {
    await supabaseAdmin.from("users").update({ activated: true }).eq("email", email);
    necesitaClave = (pendiente ?? []).length > 0;
  }

  const { error: cpError } = await supabaseAdmin
    .from("class_purchases")
    .upsert(allIds.map((v) => ({ user_email: email, video_id: v })), { onConflict: "user_email,video_id" });
  if (cpError) return Response.json({ error: cpError.message }, { status: 500 });

  let link = "https://www.kissingersaraque.com/login";
  if (necesitaClave) {
    // Un solo enlace válido por persona: los anteriores dejan de funcionar
    const { data: viejas } = await supabaseAdmin
      .from("activity_logs")
      .select("id, action")
      .eq("user_name", "INVITACION")
      .eq("user_email", email)
      .not("action", "like", "usada:%")
      .not("action", "like", "anulada:%");
    for (const v of viejas ?? []) {
      await supabaseAdmin.from("activity_logs").update({ action: `anulada:${v.action}` }).eq("id", v.id);
    }

    const token = crypto.randomBytes(24).toString("base64url");
    await supabaseAdmin.from("activity_logs").insert({
      user_email: email,
      user_name: "INVITACION",
      action: hashToken(token),
    });
    link = `https://www.kissingersaraque.com/invitacion?token=${token}`;
  }

  await supabaseAdmin.from("activity_logs").insert({
    user_email: email,
    user_name: "ADMIN",
    action: `invitación a clase(s) ${allIds.join(",")}`,
  });

  let emailSent = false;
  let emailError: string | null = null;
  try {
    emailSent = await sendInvitationEmail(email, name, allIds, link, necesitaClave);
    if (!emailSent) emailError = "Faltan las credenciales de correo (EMAIL_USER / EMAIL_PASS).";
  } catch (err) {
    emailError = err instanceof Error ? err.message : "No se pudo enviar el correo.";
  }

  return Response.json({
    ok: true,
    link,
    necesitaClave,
    yaTeniaCuenta: !!existing,
    videos: allIds,
    emailSent,
    emailError,
  });
}

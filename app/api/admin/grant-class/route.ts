import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";
import { sendClaseIndividualWelcomeEmail } from "@/lib/emails";

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { email, videoId } = await req.json();
  if (!email || !videoId) {
    return Response.json({ error: "Email y videoId son requeridos." }, { status: 400 });
  }

  const vid = Number(videoId);
  if (isNaN(vid)) {
    return Response.json({ error: "videoId debe ser un número." }, { status: 400 });
  }

  // Bundles: videoId 100 unlocks 101-108, videoId 208 unlocks 208+209
  const BUNDLE_IDS: Record<number, number[]> = {
    100: [101, 102, 103, 104, 105, 106, 107, 108],
    208: [208, 209],
  };
  const idsToInsert = BUNDLE_IDS[vid] ?? [vid];

  const rows = idsToInsert.map((v) => ({ user_email: email.toLowerCase(), video_id: v }));
  const { error: cpError } = await supabaseAdmin
    .from("class_purchases")
    .upsert(rows, { onConflict: "user_email,video_id" });

  if (cpError) {
    return Response.json({ error: cpError.message }, { status: 500 });
  }

  // Consultar ANTES de activar para saber si es la primera vez
  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("name, activated")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  await supabaseAdmin
    .from("users")
    .update({ activated: true })
    .eq("email", email.toLowerCase());

  await supabaseAdmin.from("activity_logs").insert({
    user_email: email.toLowerCase(),
    user_name: "ADMIN",
    action: `acceso manual a clase(s) ${idsToInsert.join(",")}`,
  }).then(() => {});

  // Enviar correo solo si es la primera activación
  let emailSent = false;
  if (existingUser && !existingUser.activated) {
    try {
      emailSent = await sendClaseIndividualWelcomeEmail(
        email.toLowerCase(),
        existingUser.name ?? "",
        idsToInsert,
      );
    } catch { /* no bloquear si falla el correo */ }
  }

  return Response.json({ ok: true, videos: idsToInsert, emailSent });
}

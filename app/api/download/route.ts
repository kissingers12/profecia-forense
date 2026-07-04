import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const ALLOWED_FILES: Record<string, string> = {
  pdf:  "manual-escuchar-dios.pdf",
  epub: "manual-escuchar-dios.epub",
};

export async function POST(req: NextRequest) {
  const { email, type } = await req.json();

  if (!email || !ALLOWED_FILES[type]) {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Verify user is escuela and activated
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("plan, activated")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user || !user.activated || user.plan !== "escuela") {
    return Response.json({ error: "Acceso no autorizado." }, { status: 403 });
  }

  // Generate a signed URL valid for 60 seconds
  const { data, error } = await supabaseAdmin.storage
    .from("libros")
    .createSignedUrl(ALLOWED_FILES[type], 60);

  if (error || !data?.signedUrl) {
    console.error("[download] Supabase storage error:", error?.message);
    return Response.json({ error: "No se pudo generar el link de descarga." }, { status: 500 });
  }

  return Response.json({ url: data.signedUrl });
}

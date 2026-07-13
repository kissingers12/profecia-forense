import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) return Response.json({ error: "Código requerido." }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("download_codes")
    .select("id, file_url, file_name, used")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();

  if (!data) return Response.json({ error: "Código incorrecto. Verifica e intenta de nuevo." }, { status: 404 });
  if (data.used) return Response.json({ error: "Este código ya fue utilizado." }, { status: 400 });

  await supabaseAdmin
    .from("download_codes")
    .update({ used: true, used_at: new Date().toISOString() })
    .eq("id", data.id);

  return Response.json({ fileUrl: data.file_url, fileName: data.file_name });
}

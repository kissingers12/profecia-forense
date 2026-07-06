import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("video_progress")
    .select("video_id")
    .eq("user_email", email.toLowerCase());

  return Response.json({ watchedIds: (data ?? []).map((r) => r.video_id) });
}

export async function POST(req: NextRequest) {
  const { email, videoId } = await req.json();
  if (!email || videoId === undefined) return Response.json({ error: "Datos incompletos." }, { status: 400 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("activated, plan")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user?.activated) return Response.json({ error: "No autorizado." }, { status: 403 });

  await supabaseAdmin.from("video_progress").upsert(
    { user_email: email.toLowerCase(), video_id: videoId, plan: user.plan },
    { onConflict: "user_email,video_id" }
  );

  return Response.json({ success: true });
}

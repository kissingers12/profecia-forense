import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function getActivatedUser(email: string) {
  const { data } = await supabaseAdmin
    .from("users")
    .select("email, name, activated")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return data;
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

  const user = await getActivatedUser(email);
  if (!user || !user.activated) return Response.json({ error: "Acceso no autorizado." }, { status: 403 });

  const { data: posts, error } = await supabaseAdmin
    .from("forum_posts")
    .select("id, user_email, user_name, question, answer, created_at, answered_at, responder_name")
    .eq("hidden", false)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: "Error al cargar el foro." }, { status: 500 });
  return Response.json({ posts });
}

export async function POST(req: NextRequest) {
  const { email, question } = await req.json();
  if (!email || !question?.trim()) return Response.json({ error: "Datos incompletos." }, { status: 400 });
  if (question.trim().length > 500) return Response.json({ error: "La pregunta es demasiado larga." }, { status: 400 });

  const user = await getActivatedUser(email);
  if (!user || !user.activated) return Response.json({ error: "Acceso no autorizado." }, { status: 403 });

  const { error } = await supabaseAdmin.from("forum_posts").insert({
    user_email: user.email,
    user_name: user.name,
    question: question.trim(),
  });

  if (error) return Response.json({ error: "Error al publicar la pregunta." }, { status: 500 });
  return Response.json({ success: true });
}

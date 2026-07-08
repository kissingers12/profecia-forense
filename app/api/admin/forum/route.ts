import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function checkAuth(req: NextRequest): boolean {
  return (req.headers.get("x-admin-password") ?? "") === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { data: posts, error } = await supabaseAdmin
    .from("forum_posts")
    .select("id, user_email, user_name, question, answer, hidden, created_at, answered_at, responder_name")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: "Error al cargar el foro." }, { status: 500 });
  return Response.json({ posts });
}

// Answer a post
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { postId, answer, responderName } = await req.json();
  if (!postId || !answer?.trim()) return Response.json({ error: "Datos incompletos." }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("forum_posts")
    .update({
      answer: answer.trim(),
      answered_at: new Date().toISOString(),
      responder_name: responderName ?? "Kissingers",
    })
    .eq("id", postId);

  if (error) return Response.json({ error: "Error al guardar la respuesta." }, { status: 500 });
  return Response.json({ success: true });
}

// Hide / show a post
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { postId, hidden } = await req.json();
  if (postId === undefined || hidden === undefined) return Response.json({ error: "Datos incompletos." }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("forum_posts")
    .update({ hidden })
    .eq("id", postId);

  if (error) return Response.json({ error: "Error al actualizar." }, { status: 500 });
  return Response.json({ success: true });
}

// Delete a post permanently
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { postId } = await req.json();
  if (!postId) return Response.json({ error: "Datos incompletos." }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("forum_posts")
    .delete()
    .eq("id", postId);

  if (error) return Response.json({ error: "Error al eliminar." }, { status: 500 });
  return Response.json({ success: true });
}

import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return Response.json({ error: "No autenticado." }, { status: 401 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, email, name, plan, activated")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) return Response.json({ error: "Usuario no encontrado." }, { status: 404 });

  return Response.json({ user });
}

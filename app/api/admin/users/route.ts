import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";

function checkAuth(req: NextRequest): boolean {
  return checkAdmin(req);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name, plan, activated, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: "Error al obtener usuarios.", detail: error.message }, { status: 500 });
  }

  return Response.json({ users });
}

// Eliminar un usuario NO activado (registros que nunca pagaron).
// Así, si vuelve en el futuro, puede registrarse de nuevo y elegir otro plan.
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email) return Response.json({ error: "Email requerido." }, { status: 400 });

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, activated")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) return Response.json({ error: "Usuario no encontrado." }, { status: 404 });
  if (user.activated) {
    return Response.json({ error: "No se puede eliminar un cliente activado. Desactívalo primero." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("users").delete().eq("id", user.id);
  if (error) return Response.json({ error: "Error al eliminar." }, { status: 500 });

  return Response.json({ success: true });
}

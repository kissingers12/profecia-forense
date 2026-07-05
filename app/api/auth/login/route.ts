import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: "Datos incompletos." }, { status: 400 });
  }

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id, email, name, plan, activated, password_hash")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error || !user) {
    return Response.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return Response.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  }

  // Log the login event (silent fail — doesn't block login)
  supabaseAdmin.from("activity_logs").insert({
    user_email: user.email,
    user_name: user.name,
    action: "login",
  }).then(() => {});

  return Response.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      activated: user.activated,
    },
  });
}

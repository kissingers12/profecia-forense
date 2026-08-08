import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";

const VIDEO_TITLES: Record<number, string> = {
  1: "El Secreto de la Meditación 1",
  2: "El Secreto de la Meditación 2",
  3: "El Secreto de la Meditación 3",
  4: "El Secreto de la Meditación 4",
  5: "4 horas instrumental para meditar",
  6: "La Meditación de los profetas para salir del cuerpo",
  7: "La Llave de la Ciencia",
  101: "Escuela #1 Desbloqueando los ojos espirituales",
  102: "Escuela #2 Cómo recibir Espíritu de Profecía",
  103: "Escuela #3 Primeros pasos profetizando",
  104: "Escuela #4 La honra y el llamado a profetizar",
  105: "Escuela #5 Profecía por interpretación",
  106: "Escuela #6 Profecía al tocar una persona",
  107: "Escuela #7 Ver letras en el espíritu y nombres",
  108: "Escuela #8 Abrir los ojos y tener visiones",
  201: "LA LLAVE DE LA CIENCIA: Esto activa lo profético",
  202: "La Meditación de los profetas para salir del cuerpo",
  203: "Actos Proféticos 1",
  204: "Actos Proféticos 2",
  205: "Acto Profético 3",
  206: "Ángeles, Fantasmas y Sombras",
  207: "El secreto de la prosperidad",
  208: "(Parte 1) Esto me hizo millonario",
  209: "(Parte 2) Esto me hizo millonario",
  210: "Si lo crees ya eres profeta",
  301: "Profecía Forense 1",
};

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { data: rows } = await supabaseAdmin
    .from("video_progress")
    .select("user_email, video_id, plan, watched_at")
    .order("user_email");

  const { data: users } = await supabaseAdmin
    .from("users")
    .select("email, name, plan, activated");

  const userMap = new Map((users ?? []).map((u) => [u.email, u]));

  const grouped: Record<string, {
    email: string;
    name: string;
    plan: string;
    activated: boolean;
    videos: { id: number; title: string; watchedAt: string }[];
  }> = {};

  for (const row of rows ?? []) {
    if (!grouped[row.user_email]) {
      const u = userMap.get(row.user_email);
      grouped[row.user_email] = {
        email: row.user_email,
        name: u?.name ?? row.user_email,
        plan: u?.plan ?? row.plan ?? "",
        activated: u?.activated ?? false,
        videos: [],
      };
    }
    grouped[row.user_email].videos.push({
      id: row.video_id,
      title: VIDEO_TITLES[row.video_id] ?? `Vídeo ${row.video_id}`,
      watchedAt: row.watched_at ?? "",
    });
  }

  return Response.json({ progress: Object.values(grouped) });
}

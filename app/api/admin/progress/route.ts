import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAdmin } from "@/lib/admin-auth";
import { CLASS_NAMES } from "@/lib/clases";

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

  const [{ data: rows }, { data: users }, { data: compras }, { data: entradas }] = await Promise.all([
    supabaseAdmin.from("video_progress").select("user_email, video_id, plan, created_at"),
    supabaseAdmin.from("users").select("email, name, plan, activated"),
    supabaseAdmin.from("class_purchases").select("user_email, video_id"),
    // Visitas al panel (VISITA) e inicios de sesión con contraseña (login / course_access)
    supabaseAdmin
      .from("activity_logs")
      .select("user_email, created_at")
      .or("user_name.eq.VISITA,action.eq.login,action.eq.course_access")
      .order("created_at", { ascending: false })
      .limit(10000),
  ]);

  const userMap = new Map((users ?? []).map((u) => [u.email.toLowerCase(), u]));

  const vistos = new Map<string, { id: number; watchedAt: string }[]>();
  for (const r of rows ?? []) {
    const k = r.user_email.toLowerCase();
    if (!vistos.has(k)) vistos.set(k, []);
    vistos.get(k)!.push({ id: r.video_id, watchedAt: r.created_at ?? "" });
  }

  const desbloqueadas = new Map<string, number[]>();
  for (const c of compras ?? []) {
    const k = c.user_email.toLowerCase();
    if (!desbloqueadas.has(k)) desbloqueadas.set(k, []);
    desbloqueadas.get(k)!.push(c.video_id);
  }

  const visitas = new Map<string, string[]>();
  for (const e of entradas ?? []) {
    const k = (e.user_email ?? "").toLowerCase();
    if (!visitas.has(k)) visitas.set(k, []);
    visitas.get(k)!.push(e.created_at);
  }

  // Todos los activos (aunque no hayan visto nada) y cualquiera con progreso
  const emails = new Set<string>([
    ...(users ?? []).filter((u) => u.activated).map((u) => u.email.toLowerCase()),
    ...vistos.keys(),
  ]);

  const progress = [...emails].map((email) => {
    const u = userMap.get(email);
    const plan = u?.plan ?? "";
    const esClase = plan === "clase_individual";
    const titulo = (id: number) =>
      (esClase ? CLASS_NAMES[id] : VIDEO_TITLES[id]) ?? CLASS_NAMES[id] ?? `Vídeo ${id}`;

    const videos = (vistos.get(email) ?? [])
      .sort((a, b) => a.watchedAt.localeCompare(b.watchedAt))
      .map((v) => ({ id: v.id, title: titulo(v.id), watchedAt: v.watchedAt }));
    const vistoEn = new Map(videos.map((v) => [v.id, v.watchedAt]));

    const fechas = visitas.get(email) ?? [];
    const dias = new Set(fechas.map((f) => f.slice(0, 10)));

    return {
      email,
      name: u?.name ?? email,
      plan,
      activated: u?.activated ?? false,
      videos,
      unlocked: esClase
        ? (desbloqueadas.get(email) ?? []).map((id) => ({
            id,
            title: titulo(id),
            watchedAt: vistoEn.get(id) ?? null,
          }))
        : null,
      lastSeen: fechas[0] ?? null,
      firstSeen: fechas[fechas.length - 1] ?? null,
      daysActive: dias.size,
    };
  });

  return Response.json({ progress });
}

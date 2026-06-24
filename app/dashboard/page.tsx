"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, PlayCircle, BookOpen, Lock, CheckCircle, ChevronRight, Eye } from "lucide-react";
import { getSession, clearSession, PLAN_LABELS, type UserSession } from "@/lib/auth";

type Lesson = {
  id: number;
  title: string;
  duration: string;
  unlocked: boolean;
  vimeoId: string | null;
};

type Group = {
  groupTitle: string;
  lessons: Lesson[];
};

const meditacionesContent: Lesson[] = [
  { id: 1, title: "El Secreto de la Meditación 1", duration: "", unlocked: true, vimeoId: "1204206028" },
  { id: 2, title: "El Secreto de la Meditación 2", duration: "", unlocked: true, vimeoId: "1204206979" },
  { id: 3, title: "El Secreto de la Meditación 3", duration: "", unlocked: true, vimeoId: "1204224003" },
  { id: 4, title: "El Secreto de la Meditación 4", duration: "", unlocked: true, vimeoId: "1204242854" },
  { id: 5, title: "La Llave de la Ciencia", duration: "", unlocked: true, vimeoId: "1204243775" },
  { id: 6, title: "La Meditación de los profetas para salir del cuerpo", duration: "", unlocked: true, vimeoId: "1204243894" },
  { id: 7, title: "4 horas instrumental para meditar", duration: "", unlocked: true, vimeoId: "1204255913" },
  { id: 8, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
];

const escuelaGroups: Group[] = [
  {
    groupTitle: "Los Secretos de la Meditación",
    lessons: [
      { id: 1, title: "El Secreto de la Meditación 1", duration: "", unlocked: true, vimeoId: "1204206028" },
      { id: 2, title: "El Secreto de la Meditación 2", duration: "", unlocked: true, vimeoId: "1204206979" },
      { id: 3, title: "El Secreto de la Meditación 3", duration: "", unlocked: true, vimeoId: "1204224003" },
      { id: 4, title: "El Secreto de la Meditación 4", duration: "", unlocked: true, vimeoId: "1204242854" },
      { id: 5, title: "La Llave de la Ciencia", duration: "", unlocked: true, vimeoId: "1204243775" },
      { id: 6, title: "La Meditación de los profetas para salir del cuerpo", duration: "", unlocked: true, vimeoId: "1204243894" },
      { id: 7, title: "4 horas instrumental para meditar", duration: "", unlocked: true, vimeoId: "1204255913" },
    ],
  },
  {
    groupTitle: "Próximamente",
    lessons: [
      { id: 101, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
      { id: 102, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
      { id: 103, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
      { id: 104, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
      { id: 105, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
    ],
  },
  {
    groupTitle: "Próximamente",
    lessons: [
      { id: 201, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
      { id: 202, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
      { id: 203, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
      { id: 204, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
      { id: 205, title: "Próximamente nueva enseñanza", duration: "", unlocked: false, vimeoId: null },
    ],
  },
];

const allEscuelaLessons = escuelaGroups.flatMap((g) => g.lessons);

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push("/login");
    } else {
      setSession(s);
    }
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  if (!session) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  const isEscuela = session.plan === "escuela";
  const flatContent = isEscuela ? allEscuelaLessons : meditacionesContent;
  const planLabel = session.plan ? PLAN_LABELS[session.plan] : "Sin plan";
  const activeLesson_obj = flatContent.find((l) => l.id === activeLesson);

  function LessonButton({ lesson, index }: { lesson: Lesson; index: number }) {
    return (
      <button
        onClick={() => lesson.unlocked && setActiveLesson(lesson.id)}
        className={`w-full card-dark rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-200 group ${
          activeLesson === lesson.id
            ? "border-[#c9a84c]/50 bg-[#c9a84c]/5"
            : lesson.unlocked
            ? "hover:border-[#c9a84c]/30 cursor-pointer"
            : "opacity-60 cursor-default"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition-colors ${
            activeLesson && lesson.id < activeLesson && lesson.unlocked
              ? "bg-[#c9a84c] text-[#050510]"
              : activeLesson === lesson.id
              ? "bg-[#c9a84c]/20 border border-[#c9a84c] text-[#c9a84c]"
              : "bg-white/5 text-[#6a5a4a]"
          }`}
        >
          {activeLesson && lesson.id < activeLesson && lesson.unlocked ? (
            <CheckCircle size={16} />
          ) : (
            <span>{String(index + 1).padStart(2, "0")}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${activeLesson === lesson.id ? "text-[#c9a84c]" : "text-white"}`}>
            {lesson.title}
          </p>
          {lesson.duration && <p className="text-[#6a5a4a] text-xs mt-0.5">{lesson.duration}</p>}
        </div>
        {lesson.unlocked ? (
          <div className="flex items-center gap-2 shrink-0">
            {activeLesson === lesson.id && <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />}
            <Eye size={16} className="text-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity" />
            <ChevronRight size={16} className="text-[#6a5a4a]" />
          </div>
        ) : (
          <Lock size={16} className="text-[#4a3a2a] shrink-0" />
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510]">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/95 backdrop-blur-md border-b border-[#c9a84c]/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c9a84c]/40">
              <Image src="/logo.jpg" alt="Profecía Forense" width={32} height={32} className="object-cover" />
            </div>
            <span className="text-white font-bold text-sm hidden sm:block">
              Profecía <span className="text-[#c9a84c]">Forense</span>
            </span>
          </a>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-semibold">{session.name}</p>
              <p className="text-[#6a5a4a] text-xs">{session.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-outline-gold px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut size={14} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-1">Bienvenido de vuelta</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Hola, {session.name.split(" ")[0]} 👋</h1>
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/25 rounded-full px-4 py-1.5 mt-2">
            <CheckCircle size={14} className="text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold">{planLabel}</span>
          </div>
        </div>

        {/* Progress card */}
        <div className="card-dark rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-white font-bold mb-1">Tu progreso</h3>
            <p className="text-[#8a7a6a] text-sm">
              {activeLesson ? `Clase en curso` : "Continúa donde lo dejaste"}
            </p>
            <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-gold transition-all duration-700"
                style={{ width: `${activeLesson ? Math.round((flatContent.findIndex(l => l.id === activeLesson) + 1) / flatContent.length * 100) : 5}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => setActiveLesson(flatContent[0].id)}
            className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 shrink-0"
          >
            <PlayCircle size={18} />
            {activeLesson ? "Continuar" : "Comenzar"}
          </button>
        </div>

        {/* Video player */}
        {activeLesson && (
          activeLesson_obj?.vimeoId ? (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PlayCircle size={20} className="text-[#c9a84c]" />
                {activeLesson_obj.title}
              </h2>
              <div className="rounded-2xl overflow-hidden border border-[#c9a84c]/20" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <iframe
                  src={`https://player.vimeo.com/video/${activeLesson_obj.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  title={activeLesson_obj.title}
                />
              </div>
              <script src="https://player.vimeo.com/api/player.js" async />
            </div>
          ) : (
            <div className="mb-10 card-dark rounded-2xl p-8 text-center border border-[#c9a84c]/20">
              <PlayCircle size={40} className="text-[#c9a84c]/40 mx-auto mb-3" />
              <p className="text-[#8a7a6a] text-sm">Video próximamente disponible</p>
            </div>
          )
        )}

        {/* Content list */}
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <BookOpen size={20} className="text-[#c9a84c]" />
          Contenido de tu programa
        </h2>

        {isEscuela ? (
          <div className="space-y-10">
            {escuelaGroups.map((group, gi) => (
              <div key={gi}>
                <h3 className="text-[#c9a84c] text-xs font-bold uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-[#c9a84c]/40" />
                  {group.groupTitle}
                  <span className="flex-1 h-px bg-[#c9a84c]/20" />
                </h3>
                <div className="space-y-3">
                  {group.lessons.map((lesson, i) => (
                    <LessonButton key={lesson.id} lesson={lesson} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {meditacionesContent.map((lesson, i) => (
              <LessonButton key={lesson.id} lesson={lesson} index={i} />
            ))}
          </div>
        )}

        {/* Upgrade CTA for meditaciones users */}
        {session.plan === "meditaciones" && (
          <div className="mt-10 card-dark rounded-2xl p-8 text-center border border-[#c9a84c]/20">
            <h3 className="text-xl font-bold text-white mb-2">¿Listo para ir más profundo?</h3>
            <p className="text-[#b8a888] text-sm mb-5 max-w-md mx-auto">
              Accede a la Escuela Avanzada de Profecía con más de 17 enseñanzas, mentoría grupal y acompañamiento real.
            </p>
            <a href="/#programas" className="btn-gold px-7 py-3 rounded-full font-bold text-sm inline-block">
              Ver Escuela Avanzada · $777
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

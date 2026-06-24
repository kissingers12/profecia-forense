"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, PlayCircle, BookOpen, Lock, CheckCircle, ChevronRight, Eye } from "lucide-react";
import { getSession, clearSession, PLAN_LABELS, type UserSession } from "@/lib/auth";

const meditacionesContent = [
  { id: 1, title: "Meditación 1: Silenciando el alma", duration: "28 min", unlocked: true, vimeoId: null },
  { id: 2, title: "Meditación 2: La voz interior del profeta", duration: "35 min", unlocked: true, vimeoId: null },
  { id: 3, title: "Meditación 3: Alineando mente y espíritu", duration: "42 min", unlocked: true, vimeoId: null },
  { id: 4, title: "Meditación 4: Visiones y percepción profética", duration: "31 min", unlocked: true, vimeoId: null },
  { id: 5, title: "Meditación 5: Discernimiento de voces", duration: "38 min", unlocked: true, vimeoId: null },
  { id: 6, title: "Meditación 6: Activación del don profético", duration: "45 min", unlocked: true, vimeoId: null },
  { id: 7, title: "4 horas instrumental para meditar", duration: "4h 00min", unlocked: true, vimeoId: "1204255913" },
];

const escuelaContent = [
  { id: 1, title: "Módulo 1: Fundamentos del llamado profético", duration: "1h 20min", unlocked: true },
  { id: 2, title: "Módulo 2: El lenguaje de Dios — tipos y formas", duration: "1h 45min", unlocked: true },
  { id: 3, title: "Módulo 3: Discernimiento espiritual avanzado", duration: "2h 10min", unlocked: true },
  { id: 4, title: "Módulo 4: Errores comunes del profeta", duration: "1h 30min", unlocked: true },
  { id: 5, title: "Módulo 5: Profecía personal vs. colectiva", duration: "1h 55min", unlocked: true },
  { id: 6, title: "Módulo 6: Activación práctica supervisada", duration: "2h 00min", unlocked: true },
  { id: 7, title: "Módulo 7: Madurez y responsabilidad profética", duration: "1h 40min", unlocked: true },
  { id: 8, title: "Módulo 8: Liderazgo y comunidad profética", duration: "1h 50min", unlocked: true },
];

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

  const content = session.plan === "escuela" ? escuelaContent : meditacionesContent;
  const planLabel = session.plan ? PLAN_LABELS[session.plan] : "Sin plan";

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
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-1">
            Bienvenido de vuelta
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Hola, {session.name.split(" ")[0]} 👋
          </h1>
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
              {activeLesson ? `Clase ${activeLesson} en curso` : "Continúa donde lo dejaste"}
            </p>
            <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-gold transition-all duration-700"
                style={{ width: `${activeLesson ? Math.round((activeLesson / content.length) * 100) : 15}%` }}
              />
            </div>
            <p className="text-xs text-[#6a5a4a] mt-1">
              {activeLesson ?? 1} de {content.length} completadas
            </p>
          </div>
          <button
            onClick={() => setActiveLesson(activeLesson ? activeLesson : 1)}
            className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 shrink-0"
          >
            <PlayCircle size={18} />
            {activeLesson ? "Continuar" : "Comenzar"}
          </button>
        </div>

        {/* Video player */}
        {activeLesson && (() => {
          const lesson = content.find((l) => l.id === activeLesson);
          return lesson?.vimeoId ? (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PlayCircle size={20} className="text-[#c9a84c]" />
                {lesson.title}
              </h2>
              <div className="rounded-2xl overflow-hidden border border-[#c9a84c]/20" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <iframe
                  src={`https://player.vimeo.com/video/${lesson.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  title={lesson.title}
                />
              </div>
              <script src="https://player.vimeo.com/api/player.js" async />
            </div>
          ) : (
            <div className="mb-10 card-dark rounded-2xl p-8 text-center border border-[#c9a84c]/20">
              <PlayCircle size={40} className="text-[#c9a84c]/40 mx-auto mb-3" />
              <p className="text-[#8a7a6a] text-sm">Video próximamente disponible</p>
            </div>
          );
        })()}

        {/* Content list */}
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <BookOpen size={20} className="text-[#c9a84c]" />
          Contenido de tu programa
        </h2>

        <div className="space-y-3">
          {content.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              className={`w-full card-dark rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-200 group ${
                activeLesson === lesson.id
                  ? "border-[#c9a84c]/50 bg-[#c9a84c]/5"
                  : "hover:border-[#c9a84c]/30"
              }`}
            >
              {/* Number / check */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition-colors ${
                  activeLesson && lesson.id < activeLesson
                    ? "bg-[#c9a84c] text-[#050510]"
                    : activeLesson === lesson.id
                    ? "bg-[#c9a84c]/20 border border-[#c9a84c] text-[#c9a84c]"
                    : "bg-white/5 text-[#6a5a4a]"
                }`}
              >
                {activeLesson && lesson.id < activeLesson ? (
                  <CheckCircle size={16} />
                ) : (
                  <span>{String(i + 1).padStart(2, "0")}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${
                  activeLesson === lesson.id ? "text-[#c9a84c]" : "text-white"
                }`}>
                  {lesson.title}
                </p>
                <p className="text-[#6a5a4a] text-xs mt-0.5">{lesson.duration}</p>
              </div>

              {lesson.unlocked ? (
                <div className="flex items-center gap-2 shrink-0">
                  {activeLesson === lesson.id && (
                    <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                  )}
                  <Eye size={16} className="text-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ChevronRight size={16} className="text-[#6a5a4a]" />
                </div>
              ) : (
                <Lock size={16} className="text-[#4a3a2a] shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Upgrade CTA for meditaciones users */}
        {session.plan === "meditaciones" && (
          <div className="mt-10 card-dark rounded-2xl p-8 text-center border border-[#c9a84c]/20">
            <h3 className="text-xl font-bold text-white mb-2">
              ¿Listo para ir más profundo?
            </h3>
            <p className="text-[#b8a888] text-sm mb-5 max-w-md mx-auto">
              Accede a la Escuela Avanzada de Profecía con 8 módulos completos,
              mentoría grupal y certificación ministerial.
            </p>
            <a href="/#programas" className="btn-gold px-7 py-3 rounded-full font-bold text-sm inline-block">
              Ver Escuela Avanzada · $1,200
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

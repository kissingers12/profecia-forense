"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, PlayCircle, BookOpen, Lock, CheckCircle, ChevronRight, Eye, KeyRound, MessageCircle, Video, Download, Gift } from "lucide-react";
import { getSession, clearSession, saveSession, PLAN_LABELS, type UserSession } from "@/lib/auth";

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
    groupTitle: "Nivel Básico",
    lessons: [
      { id: 101, title: "Escuela de profetas #1 Desbloqueando los ojos espirituales", duration: "", unlocked: true, vimeoId: "1204614170" },
      { id: 102, title: "Escuela de Profetas #2 Como recibir Espíritu de Profecía", duration: "", unlocked: true, vimeoId: "1204614262" },
      { id: 103, title: "Escuela de profeta #3 primeros pasos profetizando...Pasa de espectador a profeta", duration: "", unlocked: true, vimeoId: "1204614337" },
      { id: 104, title: "Escuela de Profeta #4 la honra y el llamo a profetizar", duration: "", unlocked: true, vimeoId: "1204614447" },
      { id: 105, title: "Escuela de profeta #5 Profecía por interpretación (parte 1)", duration: "", unlocked: true, vimeoId: "1204615096" },
      { id: 106, title: "Escuela de profetas #6 Profecía al tocar una persona", duration: "", unlocked: true, vimeoId: "1204615280" },
      { id: 107, title: "Escuela de profetas #7 Como ver letras en el espíritu y nombres", duration: "", unlocked: true, vimeoId: "1204615509" },
      { id: 108, title: "Escuela de Profetas #8 abrir los ojos y tener visiones", duration: "", unlocked: true, vimeoId: "1204615620" },
    ],
  },
  {
    groupTitle: "Nivel Intermedio",
    lessons: [
      { id: 1, title: "El Secreto de la Meditación 1", duration: "", unlocked: true, vimeoId: "1204206028" },
      { id: 2, title: "El Secreto de la Meditación 2", duration: "", unlocked: true, vimeoId: "1204206979" },
      { id: 3, title: "El Secreto de la Meditación 3", duration: "", unlocked: true, vimeoId: "1204224003" },
      { id: 4, title: "El Secreto de la Meditación 4", duration: "", unlocked: true, vimeoId: "1204242854" },
      { id: 5, title: "4 horas instrumental para meditar", duration: "", unlocked: true, vimeoId: "1204255913" },
    ],
  },
  {
    groupTitle: "Nivel Avanzado",
    lessons: [
      { id: 201, title: "LA LLAVE DE LA CIENCIA: ESTO ACTIVA LO PROFÉTICO", duration: "", unlocked: true, vimeoId: "1204243775" },
      { id: 202, title: "La Meditación de los profetas para salir del cuerpo", duration: "", unlocked: true, vimeoId: "1204243894" },
      { id: 203, title: "Actos Proféticos 1", duration: "", unlocked: true, vimeoId: "1204621088" },
      { id: 204, title: "Actos Proféticos 2", duration: "", unlocked: true, vimeoId: "1204621216" },
      { id: 205, title: "Acto profético 3", duration: "", unlocked: true, vimeoId: "1204621410" },
      { id: 206, title: "Angeles, Fantasmas y sombras", duration: "", unlocked: true, vimeoId: "1204621581" },
      { id: 207, title: "El secreto de la prosperidad", duration: "", unlocked: true, vimeoId: "1204620987" },
      { id: 208, title: "(Parte 1) esto me hizo millonario", duration: "", unlocked: true, vimeoId: "1204621966" },
      { id: 209, title: "(Parte 2) esto me hizo millonario", duration: "", unlocked: true, vimeoId: "1204621894" },
      { id: 210, title: "Si lo crees ya eres profeta", duration: "", unlocked: true, vimeoId: "1204621749" },
      { id: 211, title: "Próximamente", duration: "", unlocked: false, vimeoId: null },
    ],
  },
];

const allEscuelaLessons = escuelaGroups.flatMap((g) => g.lessons);

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [watchedIds, setWatchedIds] = useState<Set<number>>(new Set());
  const [activationCode, setActivationCode] = useState("");
  const [activationError, setActivationError] = useState("");
  const [activationLoading, setActivationLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [supportFailed, setSupportFailed] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push("/login");
      return;
    }
    setSession(s);
    // Re-validate from Supabase to get fresh activated status
    fetch("/api/auth/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: s.email }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          const updated = { ...s, activated: data.user.activated, plan: data.user.plan };
          saveSession(updated);
          setSession(updated);
          if (data.user.activated) {
            // Load saved video progress
            fetch(`/api/progress?email=${encodeURIComponent(s.email)}`)
              .then((r) => r.json())
              .then((pd) => {
                if (pd.watchedIds?.length) {
                  setWatchedIds(new Set(pd.watchedIds));
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {});
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  const markWatched = (lessonId: number) => {
    if (watchedIds.has(lessonId) || !session) return;
    setWatchedIds((prev) => new Set(prev).add(lessonId));
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.email, videoId: lessonId }),
    }).catch(() => {});
  };

  const handleGetPayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await fetch("/api/payment/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.email }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        setPaymentUrl(data.paymentUrl);
      }
    } catch {
      // silently ignore, user can retry
    }
    setPaymentLoading(false);
  };

  const handleUpgradePlan = async () => {
    setUpgradeLoading(true);
    setUpgradeError("");
    try {
      const res = await fetch("/api/auth/change-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.email, newPlan: "escuela" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpgradeError(data.error ?? "Error al cambiar el plan.");
      } else {
        const updated = { ...session!, plan: "escuela" as const };
        saveSession(updated);
        setSession(updated);
        setPaymentUrl(data.paymentUrl);
      }
    } catch {
      setUpgradeError("Error de conexión. Intenta de nuevo.");
    }
    setUpgradeLoading(false);
  };

  const handleSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    setSupportFailed(false);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.name,
          email: session?.email,
          plan: session?.plan,
          message: supportMessage,
        }),
      });
      if (res.ok) {
        setSupportSent(true);
      } else {
        setSupportFailed(true);
      }
    } catch {
      setSupportFailed(true);
    }
    setSupportLoading(false);
  };

  const handleActivation = async () => {
    setActivationLoading(true);
    setActivationError("");
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.email }),
      });
      const data = await res.json();
      if (data.activated) {
        const updated = { ...session!, activated: true };
        saveSession(updated);
        setSession(updated);
      } else if (!res.ok && data.error) {
        setActivationError("Error del servidor. Intenta de nuevo en unos minutos o usa el soporte.");
      } else {
        setActivationError(data.message ?? "No encontramos un pago confirmado. Si acabas de pagar, espera unos minutos e intenta de nuevo.");
      }
    } catch {
      setActivationError("Error de conexión. Intenta de nuevo.");
    }
    setActivationLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session.activated) {
    return (
      <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center px-4">
        {/* Support modal */}
        {showSupport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md card-dark rounded-2xl p-8">
              {supportSent ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto">
                    <CheckCircle size={28} className="text-[#c9a84c]" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Mensaje enviado</h3>
                  <p className="text-[#8a7a6a] text-sm">
                    Recibimos tu solicitud. Te contactaremos a <span className="text-[#c9a84c]">{session.email}</span> en las próximas horas para verificar tu pago y darte acceso.
                  </p>
                  <button
                    onClick={() => { setShowSupport(false); setSupportSent(false); setSupportMessage(""); }}
                    className="btn-gold w-full py-3 rounded-xl font-bold mt-2"
                  >
                    Cerrar
                  </button>
                </div>
              ) : supportFailed ? (
                <div className="text-center space-y-4">
                  <h3 className="text-white font-bold text-lg">No pudimos enviar el mensaje</h3>
                  <p className="text-[#8a7a6a] text-sm">
                    Hubo un problema técnico. Contáctanos directamente con tu email <span className="text-[#c9a84c]">{session.email}</span> y te activamos en minutos:
                  </p>
                  <a
                    href={`mailto:100x100cristianos@gmail.com?subject=Problema%20con%20acceso&body=Mi%20email%20de%20registro%20es%3A%20${encodeURIComponent(session.email)}`}
                    className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    Enviar email →
                  </a>
                  <button
                    onClick={() => { setSupportFailed(false); }}
                    className="w-full text-center text-xs text-[#6a5a4a] hover:text-[#c9a84c] transition-colors"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-white font-bold text-lg mb-1">¿Problemas con tu acceso?</h3>
                  <p className="text-[#8a7a6a] text-sm mb-6">
                    Si ya realizaste tu pago y no puedes ingresar, escríbenos. Verificaremos tu pago y te activaremos manualmente.
                  </p>
                  <form onSubmit={handleSupport} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                        Tu email de pago
                      </label>
                      <input
                        type="text"
                        value={session.email}
                        readOnly
                        className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-[#c9a84c] text-sm cursor-default"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                        Cuéntanos qué pasó <span className="text-[#4a3a2a] normal-case font-normal">(opcional)</span>
                      </label>
                      <textarea
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Ej: Pagué ayer con Bitcoin y aún no tengo acceso..."
                        rows={3}
                        className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={supportLoading}
                      className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      {supportLoading
                        ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                        : "Enviar solicitud de ayuda"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSupport(false)}
                      className="w-full text-center text-xs text-[#6a5a4a] hover:text-[#c9a84c] transition-colors"
                    >
                      Cancelar
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mb-4">
              <KeyRound size={28} className="text-[#c9a84c]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Activa tu acceso</h1>
            <p className="text-[#8a7a6a] text-sm text-center max-w-xs">
              Si ya realizaste tu pago, presiona el botón para verificarlo automáticamente y desbloquear tu contenido.
            </p>
          </div>
          <div className="card-dark rounded-2xl p-8 space-y-5">
            {/* Opción 1: Ya pagué */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Ya realicé mi pago</p>
              {activationError && <p className="text-red-400 text-xs">{activationError}</p>}
              <button
                type="button"
                onClick={handleActivation}
                disabled={activationLoading}
                className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {activationLoading
                  ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                  : <><CheckCircle size={16} />Verificar mi pago</>}
              </button>
              <p className="text-[#6a5a4a] text-xs text-center">
                El sistema verificará tu pago automáticamente
              </p>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              {/* Opción 2: Aún no he pagado */}
              <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Aún no he pagado</p>
              {paymentUrl ? (
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm bg-white/5 border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all"
                >
                  Ir a completar mi pago →
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleGetPayment}
                  disabled={paymentLoading}
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm bg-white/5 border border-[#c9a84c]/20 text-[#c9a84c] hover:border-[#c9a84c]/50 transition-all"
                >
                  {paymentLoading
                    ? <span className="w-4 h-4 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
                    : "Quiero pagar ahora"}
                </button>
              )}

              {/* Opción 3: Pagué pero no funciona */}
              <button
                type="button"
                onClick={() => setShowSupport(true)}
                className="w-full text-center text-sm text-[#8a7a6a] hover:text-[#c9a84c] transition-colors py-1"
              >
                ¿Pagaste y la verificación no funciona?
              </button>
            </div>

            {/* Opción 4: Cambiar a Escuela Avanzada (solo si está en plan meditaciones) */}
            {session.plan === "meditaciones" && (
              <div className="border-t border-white/5 pt-4 space-y-3">
                <p className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">
                  ¿Quieres el Nivel Avanzado?
                </p>
                <p className="text-[#8a7a6a] text-xs leading-relaxed">
                  Actualmente tienes seleccionado el plan de Meditación ($333). Si prefieres el programa completo de la Escuela Avanzada, puedes cambiar aquí.
                </p>
                {upgradeError && <p className="text-red-400 text-xs">{upgradeError}</p>}
                <button
                  type="button"
                  onClick={handleUpgradePlan}
                  disabled={upgradeLoading}
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm border border-[#c9a84c]/60 text-[#c9a84c] bg-[#c9a84c]/5 hover:bg-[#c9a84c]/15 transition-all"
                >
                  {upgradeLoading
                    ? <span className="w-4 h-4 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
                    : "Cambiar a Escuela Avanzada — $777"}
                </button>
                <p className="text-[#6a5a4a] text-[10px] text-center">
                  Esto actualizará tu plan. Tu cuenta anterior de meditación quedará cancelada.
                </p>
              </div>
            )}
          </div>
          <div className="text-center mt-6">
            <button onClick={handleLogout} className="text-[#6a5a4a] text-xs hover:text-[#c9a84c]">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEscuela = session.plan === "escuela";
  const flatContent = isEscuela ? allEscuelaLessons : meditacionesContent;
  const planLabel = session.plan ? PLAN_LABELS[session.plan] : "Sin plan";
  const activeLesson_obj = flatContent.find((l) => l.id === activeLesson);

  function LessonButton({ lesson, index }: { lesson: Lesson; index: number }) {
    const isActive = activeLesson === lesson.id;
    const isWatched = watchedIds.has(lesson.id);
    return (
      <>
        <button
          onClick={() => {
            if (!lesson.unlocked) return;
            if (!isActive) markWatched(lesson.id);
            setActiveLesson(isActive ? null : lesson.id);
          }}
          className={`w-full card-dark rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-200 group ${
            isActive
              ? "border-[#c9a84c]/50 bg-[#c9a84c]/5"
              : lesson.unlocked
              ? "hover:border-[#c9a84c]/30 cursor-pointer"
              : "opacity-60 cursor-default"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition-colors ${
            isWatched && !isActive
              ? "bg-[#c9a84c] text-[#050510]"
              : isActive
              ? "bg-[#c9a84c]/20 border border-[#c9a84c] text-[#c9a84c]"
              : "bg-white/5 text-[#6a5a4a]"
          }`}>
            {isWatched && !isActive ? (
              <CheckCircle size={16} />
            ) : isActive ? (
              <PlayCircle size={16} />
            ) : (
              <span>{String(index + 1).padStart(2, "0")}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm truncate ${isActive ? "text-[#c9a84c]" : "text-white"}`}>
              {lesson.title}
            </p>
            {lesson.duration && <p className="text-[#6a5a4a] text-xs mt-0.5">{lesson.duration}</p>}
          </div>
          {lesson.unlocked ? (
            <div className="flex items-center gap-2 shrink-0">
              {isActive && <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />}
              <Video size={15} className={`text-[#c9a84c] transition-opacity ${isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`} />
              <ChevronRight size={16} className={`text-[#6a5a4a] transition-transform duration-200 ${isActive ? "rotate-90" : ""}`} />
            </div>
          ) : (
            <Lock size={16} className="text-[#4a3a2a] shrink-0" />
          )}
        </button>

        {/* Reproductor inline — aparece justo debajo de la lección seleccionada */}
        {isActive && (
          lesson.vimeoId ? (
            <div className="rounded-2xl overflow-hidden border border-[#c9a84c]/25 mt-2" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
              <iframe
                src={`https://player.vimeo.com/video/${lesson.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title={lesson.title}
              />
            </div>
          ) : (
            <div className="card-dark rounded-2xl p-6 text-center border border-[#c9a84c]/20 mt-2">
              <PlayCircle size={36} className="text-[#c9a84c]/40 mx-auto mb-2" />
              <p className="text-[#8a7a6a] text-sm">Video próximamente disponible</p>
            </div>
          )
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510]">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/95 backdrop-blur-md border-b border-[#c9a84c]/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c9a84c]/40">
              <Image src="/logo.jpg" alt="100x100Cristianos" width={32} height={32} className="object-cover" />
            </div>
            <span className="text-white font-bold text-sm hidden sm:block">
              100x100 <span className="text-[#c9a84c]">Cristianos</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/foro"
              className="btn-outline-gold px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5"
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline">Comunidad</span>
            </a>
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-semibold">{session.name}</p>
              <p className="text-[#6a5a4a] text-xs">{session.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#6a5a4a] hover:text-[#c9a84c] transition-colors p-2"
              title="Salir"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* WhatsApp group banner — solo Escuela Avanzada */}
        {isEscuela && (
          <a
            href="https://chat.whatsapp.com/KqBYHK6h6pHJdC03es4uZK?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 mb-8 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 p-5 hover:bg-[#25D366]/15 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">Únete al grupo de WhatsApp</p>
              <p className="text-[#25D366] text-xs mt-0.5">Escuela Avanzada de Profetas · Toca para entrar</p>
            </div>
            <ChevronRight size={18} className="text-[#25D366] shrink-0" />
          </a>
        )}

        {/* Welcome */}
        <div className="mb-10">
          <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-1">Bienvenido de vuelta</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Hola, {session.name.split(" ")[0]} 👋</h1>
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/25 rounded-full px-4 py-1.5 mt-2">
            <CheckCircle size={14} className="text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs font-semibold">{planLabel}</span>
          </div>
        </div>

        {/* Anuncio primera clase en vivo — solo Escuela Avanzada */}
        {isEscuela && (
          <div className="mb-8 rounded-2xl border border-[#c9a84c]/40 bg-[#c9a84c]/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse shrink-0" />
              <span className="text-[#c9a84c] text-[10px] font-bold tracking-widest uppercase">
                Primera clase · Grupo reducido · Agosto 2026
              </span>
            </div>
            <h2 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight mb-1">
              Primera Clase Avanzada
            </h2>
            <p className="text-[#c9a84c]/80 text-sm font-semibold mb-5">
              Recomendado solo para personas que ya vieron todos los videos
            </p>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
                <Video size={18} className="text-[#c9a84c]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base leading-snug">
                  Profecía Forense: Precisión y Detalles Específicos
                </h4>
              </div>
            </div>
            <p className="text-[#b8a888] text-sm leading-relaxed mb-4">
              La precisión en lo profético no es un accidente; es el resultado de una mente disciplinada y un espíritu refinado.
              Para pasar del estímulo general a la Profecía Forense —donde ves nombres, fechas y detalles específicos "ocultos"—
              debes dominar el procesamiento interno de la señal.
            </p>
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Temas a tratar:</p>
            <ul className="space-y-2.5 text-sm text-[#c8b89a]">
              {[
                "Cada profeta tiene una \"frecuencia de recepción\" única. La precisión forense comienza con una auditoría de cómo Dios te habla específicamente.",
                "Descifrando el \"Flash\": aprendiendo a distinguir entre un pensamiento pasajero y una visión divina en \"fotograma inmóvil\".",
                "Identificación sensorial: ¿La revelación viene como una imagen mental (interna), una visión abierta (externa) o un \"saber\" (gnosis)?",
                "El método de la \"congelación\" de la primera imagen que recibes para observar con más detalle — allí es donde se esconden los detalles forenses.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#c9a84c] font-bold shrink-0">{i + 1}.</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-[#c9a84c]/15">
              <p className="text-[#8a7a6a] text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse shrink-0" />
                El enlace de la clase se compartirá en el grupo de WhatsApp antes de la sesión.
              </p>
            </div>
          </div>
        )}

        {/* Progress card */}
        <div className="card-dark rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-white font-bold mb-1">Tu progreso</h3>
            <p className="text-[#8a7a6a] text-sm">
              {watchedIds.size > 0
                ? `${watchedIds.size} de ${flatContent.filter(l => l.unlocked).length} clases vistas`
                : "Continúa donde lo dejaste"}
            </p>
            <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-gold transition-all duration-700"
                style={{ width: `${watchedIds.size > 0 ? Math.round(watchedIds.size / flatContent.filter(l => l.unlocked).length * 100) : 3}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              const next = flatContent.find(l => l.unlocked && !watchedIds.has(l.id)) ?? flatContent[0];
              markWatched(next.id);
              setActiveLesson(next.id);
            }}
            className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 shrink-0"
          >
            <PlayCircle size={18} />
            {watchedIds.size > 0 ? "Continuar" : "Comenzar"}
          </button>
        </div>

        {/* Libro digital — solo usuarios Escuela Avanzada */}
        {isEscuela && (() => {
          const launched = new Date() >= new Date("2026-07-04T00:00:00");

          const handleDownload = async (type: "pdf" | "epub") => {
            try {
              const res = await fetch("/api/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: session?.email, type }),
              });
              const data = await res.json();
              if (data.url) {
                window.open(data.url, "_blank");
              }
            } catch {}
          };

          return (
            <div className="mb-10 rounded-2xl border border-[#c9a84c]/40 bg-[#c9a84c]/5 overflow-hidden">
              <div className="flex items-center gap-2 px-6 pt-5 pb-0">
                <Gift size={15} className="text-[#c9a84c]" />
                <span className="text-[#c9a84c] text-[10px] font-bold tracking-widest uppercase">
                  Regalo incluido en tu plan
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 p-6">
                <div className="shrink-0 w-28 sm:w-32 mx-auto sm:mx-0">
                  <div className="rounded-xl overflow-hidden border border-[#c9a84c]/30 shadow-lg">
                    <Image
                      src="/portada-libro.png"
                      alt="El Manual para Escuchar a Dios"
                      width={128}
                      height={180}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-white font-extrabold text-lg leading-snug mb-1">
                      El Manual para Escuchar a Dios
                    </h3>
                    <p className="text-[#b8a888] text-sm leading-relaxed mb-4">
                      Más que un libro, es una herencia profética: 12 enseñanzas nacidas en la Escuela Profética, reunidas en una edición exclusiva y entregadas como regalo especial para los estudiantes de la Escuela Avanzada, para que lleves contigo una parte del camino que Dios ha preparado para ti.
                    </p>
                  </div>
                  {launched ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleDownload("epub")}
                        className="inline-flex items-center justify-center gap-2 btn-gold px-5 py-3 rounded-xl font-bold text-sm"
                      >
                        <Download size={15} />
                        Descargar eBook
                      </button>
                      <button
                        onClick={() => handleDownload("pdf")}
                        className="inline-flex items-center justify-center gap-2 bg-white/5 border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                      >
                        <Download size={15} />
                        Descargar PDF
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center gap-2 bg-white/5 border border-[#c9a84c]/30 text-[#c9a84c] px-5 py-2.5 rounded-xl text-sm font-bold opacity-70 cursor-not-allowed select-none">
                        <Download size={15} />
                        Descargar libro
                      </div>
                      <span className="text-[#c9a84c] text-xs font-bold bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-3 py-1.5 rounded-full">
                        Disponible 16 de julio
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

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

        {/* Community access for escuela users */}
        {session.plan === "escuela" && (
          <div className="mt-10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle size={20} className="text-[#c9a84c]" />
              Tu comunidad y clases en vivo
            </h2>

            {/* WhatsApp group */}
            <div className="card-dark rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <MessageCircle size={22} className="text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">Grupo de WhatsApp — Escuela Avanzada</h3>
                <p className="text-[#8a7a6a] text-sm">Acceso exclusivo al grupo grupal con Kissingers y todos los estudiantes activos.</p>
              </div>
              {process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ? (
                <a
                  href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Unirme al grupo
                </a>
              ) : (
                <span className="shrink-0 text-xs text-[#6a5a4a] bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  Próximamente
                </span>
              )}
            </div>

            {/* Zoom classes */}
            <div className="card-dark rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Video size={22} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">Clases en vivo por Zoom</h3>
                <p className="text-[#8a7a6a] text-sm">Sesiones grupales en vivo con Kissingers. El enlace se comparte en el grupo de WhatsApp antes de cada clase.</p>
              </div>
              {process.env.NEXT_PUBLIC_ZOOM_URL ? (
                <a
                  href={process.env.NEXT_PUBLIC_ZOOM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <Video size={16} />
                  Unirme a la clase
                </a>
              ) : (
                <span className="shrink-0 text-xs text-[#6a5a4a] bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  Próximamente
                </span>
              )}
            </div>
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

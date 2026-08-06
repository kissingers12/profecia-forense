"use client";

import { useState } from "react";
import { BookOpen, Eye, ArrowRight, Tag, ShieldCheck, Gift, GraduationCap, ChevronDown } from "lucide-react";

type CurriculumItem = { title: string; detail: string };
type CurriculumLevel = { level: string; count: string; items: CurriculumItem[] };

const curriculumClases: CurriculumLevel[] = [
  {
    level: "Nivel Básico — Escuela de Profetas",
    count: "8 clases",
    items: [
      { title: "Desbloqueando los ojos espirituales", detail: "El primer paso para dejar de orar \"a ciegas\" y empezar a percibir el mundo espiritual." },
      { title: "Cómo recibir Espíritu de Profecía", detail: "La impartición que encendió a los profetas de la Biblia, y cómo recibirla hoy." },
      { title: "Primeros pasos profetizando", detail: "Pasa de espectador a profeta: da tus primeras palabras proféticas con seguridad." },
      { title: "La honra y el llamado a profetizar", detail: "El principio sin el cual la profecía no fluye." },
      { title: "Profecía por interpretación", detail: "Aprende a leer lo que Dios te muestra en imágenes y símbolos." },
      { title: "Profecía al tocar una persona", detail: "Lo que ocurre en el espíritu con el contacto, y cómo activarlo." },
      { title: "Cómo ver letras y nombres en el espíritu", detail: "El nivel donde tu profecía se vuelve específica." },
      { title: "Abrir los ojos y tener visiones", detail: "Ejercicios prácticos para activar la visión espiritual." },
    ],
  },
  {
    level: "Nivel Intermedio — Meditación Profética",
    count: "5 sesiones",
    items: [
      { title: "Los 4 Secretos de la Meditación Profética", detail: "Quien no medita jamás se desarrolla plenamente en lo profético: aquí está el fundamento de todo." },
      { title: "4 horas de música instrumental para meditar", detail: "Acompañamiento sonoro para tus tiempos de meditación profunda." },
    ],
  },
  {
    level: "Nivel Avanzado",
    count: "10 clases",
    items: [
      { title: "La Llave de la Ciencia", detail: "Jesús nunca dijo \"reciban\": les dio conocimiento. Sin esta enseñanza no hay acceso al mundo espiritual." },
      { title: "La Meditación de los profetas para salir del cuerpo", detail: "Experiencias espirituales y principios de los viajes en el espíritu." },
      { title: "Actos Proféticos 1, 2 y 3", detail: "Cómo un acto en lo natural desata resultados en lo espiritual." },
      { title: "Ángeles, Fantasmas y sombras", detail: "Discernimiento para reconocer cada manifestación espiritual y no confundirlas." },
      { title: "El secreto de la prosperidad", detail: "Los principios espirituales detrás de la transformación financiera." },
      { title: "\"Esto me hizo millonario\" (partes 1 y 2)", detail: "El testimonio y las claves que cambiaron la economía del pastor Kissingers." },
      { title: "Si lo crees ya eres profeta", detail: "La identidad que desbloquea el don." },
    ],
  },
  {
    level: "Profecía Forense — Serie nueva",
    count: "En crecimiento",
    items: [
      { title: "Precisión y detalles específicos", detail: "El nivel más alto: ver nombres, fechas y datos \"ocultos\". Cada nuevo video de esta serie queda incluido automáticamente en tu acceso." },
    ],
  },
];

const programs = [
  {
    id: 1,
    planValue: "meditaciones",
    soldOut: false,
    icon: <Eye size={28} className="text-[#c9a84c]" />,
    tag: "Meditación",
    title: "Meditación Profética",
    paragraphs: [
      "Lleva tu vida espiritual de 0 a 100 mediante un entrenamiento diseñado para desarrollar tu sensibilidad espiritual, fortalecer tu capacidad de escuchar la voz de Dios y aprender principios prácticos para crecer en discernimiento y revelación.",
      "A través de sesiones guiadas, aprenderás a silenciar el ruido externo, enfocar tu mente en la presencia de Dios y desarrollar hábitos que favorezcan una mayor claridad espiritual.",
    ],
    accessLabel: null,
    accessItems: null,
    learnsLabel: "Lo que aprenderás:",
    learns: [
      "Los 4 secretos de la meditación profética y cómo aplicarlos correctamente.",
      "Meditaciones guiadas para desarrollar sensibilidad espiritual y fortalecer tu discernimiento.",
      "Principios para comprender las experiencias espirituales descritas en las Escrituras y su aplicación práctica.",
      "La Llave de la Ciencia: una enseñanza clave. Jesús nunca dijo 'reciban', Jesús les dio conocimientos — y esta enseñanza es donde ocurre la verdadera impartición. La Biblia dice: en parte conocemos, en parte profetizamos. Sin esta enseñanza no tendrás acceso al mundo espiritual.",
    ],
    curriculum: null as CurriculumLevel[] | null,
    closing: "Estas enseñanzas están diseñadas para llevar a un profeta de 0 a 100, ya que quien no medita jamás podrá desarrollarse plenamente en lo profético.",
    duration: "Acceso 24/7",
    level: "Todos los niveles",
    originalPrice: 444,
    price: 333,
    discount: 25,
    gift: null as { title: string; description: string } | null,
    accent: "#8b5cf6",
  },
  {
    id: 3,
    planValue: "clases",
    soldOut: false,
    icon: <GraduationCap size={28} className="text-[#c9a84c]" />,
    tag: "Acceso Completo",
    title: "Escuela de Profetas — Todas las Clases",
    paragraphs: [
      "Más de 25 enseñanzas que reúnen todo el camino de formación profética impartido desde 2023 hasta hoy, organizadas por niveles.",
      "Aprende a tu propio ritmo, con acceso 24/7 desde cualquier dispositivo: desde desbloquear tus ojos espirituales hasta la Profecía Forense, el nivel donde se ven nombres, fechas y detalles específicos.",
    ],
    accessLabel: null,
    accessItems: null,
    learnsLabel: "Lo que aprenderás:",
    learns: [] as string[],
    curriculum: curriculumClases,
    closing: "El camino completo de formación profética, de 0 a Profecía Forense, para recorrerlo a tu ritmo.",
    duration: "Acceso 24/7",
    level: "Todos los niveles",
    originalPrice: 777,
    price: 555,
    discount: 29,
    gift: {
      title: "El Manual para Escuchar a Dios",
      description: "Más que un libro, es una herencia profética: 12 enseñanzas nacidas en la Escuela Profética, reunidas en una edición exclusiva y entregadas como regalo para los estudiantes, para que lleves contigo una parte del camino que Dios ha preparado para ti.",
    },
    accent: "#22c55e",
  },
  {
    id: 2,
    planValue: "escuela",
    soldOut: true,
    icon: <BookOpen size={28} className="text-[#c9a84c]" />,
    tag: "Formación",
    title: "Escuela Avanzada de Profecía",
    paragraphs: [
      "Un programa intensivo diseñado para formar y equipar profetas, llevándolos desde los fundamentos del ministerio profético hasta niveles avanzados de discernimiento, revelación y práctica ministerial.",
      "Recibirás acceso 24/7 a más de 25 enseñanzas prácticas cargadas de secretos diseñados para activar la profecía, junto con mentoría y activaciones enfocadas en desarrollar tu sensibilidad espiritual, fortalecer tu discernimiento y ayudarte a crecer en el ejercicio responsable del don profético.",
    ],
    accessLabel: "Al inscribirte en la Escuela Avanzada tendrás acceso completo a:",
    accessItems: [
      { bold: "Todo el contenido de Meditación Profética", detail: "acceso completo a todas las enseñanzas publicadas en esa sección." },
      { bold: "El libro: El Manual para Escuchar a Dios", detail: "Más que un libro, es una herencia profética: 12 enseñanzas nacidas en la Escuela Profética, reunidas en una edición exclusiva y entregadas como regalo especial para los estudiantes de la Escuela Avanzada." },
      { bold: "Videos exclusivos de YouTube para miembros", detail: "enseñanzas que solo se han compartido en privado con miembros. Si ya los viste en YouTube, aquí los tienes organizados — y además recibirás mentoría exclusiva y acceso a todas las próximas enseñanzas." },
      { bold: "Mentoría en grupo reducido", detail: "sesiones donde podrás recibir orientación directa y resolver dudas en un ambiente íntimo." },
      { bold: "Clases en vivo por Zoom", detail: "acceso a clases en tiempo real y a las grabaciones de cada sesión." },
    ],
    learnsLabel: "Temas de formación:",
    learns: [
      "Desbloqueando los ojos espirituales.",
      "Las piedras espirituales y cómo usarlas.",
      "Cómo dar tus primeras profecías con seguridad y precisión.",
      "Profecía por interpretación.",
      "Profecía por contacto e impresión espiritual.",
      "Cómo ver letras, nombres y detalles específicos en el espíritu.",
      "Los 4 secretos de la meditación profética.",
      "El secreto de la prosperidad.",
      "Discernimiento de ángeles, sombras y manifestaciones espirituales.",
      "La Llave de la Ciencia.",
      "Experiencias espirituales y principios relacionados con los viajes en el espíritu.",
      "Activaciones prácticas y ejercicios supervisados.",
      "Preguntas y respuestas en grupo de WhatsApp con el pastor Kissingers.",
    ],
    curriculum: null,
    gift: {
      title: "El Manual para Escuchar a Dios",
      description: "Más que un libro, es una herencia profética: 12 enseñanzas nacidas en la Escuela Profética, reunidas en una edición exclusiva y entregadas como regalo especial para los estudiantes de la Escuela Avanzada, para que lleves contigo una parte del camino que Dios ha preparado para ti.",
    },
    closing: "Una formación diseñada para acelerar tu crecimiento espiritual, desarrollar tu discernimiento y ayudarte a caminar con mayor claridad, madurez y precisión en el llamado profético.",
    duration: "Acceso 24/7",
    level: "Todos los niveles",
    originalPrice: 1200,
    price: 777,
    discount: 35,
    accent: "#3b82f6",
  },
];

function Curriculum({ levels }: { levels: CurriculumLevel[] }) {
  const [openLevel, setOpenLevel] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {levels.map((lvl, li) => {
        const isOpen = openLevel === li;
        return (
          <div key={li} className={`rounded-xl border transition-colors ${isOpen ? "border-[#c9a84c]/30 bg-[#c9a84c]/[0.04]" : "border-white/10"}`}>
            <button
              type="button"
              onClick={() => setOpenLevel(isOpen ? null : li)}
              className="w-full flex items-center gap-2 p-3.5 text-left cursor-pointer"
            >
              <span className="text-[#c9a84c] text-[11px] font-bold uppercase tracking-wider flex-1 leading-snug">
                {lvl.level}
              </span>
              <span className="text-[#6a5a4a] text-[10px] shrink-0">{lvl.count}</span>
              <ChevronDown
                size={15}
                className={`text-[#c9a84c] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <ul className="px-3.5 pb-3.5 space-y-1">
                {lvl.items.map((item, ii) => {
                  const key = `${li}-${ii}`;
                  const itemOpen = openItems.has(key);
                  return (
                    <li key={key} className="border-t border-white/5 first:border-t-0">
                      <button
                        type="button"
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-start gap-2 py-2 text-left cursor-pointer group"
                      >
                        <ShieldCheck size={13} className="text-[#c9a84c] shrink-0 mt-0.5" />
                        <span className={`text-[13px] leading-snug flex-1 transition-colors ${itemOpen ? "text-[#c9a84c] font-semibold" : "text-white group-hover:text-[#c9a84c]"}`}>
                          {item.title}
                        </span>
                        <ChevronDown
                          size={13}
                          className={`text-[#6a5a4a] shrink-0 mt-0.5 transition-transform duration-200 ${itemOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {itemOpen && (
                        <p className="text-[#b8a888] text-xs leading-relaxed pb-2.5 pl-[21px]">
                          {item.detail}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Programs() {
  return (
    <section id="programas" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="orb orb-purple w-[400px] h-[400px] top-0 right-0 opacity-10 absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Formación Espiritual
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Meditaciones proféticas,{" "}
            <span className="text-[#c9a84c]">formación y entrenamientos</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#b8a888] text-base lg:text-lg">
            Programas diseñados para llevar tu vida profética al siguiente nivel
            con metodología, profundidad y acompañamiento real.
          </p>
          <div className="divider-gold max-w-xs mx-auto mt-8" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {programs.map((p) => (
            <div key={p.id} className="card-dark card-hover rounded-2xl overflow-hidden group flex flex-col">
              {/* Top gradient bar */}
              <div
                className="h-1 w-full shrink-0"
                style={{ background: `linear-gradient(90deg, ${p.accent}, #c9a84c)` }}
              />

              {/* Cinta de agotado */}
              {p.soldOut && (
                <div className="bg-red-500/15 border-b border-red-500/30 text-red-400 text-[11px] font-bold tracking-[0.3em] uppercase text-center py-2.5 shrink-0">
                  Plazas agotadas
                </div>
              )}

              <div className={`p-8 flex flex-col flex-1 ${p.soldOut ? "opacity-60" : ""}`}>
                {/* Tag + Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-xs font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border"
                    style={{ color: p.accent, borderColor: `${p.accent}40`, background: `${p.accent}10` }}
                  >
                    {p.tag}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                    {p.icon}
                  </div>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-snug">
                  {p.title}
                </h3>

                {/* Presentación. En el programa agotado basta con el resumen:
                    ocupaba tanto como los que sí se pueden comprar. */}
                <div className="space-y-3 mb-5">
                  {(p.soldOut ? p.paragraphs.slice(0, 1) : p.paragraphs).map((para, i) => (
                    <p key={i} className="text-[#b8a888] text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Regalo: Libro */}
                {p.gift && (
                  <div className="mb-5 rounded-xl border border-[#c9a84c]/50 bg-[#c9a84c]/8 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#c9a84c]/20 flex items-center justify-center shrink-0">
                        <Gift size={14} className="text-[#c9a84c]" />
                      </div>
                      <span className="text-[#c9a84c] text-[10px] font-bold tracking-widest uppercase">
                        Regalo incluido
                      </span>
                    </div>
                    <p className="text-white font-bold text-sm mb-1">{p.gift.title}</p>
                    <p className="text-[#b8a888] text-xs leading-relaxed">{p.gift.description}</p>
                  </div>
                )}

                {/* Todo el detalle largo va plegado: la página queda más corta
                    y quien de verdad quiere leerlo lo abre con un clic */}
                <details className="group/det mb-5">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-3 rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/5 px-4 py-3 text-sm font-bold text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all">
                    <span>{p.soldOut ? "Ver qué incluía este programa" : "Ver todo lo que incluye"}</span>
                    <ChevronDown size={16} className="shrink-0 transition-transform duration-200 group-open/det:rotate-180" />
                  </summary>
                  <div className="pt-5">


                {/* Lo que recibirás (opcional) */}
                {p.accessLabel && (
                  <div className="mb-4">
                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">
                      Lo que recibirás
                    </p>
                    <p className="text-[#b8a888] text-sm leading-relaxed mb-3">{p.accessLabel}</p>
                    {"accessItems" in p && p.accessItems && (
                      <ul className="space-y-3">
                        {(p.accessItems as { bold: string; detail: string }[]).map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <ShieldCheck size={15} className="text-[#c9a84c] shrink-0 mt-0.5" />
                            <span className="text-[#c8b89a] leading-relaxed">
                              <span className="text-white font-semibold">{item.bold}</span>
                              {" — "}{item.detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Lo que aprenderás */}
                <div className="mb-5">
                  <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">
                    {p.learnsLabel}
                  </p>
                  {p.curriculum ? (
                    <>
                      <p className="text-[#6a5a4a] text-xs mb-3">
                        Toca cada nivel para ver sus clases, y cada clase para descubrir lo que aprenderás.
                      </p>
                      <Curriculum levels={p.curriculum} />
                    </>
                  ) : (
                    <ul className="space-y-2.5">
                      {p.learns.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#c8b89a]">
                          <ShieldCheck size={15} className="text-[#c9a84c] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                    {/* Closing statement */}
                    {p.closing && (
                      <p className="text-[#c9a84c] text-xs leading-relaxed italic border-l-2 border-[#c9a84c]/40 pl-3">
                        {p.closing}
                      </p>
                    )}
                  </div>
                </details>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-[#8a7a6a] mb-5">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                    {p.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                    {p.level}
                  </span>
                </div>

                {/* Price block */}
                <div className="border-t border-[#c9a84c]/15 pt-5 mb-5">
                  {p.discount && p.originalPrice && !p.soldOut && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="line-through text-[#6a5a4a] text-sm">${p.originalPrice}</span>
                      <span className="inline-flex items-center gap-1 bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
                        <Tag size={10} />
                        -{p.discount}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">${p.price}</span>
                    <span className="text-[#8a7a6a] text-sm">USD</span>
                  </div>
                  <span className="text-[#6a5a4a] text-xs">
                    {p.soldOut ? "Sin plazas disponibles" : "Pago único · Acceso 24/7"}
                  </span>
                </div>

                {/* CTA */}
                {p.soldOut ? (
                  <>
                    <div className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-auto bg-white/5 border border-white/10 text-[#8a7a6a] cursor-not-allowed select-none">
                      Agotado
                    </div>
                    <p className="text-center text-xs text-[#6a5a4a] mt-2">
                      Este programa no acepta nuevas inscripciones por el momento.
                    </p>
                  </>
                ) : (
                  <>
                    <a
                      href={`/login?tab=register&plan=${p.planValue}`}
                      className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-auto group"
                    >
                      Inscribirme · ${p.price}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-center text-xs text-[#6a5a4a] mt-2">
                      Elige tu criptomoneda favorita al pagar —{" "}
                      <span className="text-[#c9a84c]/70">Bitcoin, USDT, ETH y más de 100 opciones.</span>
                    </p>
                  </>
                )}
                <a
                  href="/login"
                  className="text-center text-xs text-[#8a7a6a] hover:text-[#c9a84c] mt-2 transition-colors block"
                >
                  ¿Ya tienes cuenta? Inicia sesión →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-[#6a5a4a] text-xs">
          {["Pago 100% seguro", "Garantía 7 días", "Acceso inmediato", "Soporte incluido"].map((b) => (
            <span key={b} className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#c9a84c]" />
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

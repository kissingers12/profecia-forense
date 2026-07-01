"use client";

import { BookOpen, Eye, ArrowRight, Tag, ShieldCheck } from "lucide-react";

const programs = [
  {
    id: 1,
    icon: <Eye size={28} className="text-[#c9a84c]" />,
    tag: "Meditación",
    title: "Meditación Profética",
    paragraphs: [
      "Lleva tu vida espiritual de 0 a 100 mediante un entrenamiento diseñado para desarrollar tu sensibilidad espiritual, fortalecer tu capacidad de escuchar la voz de Dios y aprender principios prácticos para crecer en discernimiento y revelación.",
      "A través de sesiones guiadas, aprenderás a silenciar el ruido externo, enfocar tu mente en la presencia de Dios y desarrollar hábitos que favorezcan una mayor claridad espiritual.",
    ],
    accessLabel: null,
    learnsLabel: "Lo que aprenderás:",
    learns: [
      "Los 4 secretos de la meditación profética y cómo aplicarlos correctamente.",
      "Meditaciones guiadas para desarrollar sensibilidad espiritual y fortalecer tu discernimiento.",
      "Principios para comprender las experiencias espirituales descritas en las Escrituras y su aplicación práctica.",
      "La Llave de la Ciencia: una enseñanza clave. Jesús nunca dijo 'reciban', Jesús les dio conocimientos — y esta enseñanza es donde ocurre la verdadera impartición. La Biblia dice: en parte conocemos, en parte profetizamos. Sin esta enseñanza no tendrás acceso al mundo espiritual.",
    ],
    closing: "Estas enseñanzas están diseñadas para llevar a un profeta de 0 a 100, ya que quien no medita jamás podrá desarrollarse plenamente en lo profético.",
    duration: "Acceso 24/7",
    level: "Todos los niveles",
    originalPrice: 444,
    price: 333,
    discount: 25,
    paymentUrl: "https://nowpayments.io/payment/?iid=6358579774&paymentId=4532704630",
    accent: "#8b5cf6",
  },
  {
    id: 2,
    icon: <BookOpen size={28} className="text-[#c9a84c]" />,
    tag: "Formación",
    title: "Escuela Avanzada de Profecía",
    paragraphs: [
      "Un programa intensivo diseñado para formar y equipar profetas, llevándolos desde los fundamentos del ministerio profético hasta niveles avanzados de discernimiento, revelación y práctica ministerial.",
      "Recibirás acceso 24/7 a más de 25 enseñanzas prácticas cargadas de secretos diseñados para activar la profecía, junto con mentoría y activaciones enfocadas en desarrollar tu sensibilidad espiritual, fortalecer tu discernimiento y ayudarte a crecer en el ejercicio responsable del don profético.",
    ],
    accessLabel: "Al inscribirte en la Escuela Avanzada tendrás acceso completo a todo el contenido publicado en Meditación Profética, más enseñanzas avanzadas sobre temas que rara vez se enseñan de manera completa, compartiendo principios, experiencias y herramientas prácticas para el desarrollo profético.",
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
    closing: "Una formación diseñada para acelerar tu crecimiento espiritual, desarrollar tu discernimiento y ayudarte a caminar con mayor claridad, madurez y precisión en el llamado profético.",
    duration: "Acceso 24/7",
    level: "Todos los niveles",
    originalPrice: 1200,
    price: 777,
    discount: 35,
    paymentUrl: "https://nowpayments.io/payment/?iid=5100234736&paymentId=5746183612",
    accent: "#3b82f6",
  },
];

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
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          {programs.map((p) => (
            <div key={p.id} className="card-dark card-hover rounded-2xl overflow-hidden group flex flex-col">
              {/* Top gradient bar */}
              <div
                className="h-1 w-full shrink-0"
                style={{ background: `linear-gradient(90deg, ${p.accent}, #c9a84c)` }}
              />

              <div className="p-8 flex flex-col flex-1">
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

                {/* Paragraphs */}
                <div className="space-y-3 mb-5">
                  {p.paragraphs.map((para, i) => (
                    <p key={i} className="text-[#b8a888] text-sm leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Lo que recibirás (opcional) */}
                {p.accessLabel && (
                  <div className="mb-4">
                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-2">
                      Lo que recibirás
                    </p>
                    <p className="text-[#b8a888] text-sm leading-relaxed">{p.accessLabel}</p>
                  </div>
                )}

                {/* Lo que aprenderás */}
                <div className="mb-5">
                  <p className="text-white text-xs font-bold uppercase tracking-widest mb-3">
                    {p.learnsLabel}
                  </p>
                  <ul className="space-y-2.5">
                    {p.learns.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#c8b89a]">
                        <ShieldCheck size={15} className="text-[#c9a84c] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Closing statement */}
                {p.closing && (
                  <p className="text-[#c9a84c] text-xs leading-relaxed italic border-l-2 border-[#c9a84c]/40 pl-3 mb-5">
                    {p.closing}
                  </p>
                )}

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
                  {p.discount && p.originalPrice && (
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
                  <span className="text-[#6a5a4a] text-xs">Pago único · Acceso 24/7</span>
                </div>

                {/* CTA */}
                <a
                  href={`/login?tab=register&plan=${p.id === 1 ? "meditaciones" : "escuela"}`}
                  className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-auto group"
                >
                  Inscribirme · ${p.price}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="text-center text-xs text-[#6a5a4a] mt-2">
                  Elige tu criptomoneda favorita al pagar —{" "}
                  <span className="text-[#c9a84c]/70">Bitcoin, USDT, ETH y más de 100 opciones.</span>
                </p>
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

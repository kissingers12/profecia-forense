"use client";

import { Calendar, Clock, Users } from "lucide-react";

const events = [
  {
    id: 1,
    category: "Masterclass",
    title: "Masterclass Profecía Forense",
    description:
      "Una sesión intensiva de alto impacto donde aprenderás los principios fundamentales de la profecía forense: cómo leer el espíritu de las situaciones, identificar patrones proféticos y operar con autoridad espiritual.",
    date: "Octubre 2026",
    time: "7:00 PM (GMT-5)",
    spots: "200 cupos",
    color: "#8b5cf6",
    badge: "Próximamente",
  },
  {
    id: 2,
    category: "Mentoría",
    title: "Mentoría Intensiva de 4 Semanas",
    description:
      "Un programa de acompañamiento personalizado con Kissingers Araque. Cuatro semanas de formación profética profunda, práctica supervisada y activación de dones. Grupos reducidos para máximo impacto.",
    date: null,
    time: "Horarios flexibles",
    spots: "20 cupos",
    color: "#c9a84c",
    badge: "Próximamente",
  },
  {
    id: 3,
    category: "Conferencia",
    title: "Los Secretos de Salomón para Salir de la Escasez",
    description:
      "Descubre los principios espirituales y prácticos que Salomón usó para acceder a una dimensión de abundancia sobrenatural. Un encuentro que une sabiduría bíblica, mentalidad de prosperidad y principios proféticos.",
    date: null,
    time: null,
    spots: "Ilimitado",
    color: "#3b82f6",
    badge: "Próximamente",
  },
];

export default function Events() {
  return (
    <section id="eventos" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="orb orb-gold w-[350px] h-[350px] top-0 left-[20%] opacity-10 absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Agenda
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Próximos <span className="text-[#c9a84c]">Eventos</span>
          </h2>
          <p className="max-w-xl mx-auto text-[#b8a888]">
            Experiencias en vivo diseñadas para transformar, activar y llevar tu
            vida espiritual al siguiente nivel.
          </p>
          <div className="divider-gold max-w-xs mx-auto mt-8" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {events.map((e) => (
            <div key={e.id} className="card-dark card-hover rounded-2xl overflow-hidden flex flex-col group">
              {/* Top accent */}
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${e.color}, #c9a84c)` }} />

              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full border"
                    style={{ color: e.color, borderColor: `${e.color}40`, background: `${e.color}10` }}
                  >
                    {e.category}
                  </span>
                  <span className="text-xs font-semibold text-[#c9a84c] bg-[#c9a84c]/10 px-3 py-1 rounded-full border border-[#c9a84c]/20">
                    {e.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 leading-snug">{e.title}</h3>
                <p className="text-[#b8a888] text-sm leading-relaxed flex-1 mb-6">{e.description}</p>

                {/* Details */}
                <div className="space-y-2 mb-6">
                  {e.date && (
                    <div className="flex items-center gap-2 text-xs text-[#8a7a6a]">
                      <Calendar size={14} className="text-[#c9a84c]" />
                      {e.date}
                    </div>
                  )}
                  {e.time && (
                    <div className="flex items-center gap-2 text-xs text-[#8a7a6a]">
                      <Clock size={14} className="text-[#c9a84c]" />
                      {e.time}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-[#8a7a6a]">
                    <Users size={14} className="text-[#c9a84c]" />
                    {e.spots}
                  </div>
                </div>

                <div className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full text-sm font-semibold border border-[#c9a84c]/20 text-[#6a5a4a] cursor-default select-none">
                  Próximamente
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Flame, Eye, Mic } from "lucide-react";

const pillars = [
  {
    icon: <Flame size={24} className="text-[#c9a84c]" />,
    title: "Activación Profética",
    description:
      "Desbloqueamos el potencial profético latente en cada creyente mediante procesos de activación dirigida y práctica continua.",
  },
  {
    icon: <Eye size={24} className="text-[#c9a84c]" />,
    title: "Discernimiento Espiritual",
    description:
      "Entrenamos la capacidad de distinguir voces, visiones y percepciones espirituales con madurez, precisión y responsabilidad.",
  },
  {
    icon: <Mic size={24} className="text-[#c9a84c]" />,
    title: "Formación de Videntes",
    description:
      "Un camino de formación integral para aquellos llamados a operar en el don de visión y revelación profética.",
  },
];

export default function About() {
  return (
    <section id="nosotros" className="relative py-24 lg:py-32 overflow-hidden section-bg-alt">
      {/* Orbs */}
      <div className="orb orb-blue w-[500px] h-[500px] bottom-0 left-[-150px] opacity-10 absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              Quiénes somos
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Somos un{" "}
              <span className="text-[#c9a84c]">Instituto Profético Global</span>
            </h2>
            <p className="text-[#b8a888] text-base lg:text-lg leading-relaxed mb-8">
              Hemos formado a más de{" "}
              <strong className="text-white">10.000 personas</strong> llamadas a
              escuchar, discernir y manifestar la voz de Dios con madurez,
              precisión y responsabilidad espiritual.
            </p>
            <div className="divider-gold max-w-[120px] mb-8" />
            <a
              href="#contacto"
              className="btn-gold px-8 py-3.5 rounded-full text-base font-bold tracking-wide inline-block"
            >
              Empieza hoy
            </a>
          </div>

          {/* Right: pillars */}
          <div className="flex flex-col gap-5">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="card-dark card-hover rounded-xl p-6 flex items-start gap-5"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">{p.title}</h3>
                  <p className="text-[#b8a888] text-sm leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

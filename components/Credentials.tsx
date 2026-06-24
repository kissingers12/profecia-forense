"use client";

import { BookOpen, Globe, Users, Award, Mic, Star } from "lucide-react";

const credentials = [
  { icon: <BookOpen size={28} />, title: "Formación ministerial", desc: "Décadas de preparación teológica y práctica profética" },
  { icon: <Globe size={28} />, title: "Liderazgo internacional", desc: "Conferencias y ministerio en más de 15 países" },
  { icon: <Users size={28} />, title: "Mentoría espiritual", desc: "Acompañamiento personalizado a líderes emergentes" },
  { icon: <Award size={28} />, title: "Desarrollo de líderes", desc: "Metodología probada para activar el potencial humano" },
  { icon: <Mic size={28} />, title: "Enseñanza profética", desc: "Docencia especializada en el lenguaje de Dios" },
  { icon: <Star size={28} />, title: "Comunidad global", desc: "Red activa de profetas y líderes en todo el mundo" },
];

export default function Credentials() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Trayectoria
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Credenciales y <span className="text-[#c9a84c]">experiencia</span>
          </h2>
          <div className="divider-gold max-w-xs mx-auto mt-6" />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((c, i) => (
            <div
              key={i}
              className="card-dark card-hover rounded-2xl p-7 flex flex-col items-start gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/25 flex items-center justify-center text-[#c9a84c] group-hover:bg-[#c9a84c]/20 transition-colors">
                {c.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1.5">{c.title}</h3>
                <p className="text-[#8a7a6a] text-sm leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

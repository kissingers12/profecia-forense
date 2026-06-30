"use client";

import { BookOpen, ShieldCheck, Clock, Star } from "lucide-react";

const contents = [
  "Los dos tipos de profetas que existen en la Biblia — y cómo saber cuál eres tú",
  "El mecanismo exacto que activa lo profético, condiciones que puedes replicar intencionalmente",
  "Los secretos que los grandes hombres de Dios guardan en silencio — y por qué decidí no guardarlos",
  "Cómo la meditación profética de David, Elías y Ezequiel puede activarse en tu vida hoy",
  "Principios probados: enfermedades sanadas, embarazos imposibles, finanzas transformadas",
  "Todo con respaldo bíblico y experiencia personal comprobada — nada es solo teoría",
];

export default function Book() {
  return (
    <section id="libro" className="relative py-24 lg:py-32 overflow-hidden section-bg-alt">
      <div className="orb orb-purple w-[500px] h-[500px] top-0 left-[-100px] opacity-10 absolute" />
      <div className="orb orb-blue w-[400px] h-[400px] bottom-0 right-[-100px] opacity-10 absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Escuela de Profetas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            El libro que{" "}
            <span className="text-[#c9a84c]">lo cambiará para siempre</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#b8a888] text-base lg:text-lg italic">
            "No todo el mundo está listo para lo que encontrará en estas páginas."
          </p>
          <div className="divider-gold max-w-xs mx-auto mt-8" />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-14 items-center max-w-5xl mx-auto">

          {/* Left: Book visual */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow behind book */}
              <div className="absolute inset-0 blur-3xl bg-[#c9a84c]/20 rounded-3xl scale-110" />

              {/* Book card */}
              <div className="relative card-dark rounded-2xl overflow-hidden w-64 sm:w-72 shadow-2xl border border-[#c9a84c]/30">
                {/* Top gradient bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#c9a84c] via-[#f0d080] to-[#c9a84c]" />

                {/* Cover content */}
                <div className="p-8 flex flex-col items-center text-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
                    <BookOpen size={32} className="text-[#c9a84c]" />
                  </div>

                  <div>
                    <p className="text-[#c9a84c] text-xs font-bold tracking-[0.25em] uppercase mb-2">
                      Kissingers Araque
                    </p>
                    <h3 className="text-white font-bold text-xl leading-snug mb-1">
                      Escuela de Profetas
                    </h3>
                    <p className="text-[#b8a888] text-xs leading-relaxed">
                      Secretos del Reino para Activar lo Profético
                    </p>
                  </div>

                  <div className="divider-gold w-full" />

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-[#c9a84c] fill-[#c9a84c]" />
                    ))}
                  </div>

                  {/* Preventa badge */}
                  <div className="w-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl px-4 py-3">
                    <p className="text-[#c9a84c] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                      <Clock size={12} />
                      Próximamente · Preventa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text content */}
          <div className="flex flex-col gap-6">
            <p className="text-[#b8a888] text-base leading-relaxed">
              Durante años pagué cientos y miles de dólares en escuelas de profetas buscando lo que nadie me enseñaba:{" "}
              <strong className="text-white">el cómo</strong>. No el qué. No el por qué. El{" "}
              <em>cómo</em>. Cómo fluir. Cómo activar el don. Cómo abrir los ojos espirituales
              con intención y no por accidente. Cuando Dios me lo reveló, le prometí que no me lo
              guardaría. <strong className="text-[#c9a84c]">Este libro es esa promesa cumplida.</strong>
            </p>

            {/* What you'll find */}
            <div>
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-4">
                Lo que encontrarás:
              </p>
              <ul className="space-y-3">
                {contents.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#c8b89a]">
                    <ShieldCheck size={15} className="text-[#c9a84c] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Closing quote */}
            <p className="text-[#c9a84c] text-sm leading-relaxed italic border-l-2 border-[#c9a84c]/40 pl-4">
              La ignorancia es el peor enemigo del profeta. No el diablo. No la religión.
              La ignorancia. Y estás a punto de curarte de ella.
            </p>

            {/* Price block */}
            <div className="card-dark rounded-2xl p-6 border border-[#c9a84c]/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#8a7a6a] text-xs uppercase tracking-widest mb-1">Precio</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-white">Próximamente</span>
                  </div>
                  <p className="text-[#c9a84c] text-xs mt-1 flex items-center gap-1.5">
                    <Clock size={11} />
                    Regístrate para recibir el precio de preventa
                  </p>
                </div>
                <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl px-4 py-2 text-center">
                  <p className="text-[#c9a84c] text-xs font-bold tracking-widest uppercase">Preventa</p>
                  <p className="text-white text-xs mt-0.5">Precio especial</p>
                </div>
              </div>

              {/* CTA */}
              <button
                disabled
                className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-[#c9a84c]/20 text-[#c9a84c]/60 border border-[#c9a84c]/20 cursor-not-allowed"
              >
                <Clock size={16} />
                Disponible próximamente
              </button>
              <p className="text-center text-xs text-[#6a5a4a] mt-3">
                Sigue nuestras redes para ser el primero en enterarte
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

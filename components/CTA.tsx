"use client";

import { Play } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      {/* Orbs */}
      <div className="orb orb-purple w-[500px] h-[500px] top-[-100px] left-[20%] opacity-15 absolute" />
      <div className="orb orb-gold w-[300px] h-[300px] bottom-0 right-[10%] opacity-10 absolute" />

      {/* Geometric ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="w-[600px] h-[600px] rounded-full border border-[#c9a84c]" />
        <div className="absolute w-[800px] h-[800px] rounded-full border border-[#c9a84c]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-6">
          Únete hoy
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
          Descubre cómo crecer{" "}
          <span className="text-[#c9a84c]">espiritualmente</span> sin bloqueos
        </h2>
        <p className="text-[#b8a888] text-base lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Únete a una comunidad diseñada para activar tu propósito, fortalecer
          tu discernimiento y llevar tu llamado a otro nivel.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contacto"
            className="btn-gold px-8 py-4 rounded-full text-base font-bold tracking-wide shadow-xl animate-pulse-glow"
          >
            Inscribirme ahora
          </a>
          <a
            href="https://www.youtube.com/@KissingersAraque"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold px-8 py-4 rounded-full text-base font-bold flex items-center gap-2"
          >
            <Play size={18} fill="currentColor" />
            Ver video
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);

  // Parallax on the image
  useEffect(() => {
    const onScroll = () => {
      if (imageRef.current) {
        imageRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal text when it enters viewport
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTextVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="inicio" className="relative overflow-hidden">

      {/* ── PART 1: Full-viewport image (seen first) ── */}
      <div className="relative h-[65vh] sm:h-screen w-full overflow-hidden">
        {/* Image with parallax */}
        <div ref={imageRef} className="absolute inset-0 scale-110 will-change-transform">
          <Image
            src="/hero-bg.jpg"
            alt="100x100Cristianos"
            fill
            priority
            quality={95}
            className="object-cover object-center"
          />
        </div>

        {/* Very light vignette — image stays clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/50 via-transparent to-[#050510]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/30 via-transparent to-[#050510]/30" />

        {/* Star field */}
        <div className="star-field absolute inset-0 z-[1]" />

        {/* Minimal top-left badge */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10">
          <div className="inline-flex items-center gap-2 border border-[#c9a84c]/50 bg-[#050510]/60 backdrop-blur-md rounded-full px-5 py-2 text-[#c9a84c] text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            Instituto Profético Global
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[#c9a84c]/60 text-xs tracking-widest uppercase">
            Descubre más
          </span>
          <ChevronDown
            size={26}
            className="text-[#c9a84c]/70 animate-float"
          />
        </div>

        {/* Geometric golden lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-8 z-[2]">
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="33%" stroke="#c9a84c" strokeWidth="0.6" fill="none" opacity="0.15" />
            <circle cx="50%" cy="50%" r="18%" stroke="#c9a84c" strokeWidth="0.6" fill="none" opacity="0.1" />
            <line x1="0" y1="35%" x2="100%" y2="65%" stroke="#c9a84c" strokeWidth="0.4" opacity="0.1" />
            <line x1="100%" y1="25%" x2="0" y2="75%" stroke="#c9a84c" strokeWidth="0.4" opacity="0.1" />
          </svg>
        </div>
      </div>

      {/* ── PART 2: Text content (revealed on scroll) ── */}
      <div className="relative bg-gradient-to-b from-[#050510] via-[#080820] to-[#050510]">
        {/* Orbs */}
        <div className="orb orb-purple w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-10 absolute" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-0 left-[-100px] opacity-10 absolute" />

        <div
          ref={textRef}
          className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-24 lg:py-32 text-center transition-all duration-1000 ease-out ${
            textVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* Main title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white mb-8 tracking-tight">
            El ser profeta comienza{" "}
            <span className="text-[#c9a84c] glow-text">en tu mente</span>,{" "}
            no en el espíritu.
          </h1>

          {/* Quote */}
          <blockquote className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-[#c8b89a] leading-relaxed mb-8 italic border-l-2 border-[#c9a84c]/50 pl-5 text-left">
            El Espíritu no necesita desarrollarse; viene de Dios. Es una parte
            de Dios que está en ti. Tu espíritu no necesita abrir los ojos. Dios
            no te dio un espíritu ciego.
            <br /><br />
            Por eso dice la Biblia que Jesús crecía en sabiduría y estatura.
            Jesús en el espíritu era Dios, pero su alma no lo sabía todavía.
            Tuvo que ir aprendiendo. Tuvo que ir alineando su alma con lo que
            su espíritu ya era.
            <br /><br />
            Entonces{" "}
            <span className="text-[#c9a84c] not-italic font-semibold">
              tu alma debe convertirse en profeta
            </span>
            , porque el espíritu ya lo es. Ser profeta no comienza porque tú
            lo declares. Comienza cuando piensas y te crees que eres profeta.
          </blockquote>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#b8a888] leading-relaxed mb-10">
            Una plataforma de formación espiritual diseñada para{" "}
            <strong className="text-white">activar, entrenar y equipar</strong>{" "}
            líderes, videntes e intercesores en el lenguaje profético de Dios.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#programas"
              className="btn-gold px-8 py-3.5 rounded-full text-base font-bold tracking-wide shadow-lg animate-pulse-glow"
            >
              Unirme ahora
            </a>
            <a
              href="/login"
              className="btn-outline-gold px-8 py-3.5 rounded-full text-base font-bold tracking-wide"
            >
              Iniciar sesión
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "10K+", label: "Formados" },
              { value: "15+", label: "Países" },
              { value: "8+", label: "Años" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#c9a84c]">{s.value}</div>
                <div className="text-xs text-[#8a7a6a] uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

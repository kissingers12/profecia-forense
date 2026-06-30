"use client";

import Image from "next/image";
import { Globe, Users, Award, PlayCircle } from "lucide-react";

const highlights = [
  { icon: <Globe size={18} />, label: "Alcance internacional" },
  { icon: <Users size={18} />, label: "+10.000 formados" },
  { icon: <Award size={18} />, label: "Empresario y conferencista" },
];

export default function Founder() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden section-bg-alt">
      <div className="orb orb-purple w-[400px] h-[400px] top-[10%] right-[-100px] opacity-10 absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-[-12px] rounded-full border border-[#c9a84c]/20 animate-pulse-glow" />
              <div className="absolute inset-[-24px] rounded-full border border-[#c9a84c]/10" />
              {/* Photo */}
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-[#c9a84c]/40 shadow-2xl relative z-10">
                <Image
                  src="/logo.jpg"
                  alt="Kissingers Araque"
                  width={320}
                  height={320}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Gold dot accent */}
              <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[#c9a84c] border-2 border-[#050510] z-20 animate-pulse" />
            </div>
          </div>

          {/* Text side */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              <span className="text-[#c9a84c]">Kissingers Araque</span>
            </h2>
            <p className="text-[#b8a888] text-base lg:text-lg leading-relaxed mb-5">
              Es profeta, escritor y empresario. Reconocido por su labor en la formación de
              líderes y el desarrollo de dones espirituales, ha dedicado años a
              capacitar personas en liderazgo, crecimiento personal y
              entrenamiento profético.
            </p>
            <p className="text-[#b8a888] text-base leading-relaxed mb-5">
              Además de su trayectoria ministerial, participa activamente en
              proyectos empresariales, inversiones e iniciativas de innovación.
              Su enfoque combina visión, liderazgo y principios espirituales,
              con el propósito de ayudar a las personas a descubrir su
              potencial, fortalecer su carácter y alcanzar una vida de impacto y
              propósito.
            </p>
            <p className="text-[#b8a888] text-base leading-relaxed mb-8">
              Su misión es formar una generación preparada para liderar con
              integridad, servir con excelencia y ejercer influencia positiva en
              cada esfera de la sociedad.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-3 mb-8">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/25 text-[#c9a84c] text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {h.icon}
                  {h.label}
                </span>
              ))}
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.youtube.com/@KissingersAraque"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-outline-gold px-6 py-3 rounded-full text-sm font-bold"
              >
                <PlayCircle size={18} />
                YouTube
              </a>
              <a
                href="https://www.instagram.com/kissingers_araque/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-outline-gold px-6 py-3 rounded-full text-sm font-bold"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

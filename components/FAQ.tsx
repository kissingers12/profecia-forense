"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "¿Qué es Profecía Forense?",
    a: "Profecía Forense es una metodología de formación espiritual desarrollada por Kissingers Araque que combina principios bíblicos, entrenamiento mental y activación espiritual para desarrollar el don profético con madurez, precisión y responsabilidad. El término 'forense' hace referencia a la capacidad de examinar, discernir y articular la voz de Dios con exactitud.",
  },
  {
    q: "¿Para quién es esta plataforma?",
    a: "Esta plataforma está diseñada para creyentes que sienten el llamado profético, líderes que desean profundizar su discernimiento espiritual, intercesores, videntes, pastores y cualquier persona que desee activar y desarrollar los dones espirituales en su vida con una base sólida y metodología probada.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Tenemos programas para todos los niveles. Las Meditaciones para Profecía Forense son ideales para quienes comienzan, mientras que la Escuela Avanzada de Profecía está diseñada para quienes ya tienen una base y desean ir más profundo. Lo más importante es tener hambre espiritual y disposición para aprender.",
  },
  {
    q: "¿Qué programas ofrecen?",
    a: "Ofrecemos: Meditaciones para Profecía Forense (acceso 24/7), Escuela Avanzada de Profecía (programa de 12 semanas), Masterclasses en vivo, Mentorías intensivas individuales y grupales, y eventos especiales como conferencias y talleres temáticos. Todos diseñados para acompañarte en cada etapa de tu desarrollo profético.",
  },
  {
    q: "¿Cómo puedo inscribirme?",
    a: "Puedes inscribirte completando el formulario de contacto en esta página, seleccionando el programa de tu interés. Un asesor de nuestro equipo se pondrá en contacto contigo para orientarte, resolver tus dudas y guiarte en el proceso de inscripción. También puedes seguirnos en YouTube para conocer más sobre nuestra enseñanza antes de inscribirte.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Preguntas <span className="text-[#c9a84c]">frecuentes</span>
          </h2>
          <div className="divider-gold max-w-xs mx-auto mt-6" />
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card-dark rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-white text-sm sm:text-base group-hover:text-[#c9a84c] transition-colors">
                  {f.q}
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-[#c9a84c] transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  open === i ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <p className="px-6 text-[#b8a888] text-sm leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

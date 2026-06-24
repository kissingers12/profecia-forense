import Image from "next/image";
import { PlayCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#c9a84c]/15 bg-[#030308]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c9a84c]/40">
                <Image src="/logo.jpg" alt="100x100Cristianos" width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <span className="text-white font-bold tracking-wider">
                Profecía <span className="text-[#c9a84c]">Forense</span>
              </span>
            </div>
            <p className="text-[#6a5a4a] text-sm leading-relaxed">
              Instituto Profético Global fundado por Kissingers Araque.
              Formando líderes, videntes e intercesores para impactar el mundo.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <a
                href="https://www.youtube.com/@KissingersAraque"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#c9a84c] text-sm hover:text-[#f0c040] transition-colors"
              >
                <PlayCircle size={16} />
                @KissingersAraque
              </a>
              <a
                href="https://www.instagram.com/kissingers_araque/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#c9a84c] text-sm hover:text-[#f0c040] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                @kissingers_araque
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                ["Inicio", "#inicio"],
                ["Nosotros", "#nosotros"],
                ["Programas", "#programas"],
                ["Eventos", "#eventos"],
                ["Testimonios", "#testimonios"],
                ["Contacto", "#contacto"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-[#6a5a4a] text-sm hover:text-[#c9a84c] transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#6a5a4a] text-sm hover:text-[#c9a84c] transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6a5a4a] text-sm hover:text-[#c9a84c] transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6a5a4a] text-sm hover:text-[#c9a84c] transition-colors">
                  Política de cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#4a3a2a] text-xs">
          <p>
            © {year} 100x100Cristianos · Kissingers Araque. Todos los derechos reservados.
          </p>
          <p>Diseñado con propósito y excelencia.</p>
        </div>
      </div>
    </footer>
  );
}

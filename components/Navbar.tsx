"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Programas", href: "#programas" },
  { label: "Eventos", href: "#eventos" },
  { label: "Invitaciones", href: "#testimonios" },
  { label: "Ofrendas", href: "#donaciones" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050510]/95 backdrop-blur-md border-b border-[#c9a84c]/20 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c9a84c]/40 group-hover:border-[#c9a84c] transition-colors">
            <Image
              src="/logo.jpg"
              alt="Profecía Forense"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="font-bold tracking-wider text-white hidden sm:block whitespace-nowrap">
            <span className="text-base">Profecía <span className="text-[#c9a84c]">Forense</span></span>
            <span className="text-xs font-normal text-[#8a7a6a] ml-1">por Kissingers Araque</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-[#c8b89a] hover:text-[#c9a84c] transition-colors tracking-wide font-medium"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/login"
            className="btn-outline-gold px-5 py-2 rounded-full text-sm font-bold tracking-wide"
          >
            Ingresar
          </a>
          <a
            href="#contacto"
            className="btn-gold px-5 py-2 rounded-full text-sm font-bold tracking-wide"
          >
            Comenzar ahora
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-[#c9a84c] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#050510]/98 backdrop-blur-xl border-t border-[#c9a84c]/20">
          <ul className="px-6 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base text-[#c8b89a] hover:text-[#c9a84c] transition-colors font-medium block py-1"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contacto"
                onClick={() => setMenuOpen(false)}
                className="btn-gold px-5 py-2 rounded-full text-sm font-bold tracking-wide inline-block text-center w-full"
              >
                Comenzar ahora
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

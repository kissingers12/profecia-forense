"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { Lang } from "@/lib/translations";

const langOptions: { value: Lang; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "ca", label: "Catalán" },
  { value: "en", label: "Inglés" },
  { value: "pt", label: "Portugués" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();

  const links = [
    { label: t("nav_inicio"), href: "#inicio" },
    { label: t("nav_libro"), href: "#libro" },
    { label: t("nav_programas"), href: "#programas" },
    { label: t("nav_eventos"), href: "#eventos" },
    { label: t("nav_invitaciones"), href: "#contacto" },
    { label: t("nav_ofrendas"), href: "#donaciones" },
    { label: t("nav_contacto"), href: "#contacto" },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const onClickOut = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
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
              alt="100x100Cristianos"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="font-bold tracking-wider text-white hidden sm:block whitespace-nowrap">
            <span className="text-base">100x100 <span className="text-[#c9a84c]">Cristianos</span></span>
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

        {/* Desktop: language selector + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm text-[#c8b89a] hover:text-[#c9a84c] transition-colors px-3 py-2 rounded-full border border-transparent hover:border-[#c9a84c]/30"
              aria-label="Idioma"
            >
              <Globe size={14} />
              <span className="uppercase font-bold text-xs">{lang}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-[#0a0a20] border border-[#c9a84c]/25 rounded-xl overflow-hidden shadow-2xl">
                {langOptions.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { setLang(o.value); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${lang === o.value ? "text-[#c9a84c] bg-[#c9a84c]/10 font-bold" : "text-[#c8b89a] hover:bg-white/5 hover:text-[#c9a84c]"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="/login?tab=login"
            className="btn-outline-gold px-5 py-2 rounded-full text-sm font-bold tracking-wide"
          >
            {t("nav_ingresar")}
          </a>
          <a
            href="/login?tab=register"
            className="btn-gold px-5 py-2 rounded-full text-sm font-bold tracking-wide"
          >
            {t("nav_comenzar")}
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
            {/* Mobile language selector */}
            <li className="pt-2 border-t border-[#c9a84c]/15">
              <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Globe size={12} />
                Idioma
              </p>
              <div className="flex gap-2 flex-wrap">
                {langOptions.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setLang(o.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${lang === o.value ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10" : "border-[#c9a84c]/25 text-[#8a7a6a] hover:border-[#c9a84c]/60 hover:text-[#c9a84c]"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </li>
            <li className="pt-2 flex flex-col gap-2">
              <a
                href="/login?tab=login"
                onClick={() => setMenuOpen(false)}
                className="btn-outline-gold px-5 py-2 rounded-full text-sm font-bold tracking-wide inline-block text-center w-full"
              >
                {t("nav_ingresar")}
              </a>
              <a
                href="/login?tab=register"
                onClick={() => setMenuOpen(false)}
                className="btn-gold px-5 py-2 rounded-full text-sm font-bold tracking-wide inline-block text-center w-full"
              >
                {t("nav_comenzar")}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

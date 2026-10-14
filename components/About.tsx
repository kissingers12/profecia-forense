"use client";

import { Flame, Eye, Mic } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function About() {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: <Flame size={24} className="text-[#c9a84c]" />,
      title: t("about_p1_title"),
      description: t("about_p1_desc"),
    },
    {
      icon: <Eye size={24} className="text-[#c9a84c]" />,
      title: t("about_p2_title"),
      description: t("about_p2_desc"),
    },
    {
      icon: <Mic size={24} className="text-[#c9a84c]" />,
      title: t("about_p3_title"),
      description: t("about_p3_desc"),
    },
  ];

  return (
    <section id="nosotros" className="relative py-24 lg:py-32 overflow-hidden section-bg-alt">
      {/* Orbs */}
      <div className="orb orb-blue w-[500px] h-[500px] bottom-0 left-[-150px] opacity-10 absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              {t("about_badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {t("about_title_pre")}{" "}
              <span className="text-[#c9a84c]">{t("about_title_hl")}</span>
            </h2>
            <p className="text-[#b8a888] text-base lg:text-lg leading-relaxed mb-8">
              {t("about_desc_pre")}{" "}
              <strong className="text-white">{t("about_count")}</strong>{" "}
              {t("about_desc_post")}
            </p>
            <div className="divider-gold max-w-[120px] mb-8 mx-auto md:mx-0" />
            <div className="flex justify-center md:justify-start">
              <a
                href="/login?tab=register"
                className="btn-gold px-8 py-3.5 rounded-full text-base font-bold tracking-wide inline-block"
              >
                {t("about_cta")}
              </a>
            </div>
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

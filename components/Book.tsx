"use client";

import Image from "next/image";
import { Clock, Smartphone, Package } from "lucide-react";

export default function Book() {
  return (
    <section id="libro" className="relative min-h-screen flex items-center overflow-hidden">
      <style>{`
        @keyframes bookBreath {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.2); }
        }
        @keyframes waveRing {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .book-float  { animation: bookBreath 6s ease-in-out infinite; }
        .glow-pulse  { animation: glowPulse 6s ease-in-out infinite; }
        .wave-ring-1 { animation: waveRing 4s ease-out infinite; }
        .wave-ring-2 { animation: waveRing 4s ease-out infinite 1.3s; }
        .wave-ring-3 { animation: waveRing 4s ease-out infinite 2.6s; }
        .fade-up-1   { animation: fadeUp 0.8s ease-out 0.1s both; }
        .fade-up-2   { animation: fadeUp 0.8s ease-out 0.3s both; }
        .fade-up-3   { animation: fadeUp 0.8s ease-out 0.5s both; }
        .fade-up-4   { animation: fadeUp 0.8s ease-out 0.7s both; }
        .fade-up-5   { animation: fadeUp 0.8s ease-out 0.9s both; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
      <div className="orb orb-purple w-[600px] h-[600px] top-[-100px] right-[-100px] opacity-15 absolute" />
      <div className="orb orb-blue   w-[500px] h-[500px] bottom-[-100px] left-[-100px] opacity-10 absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text */}
          <div className="flex flex-col gap-7 order-2 lg:order-1">
            <div className="fade-up-1">
              <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.35em] uppercase">
                El manual de un Profeta
              </span>
            </div>

            <div className="fade-up-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
                El libro que{" "}
                <span className="text-[#c9a84c]">lo cambiará</span>
                <br />para siempre
              </h1>
            </div>

            <div className="fade-up-3">
              <p className="text-[#b8a888] text-lg lg:text-xl leading-relaxed italic border-l-4 border-[#c9a84c]/50 pl-5">
                "No todo el mundo está listo para lo que encontrará en estas páginas."
              </p>
            </div>

            <div className="fade-up-4">
              <p className="text-[#b8a888] text-base leading-relaxed">
                Este libro contiene revelaciones reservadas para los que buscan con hambre genuina
                los misterios de Dios. Si tiene hambre real, si en su interior algo le dice que hay
                más, mucho más de lo que le han enseñado — siga leyendo.{" "}
                <strong className="text-[#c9a84c]">Lo que está a punto de descubrir lo va a cambiar para siempre.</strong>
              </p>
            </div>

            {/* Two purchase options */}
            <div className="fade-up-5 grid sm:grid-cols-2 gap-4">

              {/* Digital */}
              <div className="card-dark rounded-2xl p-5 border border-[#c9a84c]/30 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                    <Smartphone size={15} className="text-[#c9a84c]" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">Edición Digital</p>
                    <p className="text-[#8a7a6a] text-[10px]">PDF · ePub · App</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="line-through text-[#6a5a4a] text-sm">$47</span>
                    <span className="bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">-42% PREVENTA</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">$27</span>
                    <span className="text-[#8a7a6a] text-xs">USD</span>
                  </div>
                </div>
                <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-lg px-3 py-2">
                  <p className="text-[#c9a84c] text-[10px] font-bold flex items-center gap-1.5">
                    <Clock size={10} />
                    Sale el 16 de julio · Preventa abierta
                  </p>
                </div>
                <button disabled className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-[#c9a84c]/20 text-[#c9a84c]/60 border border-[#c9a84c]/20 cursor-not-allowed mt-auto">
                  <Clock size={13} />
                  Disponible el 16 de julio
                </button>
              </div>

              {/* Físico Amazon */}
              <div className="card-dark rounded-2xl p-5 border border-white/10 flex flex-col gap-3 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Package size={15} className="text-[#8a7a6a]" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">Tapa Dura · Físico</p>
                    <p className="text-[#8a7a6a] text-[10px]">Impreso · Envío a tu puerta</p>
                  </div>
                </div>
                <div>
                  <p className="text-[#8a7a6a] text-xs mb-1">Precio por confirmar</p>
                  <p className="text-white text-sm font-bold">Próximamente en Amazon</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <p className="text-[#8a7a6a] text-[10px] font-bold flex items-center gap-1.5">
                    <Clock size={10} />
                    Disponible próximamente
                  </p>
                </div>
                <button disabled className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-white/5 text-[#6a5a4a] border border-white/10 cursor-not-allowed mt-auto">
                  Próximamente en Amazon
                </button>
              </div>

            </div>
          </div>

          {/* Right: Animated Book */}
          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="relative flex items-center justify-center w-72 sm:w-80 lg:w-96">

              {/* Wave rings */}
              <div className="wave-ring-1 absolute w-48 h-48 rounded-full border border-[#c9a84c]/30" />
              <div className="wave-ring-2 absolute w-48 h-48 rounded-full border border-[#c9a84c]/20" />
              <div className="wave-ring-3 absolute w-48 h-48 rounded-full border border-[#c9a84c]/10" />

              {/* Glow */}
              <div className="glow-pulse absolute w-64 h-80 rounded-3xl bg-[#c9a84c]/20 blur-3xl" />

              {/* Book floating */}
              <div className="book-float relative z-10 drop-shadow-2xl">
                <Image
                  src="/portada-libro.png"
                  alt="El Manual para Oír a Dios por Kissingers Araque"
                  width={320}
                  height={480}
                  className="w-64 sm:w-72 lg:w-80 h-auto rounded-xl"
                  priority
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

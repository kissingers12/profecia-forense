"use client";

import Image from "next/image";
import { Clock, Smartphone, Package } from "lucide-react";


export default function Book() {
  return (
    <section id="libro" className="relative py-24 lg:py-32 overflow-hidden section-bg-alt">
      <div className="orb orb-purple w-[500px] h-[500px] top-0 left-[-100px] opacity-10 absolute" />
      <div className="orb orb-blue w-[400px] h-[400px] bottom-0 right-[-100px] opacity-10 absolute" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            El manual de un Profeta
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
              <div className="relative rounded-2xl overflow-hidden w-64 sm:w-72 shadow-2xl">
                <Image
                  src="/portada-libro.png"
                  alt="El Manual para Oír a Dios por Kissingers Araque"
                  width={288}
                  height={432}
                  className="w-full h-auto rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right: Text content */}
          <div className="flex flex-col gap-6">
            <p className="text-[#b8a888] text-base leading-relaxed">
              Este libro contiene revelaciones reservadas para los que buscan con hambre genuina los misterios de Dios.
              No todo el mundo está listo para lo que encontrará en estas páginas. Si usted es de los que todo lo llama
              pecado, de los que todo lo etiqueta como brujería antes de leer, este libro no es para usted. Pero si
              tiene hambre real, si en su interior algo le dice que hay más, mucho más de lo que le han enseñado —
              siga leyendo.{" "}
              <strong className="text-[#c9a84c]">Lo que está a punto de descubrir lo va a cambiar para siempre.</strong>
            </p>

            {/* Closing quote */}
            <p className="text-[#c9a84c] text-sm leading-relaxed italic border-l-2 border-[#c9a84c]/40 pl-4">
              La ignorancia es el peor enemigo del profeta. No el diablo. No la religión.
              La ignorancia. Y estás a punto de curarte de ella.
            </p>

            {/* Two purchase options */}
            <div className="grid sm:grid-cols-2 gap-4">

              {/* Opción 1: Digital */}
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
                    <span className="bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -42% PREVENTA
                    </span>
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

                <button
                  disabled
                  className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-[#c9a84c]/20 text-[#c9a84c]/60 border border-[#c9a84c]/20 cursor-not-allowed mt-auto"
                >
                  <Clock size={13} />
                  Disponible el 16 de julio
                </button>
              </div>

              {/* Opción 2: Físico Amazon */}
              <div className="card-dark rounded-2xl p-5 border border-white/10 flex flex-col gap-3 opacity-70">
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

                <button
                  disabled
                  className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-white/5 text-[#6a5a4a] border border-white/10 cursor-not-allowed mt-auto"
                >
                  Próximamente en Amazon
                </button>
              </div>

            </div>

            <p className="text-center text-xs text-[#6a5a4a]">
              Sigue nuestras redes para ser el primero en enterarte del lanzamiento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

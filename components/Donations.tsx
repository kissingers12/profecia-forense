"use client";

import { Heart, Bitcoin } from "lucide-react";

export default function Donations() {
  return (
    <section id="donaciones" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="orb orb-purple w-[400px] h-[400px] top-0 right-0 opacity-10 absolute" />
      <div className="orb orb-blue w-[350px] h-[350px] bottom-0 left-0 opacity-10 absolute" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Ofrendas y Diezmos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Tu donación{" "}
            <span className="text-[#c9a84c]">impulsa el reino</span>
          </h2>
          <blockquote className="max-w-2xl mx-auto text-[#c9a84c] text-base italic mb-6">
            "El que es enseñado en la Palabra, haga partícipe de toda cosa buena al que lo instruye." — Gálatas 6:6
          </blockquote>
          <div className="max-w-2xl mx-auto space-y-4 text-[#b8a888] text-base lg:text-lg text-left">
            <p>
              Cada ofrenda y cada diezmo es una expresión de honra a Dios y una participación activa en la extensión de Su Reino.
            </p>
            <p>
              La honra abre los cielos. Cuando tus fuerzas no alcancen, tu semilla hablará por ti delante de Dios. Así como las ofrendas de Cornelio subieron como memorial delante del Señor y hablaron más fuerte que sus propias palabras, y como las obras de Dorcas hablaron en el momento de su necesidad, tu generosidad también se convierte en un testimonio que Dios ve, recuerda y recompensa.
            </p>
            <p>
              Tu ofrenda no es solo un recurso; es una semilla profética sembrada en tierra fértil. Cada aporte lleva el mensaje de Cristo más lejos, alcanza más vidas y deja una herencia eterna en el Reino de Dios.
            </p>
            <p className="text-white font-medium">
              Gracias por sembrar con fe, por honrar la obra del Señor y por ser parte de esta visión. Lo que hoy depositas en obediencia y amor, mañana dará fruto para la gloria de Dios.
            </p>
          </div>
          <div className="divider-gold max-w-xs mx-auto mt-8" />
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* PayPal */}
          <div className="card-dark card-hover rounded-2xl p-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#003087]/20 border border-[#003087]/40 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.826l-1.353 8.56h3.826c.524 0 .967-.382 1.05-.9l.923-5.85h1.957c4.297 0 6.812-2.088 7.685-6.19.378-1.794.113-3.088-.692-3.415z" fill="#009cde"/>
                <path d="M6.263 7.468c.088-.557.44-.982.978-1.074.157-.027.32-.04.483-.04h5.42c.642 0 1.243.044 1.797.136a5.8 5.8 0 0 1 .9.228c.222.08.428.174.618.283.23-1.46-.001-2.453-.798-3.354C14.596.994 12.72.5 10.236.5H2.775C2.252.5 1.808.882 1.725 1.4L-.003 15.856a.575.575 0 0 0 .568.663h4.135l1.039-6.582.524-2.47z" fill="#012169"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">PayPal</h3>
              <p className="text-[#b8a888] text-sm leading-relaxed">
                Dona de forma rápida y segura con tu cuenta PayPal o tarjeta de crédito.
              </p>
            </div>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=PTBWKZKKV3HJG"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: "#0070ba", color: "#fff" }}
            >
              <Heart size={16} />
              Donar con PayPal
            </a>
          </div>

          {/* Crypto */}
          <div className="card-dark card-hover rounded-2xl p-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center">
              <Bitcoin size={32} className="text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Criptomonedas</h3>
              <p className="text-[#b8a888] text-sm leading-relaxed">
                Dona con Bitcoin, Ethereum, USDC, Solana y más de 100 criptomonedas disponibles.
              </p>
            </div>
            <a
              href="https://nowpayments.io/donation?api_key=bf32c23b-4d1b-41b9-a4ed-105514b4eab9"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-gold w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <Bitcoin size={16} />
              Donar con Cripto
            </a>
          </div>
        </div>

        {/* Trust note */}
        <p className="text-center text-[#6a5a4a] text-xs mt-10">
          Todas las donaciones son voluntarias y se usan para financiar la producción de contenido,
          eventos y el alcance misionero del ministerio.
        </p>
      </div>
    </section>
  );
}

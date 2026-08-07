"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, Bitcoin, CreditCard, Upload } from "lucide-react";

const PAYPAL = "https://www.paypal.com/donate/?hosted_button_id=PTBWKZKKV3HJG";

/**
 * Elección de forma de pago tras registrarse.
 *
 * Si el alumno elige PayPal se le muestra ANTES el aviso de que estas clases
 * son las mismas de las membresías 4 y 5 de YouTube. Es el último momento en
 * que podemos evitar que alguien pague por un contenido que ya tiene.
 */
export default function OpcionesDePago({
  precio,
  enlaceCripto,
  email,
}: {
  precio: number;
  enlaceCripto: string;
  email?: string;
}) {
  const [via, setVia] = useState<null | "paypal">(null);

  // Se avisa al panel de que esta persona se fue a pagar por PayPal, para
  // que Kissingers sepa de quién debe esperar el comprobante
  const registrarIntento = () => {
    if (!email) return;
    fetch("/api/paypal-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      keepalive: true,
    }).catch(() => {});
  };

  if (!via) {
    return (
      <div className="space-y-3">
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest text-left">
          ¿Cómo quieres pagar?
        </p>

        <a
          href={enlaceCripto}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-base"
        >
          <Bitcoin size={18} />
          Pagar con criptomonedas — ${precio}
        </a>
        <p className="text-center text-xs text-[#6a5a4a]">
          Bitcoin, USDT, ETH y más de 100 opciones ·{" "}
          <span className="text-[#c9a84c]/70">se activa solo al confirmarse</span>
        </p>

        <button
          type="button"
          onClick={() => setVia("paypal")}
          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-base border border-[#c9a84c]/45 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all"
        >
          <CreditCard size={18} />
          Pagar con tarjeta (PayPal)
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/[0.06] p-5 text-left">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-[#c9a84c] shrink-0" />
        <span className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest">
          Léelo antes de pagar
        </span>
      </div>
      <p className="text-[#e8dcc8] text-sm leading-relaxed">
        Estas clases son <strong className="text-white">exactamente las mismas</strong> que se
        impartieron en las <strong className="text-white">membresías 4 y 5 de YouTube</strong>,
        reunidas desde 2023 hasta hoy.
      </p>
      <p className="text-[#e8dcc8] text-sm leading-relaxed mt-3">
        Si ya llevas tiempo en la membresía 4 o en la 5,{" "}
        <strong className="text-[#c9a84c]">esta escuela no es para ti</strong>, porque sería
        contenido que ya has visto. Preferimos decírtelo antes de que hagas ningún pago.
      </p>

      <div className="mt-5 border-t border-[#c9a84c]/20 pt-5">
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">
          Cómo hacerlo
        </p>
        <ol className="space-y-2.5 text-sm text-[#c8b89a]">
          <li>
            <span className="text-[#c9a84c] font-bold">1.</span> Haz una donación en PayPal por el{" "}
            <strong className="text-white">importe exacto</strong>:{" "}
            <strong className="text-[#c9a84c]">${precio}</strong>.
          </li>
          <li>
            <span className="text-[#c9a84c] font-bold">2.</span> Envíanos la captura del
            comprobante desde tu cuenta{email ? (
              <>
                {" "}(<span className="text-white">{email}</span>)
              </>
            ) : null}
            , con el botón de abajo.
          </li>
          <li>
            <span className="text-[#c9a84c] font-bold">3.</span> Activamos tu acceso manualmente en
            menos de 24 horas.
          </li>
        </ol>

        <div className="mt-5 space-y-3">
          <a
            href={PAYPAL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={registrarIntento}
            className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            Entiendo, ir a pagar con PayPal
            <ArrowRight size={15} />
          </a>
          <a
            href="/dashboard?soporte=1"
            className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-[#c9a84c]/45 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all"
          >
            <Upload size={15} />
            Ya pagué — enviar comprobante
          </a>
          <button
            type="button"
            onClick={() => setVia(null)}
            className="w-full text-center text-xs text-[#6a5a4a] hover:text-[#c9a84c] transition-colors"
          >
            ← Prefiero pagar con criptomonedas
          </button>
        </div>
      </div>
    </div>
  );
}

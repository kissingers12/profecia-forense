"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle, ArrowRight } from "lucide-react";

const faqs: { q: string; a: string; destacada?: boolean; pago?: boolean }[] = [
  {
    destacada: true,
    q: "¿Qué formación debo elegir?",
    a: "Depende de dónde estés hoy. La Escuela de Profetas ($555) reúne todas las clases grabadas desde 2023 hasta hoy — alrededor de 30 enseñanzas — y está pensada especialmente para quienes llevan poco tiempo en la membresía 4 de YouTube. Si ya estás en la membresía 5, o llevas bastante tiempo en la membresía 4, este programa no es para ti, porque ya habrás visto la mayor parte del contenido. La Meditación Profética ($333) es para ti si te interesa conocer los secretos de la meditación y cómo interactuar con los ángeles mediante la meditación profética: ese nivel tiene todas las respuestas que estás buscando.",
  },
  {
    q: "¿Puedo entrar todavía a la Escuela Avanzada de Profetas ($777) con mentoría?",
    a: "No. Esa formación incluía mentoría personalizada y clases grupales por Zoom, y solo se abrieron 15 plazas, que ocuparon las primeras 15 personas inscritas. Al cerrarse, se abrió en su lugar la Escuela de Profetas ($555), con el mismo contenido de clases pero sin las mentorías en vivo.",
  },
  {
    q: "¿Volverán a abrir las mentorías en vivo?",
    a: "Por el momento no. El profeta Kissingers no abrirá de nuevo esa opción, ya que la mentoría personalizada demanda mucho tiempo. Si en el futuro se abren nuevas plazas, lo anunciaremos y avisaremos sin falta a quienes estén registrados.",
  },
  {
    q: "¿Qué incluye exactamente la Escuela de Profetas ($555)?",
    a: "Incluye todas las clases grabadas: alrededor de 30 enseñanzas impartidas desde 2023 hasta hoy, organizadas por niveles (Nivel Básico, Nivel Intermedio, Nivel Avanzado y Profecía Forense), más el libro «El Manual para Escuchar a Dios» de regalo. Tienes acceso 24/7 y también recibirás las nuevas enseñanzas que se vayan publicando. No incluye mentoría personalizada ni clases por Zoom.",
  },
  {
    q: "¿Por qué se paga con criptomonedas?",
    a: "Porque en varios países hay bloqueos que impiden pagar con tarjeta bancaria, y no queríamos dejar fuera a esos hermanos. Al pagar puedes elegir entre Bitcoin, USDT, Ethereum y más de 100 opciones. Si no puedes pagar con criptomonedas, puedes hacer una donación en PayPal por el importe exacto del nivel al que quieres acceder.",
  },
  {
    destacada: true,
    q: "¿Puedo pagar con tarjeta en lugar de criptomonedas?",
    a: "Sí. Se hace mediante una donación en PayPal por el importe exacto del nivel que quieras: $333 la Meditación Profética o $555 la Escuela de Profetas. Antes de darte el enlace queremos que leas un aviso importante, para que nadie pague por un contenido que ya tiene:",
    pago: true,
  },
  {
    q: "Ya pagué, ¿cuándo tendré acceso?",
    a: "El acceso se activa automáticamente en cuanto la red confirma tu pago. Con Bitcoin suele tardar entre 20 y 40 minutos, y recibirás un correo de bienvenida en cuanto esté listo. Si pasado ese tiempo sigues sin poder entrar, inicia sesión y pulsa «Escríbenos y te activamos manualmente»: revisaremos tu pago personalmente.",
  },
  {
    q: "¿El acceso caduca?",
    a: "No. El pago es único y el acceso es permanente, disponible 24/7 desde cualquier dispositivo. Además, todo el contenido nuevo que se publique en tu formación queda incluido sin coste adicional.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Lo más importante es tener hambre espiritual y disposición para aprender. La Meditación Profética es el nivel más accesible, pensado para quienes quieren comenzar a tener encuentros verdaderos con el mundo espiritual: el reino espiritual está en la mente, y los ángeles fueron descritos en la Biblia como figuras que muchos toman por imaginarias. Aquí aprenderás cómo entrar realmente al mundo espiritual. La Escuela de Profetas te lleva después paso a paso desde el Nivel Básico hasta la Profecía Forense, donde se ven nombres, fechas y detalles específicos.",
  },
];

/**
 * Aviso previo al pago por PayPal.
 *
 * El enlace de pago no se muestra de entrada: primero hay que leer que estas
 * clases son las mismas de las membresías 4 y 5 de YouTube. Así nadie compra
 * un contenido que ya tiene. Va aquí y no en la sección de Donaciones, para
 * no confundir a quien solo quiere hacer una ofrenda al ministerio.
 */
function PagoPayPal() {
  const [mostrar, setMostrar] = useState(false);

  // Paso 1: solo un botón. Quien no piense pagar con PayPal no ve nada más.
  if (!mostrar) {
    return (
      <div className="px-6 pt-4">
        <button
          onClick={() => setMostrar(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-gold px-6 py-3 rounded-xl text-sm font-bold"
        >
          Quiero pagar con PayPal
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  // Paso 2: el aviso y, debajo, el enlace de pago
  return (
    <div className="px-6 pt-4">
      <div className="rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/[0.06] p-5">
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
              <span className="text-[#c9a84c] font-bold">1.</span>{" "}
              <a href="/login?tab=register" className="text-white underline decoration-[#c9a84c]/50 hover:text-[#c9a84c]">
                Regístrate primero aquí
              </a>{" "}
              con el correo que vayas a usar. Sin este paso no podemos darte el acceso.
            </li>
            <li>
              <span className="text-[#c9a84c] font-bold">2.</span> Haz una donación en PayPal por
              el <strong className="text-white">importe exacto</strong> del nivel que quieras:{" "}
              <strong className="text-[#c9a84c]">$333</strong> la Meditación Profética o{" "}
              <strong className="text-[#c9a84c]">$555</strong> la Escuela de Profetas.
            </li>
            <li>
              <span className="text-[#c9a84c] font-bold">3.</span> Escríbenos a{" "}
              <a href="mailto:100x100cristianos@gmail.com" className="text-[#c9a84c] underline">
                100x100cristianos@gmail.com
              </a>{" "}
              con la captura del comprobante e indicando el nivel que elegiste ($333 o $555).
            </li>
            <li>
              <span className="text-[#c9a84c] font-bold">4.</span> Activamos tu acceso
              manualmente en menos de 24 horas.
            </li>
          </ol>
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=PTBWKZKKV3HJG"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-gold px-7 py-3.5 rounded-xl text-sm font-bold"
          >
            Entiendo, ir a pagar con PayPal
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

/** Lista de preguntas reutilizable: se usa en la sección FAQ y en el formulario */
export function FaqLista() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className={`card-dark rounded-xl overflow-hidden ${f.destacada ? "border border-[#c9a84c]/40" : ""}`}>
          <button
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold text-white text-sm sm:text-base group-hover:text-[#c9a84c] transition-colors">
              {f.destacada && (
                <span className="block text-[#c9a84c] text-[10px] font-bold tracking-widest uppercase mb-1">
                  Empieza por aquí
                </span>
              )}
              {f.q}
            </span>
            <ChevronDown
              size={20}
              className={`shrink-0 text-[#c9a84c] transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-400 ease-in-out ${
              open === i ? (f.pago ? "max-h-[60rem] pb-6" : "max-h-[32rem] pb-6") : "max-h-0"
            }`}
          >
            <p className="px-6 text-[#b8a888] text-sm leading-relaxed">{f.a}</p>
            {f.pago && <div className="mt-4"><PagoPayPal /></div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FAQ() {

  return (
    <section id="preguntas" className="relative py-24 lg:py-32 overflow-hidden scroll-mt-24">
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
          <p className="text-[#b8a888] max-w-xl mx-auto text-sm sm:text-base">
            Antes de escribirnos, revisa estas respuestas: aquí resolvemos las dudas
            más habituales sobre <span className="text-[#c9a84c]">qué formación elegir</span>.
          </p>
          <div className="divider-gold max-w-xs mx-auto mt-6" />
        </div>

        <FaqLista />
      </div>
    </section>
  );
}

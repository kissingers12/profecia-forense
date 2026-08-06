"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs: { q: string; a: string; destacada?: boolean }[] = [
  {
    destacada: true,
    q: "¿Qué formación debo elegir?",
    a: "Depende de dónde estés hoy. La Escuela de Profetas ($555) reúne todas las clases grabadas desde 2023 hasta hoy — alrededor de 30 enseñanzas — y está pensada especialmente para quienes llevan poco tiempo en la membresía 4 de YouTube. Si ya estás en la membresía 5, o llevas bastante tiempo en la membresía 4, este programa no es para ti, porque ya habrás visto la mayor parte del contenido. Si estás comenzando y quieres desarrollar primero tu sensibilidad espiritual, la Meditación Profética ($333) es el punto de partida.",
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
    a: "Porque en varios países hay bloqueos que impiden pagar con tarjeta bancaria, y no queríamos dejar fuera a esos hermanos. Al pagar puedes elegir entre Bitcoin, USDT, Ethereum y más de 100 opciones. Si no puedes pagar con criptomonedas, escríbenos y te indicamos otra forma.",
  },
  {
    destacada: true,
    q: "¿Puedo pagar con tarjeta en lugar de criptomonedas?",
    a: "Sí, a través de PayPal. Primero regístrate aquí en la web creando tu cuenta con el correo que vayas a usar — este paso es imprescindible. Después escríbenos a 100x100cristianos@gmail.com adjuntando la captura del comprobante e indicando el nivel que elegiste ($333 o $555), y activaremos tu acceso manualmente en menos de 24 horas. MUY IMPORTANTE antes de pagar: si vienes de YouTube, ten en cuenta que estas clases son exactamente las mismas que se impartieron en las membresías 4 y 5, reunidas desde 2023 hasta hoy. Si ya llevas tiempo en la membresía 4 o en la 5, esta escuela NO es para ti, porque sería contenido que ya has visto.",
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
    a: "No. Lo más importante es tener hambre espiritual y disposición para aprender. La Meditación Profética es ideal para quien comienza, y la Escuela de Profetas te lleva paso a paso desde el Nivel Básico hasta la Profecía Forense, donde se ven nombres, fechas y detalles específicos.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

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

        {/* Accordion */}
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
                  className={`shrink-0 text-[#c9a84c] transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  open === i ? "max-h-[32rem] pb-6" : "max-h-0"
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

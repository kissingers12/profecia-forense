"use client";

import { useState } from "react";
import { Send, CheckCircle, HelpCircle } from "lucide-react";
import { FaqLista } from "./FAQ";

const motivos = [
  "Oración",
  "Pregunta sobre la formación profética",
  "Inscribirme en un programa",
  "Otro",
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [verFormulario, setVerFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    programa: "",
    mensaje: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          programa: form.programa,
          mensaje: form.mensaje,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("No se pudo enviar el mensaje. Intenta de nuevo.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  // El texto de ejemplo se adapta al motivo: pedir "cuéntanos tu llamado"
  // a quien busca oración no tenía sentido
  const ejemploMensaje =
    form.programa === "Oración"
      ? "Haznos saber tu petición de oración..."
      : form.programa === "Otro"
      ? "Cuéntanos en qué podemos ayudarte..."
      : "Cuéntanos sobre ti y tu llamado...";

  const etiquetaMensaje = form.programa === "Oración" ? "Tu petición de oración" : "Mensaje";

  // Motivos cuya respuesta casi siempre está en las preguntas frecuentes
  const resuelveFaq =
    form.programa === "Pregunta sobre la formación profética" ||
    form.programa === "Inscribirme en un programa";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="contacto" className="relative py-24 lg:py-32 overflow-hidden section-bg-alt">
      <div className="orb orb-blue w-[400px] h-[400px] top-0 left-0 opacity-10 absolute" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Da el primer <span className="text-[#c9a84c]">paso</span>
          </h2>
          <p className="text-[#b8a888] max-w-lg mx-auto">
            Completa el formulario y un asesor se pondrá en contacto contigo
            para orientarte en el programa que mejor se adapte a tu llamado.
          </p>

          {/* Desvía a las preguntas frecuentes la duda más repetida */}
          <a
            href="#preguntas"
            className="inline-flex items-center gap-2 mt-6 rounded-xl border border-[#c9a84c]/35 bg-[#c9a84c]/5 px-5 py-3 text-sm text-[#c8b89a] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/60 transition-all"
          >
            <HelpCircle size={16} className="text-[#c9a84c] shrink-0" />
            <span>
              ¿Tu duda es <span className="text-[#c9a84c] font-semibold">qué formación elegir</span>?
              Léelo aquí antes de escribir →
            </span>
          </a>

          <div className="divider-gold max-w-xs mx-auto mt-8" />
        </div>

        {submitted ? (
          <div className="card-dark rounded-2xl p-12 text-center">
            <CheckCircle size={56} className="text-[#c9a84c] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">¡Mensaje enviado!</h3>
            <p className="text-[#b8a888]">
              Gracias por comunicarte. Nuestro equipo te responderá pronto.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="card-dark rounded-2xl p-8 lg:p-10 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre completo"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@correo.com"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="+1 000 000 0000"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Motivo de contacto
                </label>
                <select
                  name="programa"
                  value={form.programa}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a20] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-[#c8b89a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                >
                  <option value="">Seleccionar...</option>
                  {motivos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Si la consulta es sobre la formación, primero las respuestas.
                La mayoría resuelve su duda aquí sin tener que escribir. */}
            {resuelveFaq ? (
              <div className="pt-2">
                <div className="rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/[0.06] p-5 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle size={16} className="text-[#c9a84c] shrink-0" />
                    <span className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest">
                      Tu respuesta está aquí
                    </span>
                  </div>
                  <p className="text-[#e8dcc8] text-sm leading-relaxed">
                    Estas son las dudas que más nos llegan sobre las formaciones. Búscala abajo:
                    casi siempre está resuelta y podrás avanzar sin esperar respuesta.
                  </p>
                </div>

                <FaqLista />

                {!verFormulario ? (
                  <button
                    type="button"
                    onClick={() => setVerFormulario(true)}
                    className="mt-6 w-full text-center text-sm text-[#8a7a6a] hover:text-[#c9a84c] transition-colors py-2"
                  >
                    Mi duda no está aquí, quiero escribiros →
                  </button>
                ) : (
                  <div className="mt-6 space-y-5 border-t border-[#c9a84c]/15 pt-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                        Cuéntanos tu duda
                      </label>
                      <textarea
                        name="mensaje"
                        value={form.mensaje}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Escríbenos aquí lo que no encontraste arriba..."
                        className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
                      />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={18} />
                          Enviar mensaje
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                    {etiquetaMensaje}
                  </label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    rows={4}
                    placeholder={ejemploMensaje}
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Send, CheckCircle, Church, MapPin, User, Mail, MessageSquare, Globe } from "lucide-react";

export default function ChurchInvite() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    iglesia: "",
    direccion: "",
    ciudad: "",
    rol: "",
    motivo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="testimonios" className="relative py-24 lg:py-32 overflow-hidden section-bg-alt">
      <div className="orb orb-blue w-[450px] h-[450px] bottom-0 right-0 opacity-10 absolute" />
      <div className="orb orb-purple w-[350px] h-[350px] top-0 left-0 opacity-10 absolute" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Visitas ministeriales
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            ¿Quieres que vayamos{" "}
            <span className="text-[#c9a84c]">a tu iglesia?</span>
          </h2>
          <p className="text-[#b8a888] max-w-xl mx-auto text-base leading-relaxed">
            Si sientes que tu congregación necesita una impartición profética,
            una conferencia o una activación ministerial, nos encantaría
            conocerte. Cuéntanos sobre ti y tu iglesia.
          </p>
          <div className="divider-gold max-w-xs mx-auto mt-8" />
        </div>

        {submitted ? (
          <div className="card-dark rounded-2xl p-12 text-center">
            <CheckCircle size={56} className="text-[#c9a84c] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">¡Solicitud recibida!</h3>
            <p className="text-[#b8a888] leading-relaxed">
              Gracias por tu interés. Revisaremos tu solicitud y nos comunicaremos
              contigo al correo <span className="text-[#c9a84c]">{form.email}</span> en los
              próximos días para coordinar los detalles.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-dark rounded-2xl p-8 lg:p-10 space-y-5">

            {/* Sección: Sobre ti */}
            <div className="flex items-center gap-2 mb-1">
              <User size={15} className="text-[#c9a84c]" />
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                Sobre ti
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Tu nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="¿Cómo te llamas?"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Tu email *
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c]" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@correo.com"
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                ¿Eres el pastor o un líder de la iglesia? *
              </label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0a20] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-[#c8b89a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
              >
                <option value="">Selecciona tu rol...</option>
                <option value="pastor">Soy el Pastor / Pastora principal</option>
                <option value="pastor-asociado">Soy Pastor / Pastora asociado(a)</option>
                <option value="lider">Soy líder de ministerio o célula</option>
                <option value="anciano">Soy anciano / Diácono</option>
                <option value="coordinador">Soy coordinador(a) de eventos</option>
                <option value="otro">Otro rol</option>
              </select>
            </div>

            {/* Divider */}
            <div className="divider-gold my-2" />

            {/* Sección: Tu iglesia */}
            <div className="flex items-center gap-2 mb-1">
              <Church size={15} className="text-[#c9a84c]" />
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                Tu iglesia
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                Nombre de la iglesia *
              </label>
              <input
                type="text"
                name="iglesia"
                value={form.iglesia}
                onChange={handleChange}
                required
                placeholder="¿Cómo se llama tu iglesia?"
                className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Dirección *
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c]" />
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Calle, número..."
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                  Ciudad y país *
                </label>
                <div className="relative">
                  <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c]" />
                  <input
                    type="text"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    required
                    placeholder="Ciudad, País"
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="divider-gold my-2" />

            {/* Sección: Motivo */}
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={15} className="text-[#c9a84c]" />
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                ¿Por qué quieres que visitemos tu iglesia?
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                Cuéntanos *
              </label>
              <textarea
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                required
                rows={4}
                placeholder="¿Qué necesita tu congregación? ¿Qué tipo de evento tienes en mente? ¿Hay algo específico que quieras que se ministre?"
                className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#5a4a3a] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="btn-gold w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Enviar solicitud
            </button>

            <p className="text-center text-xs text-[#6a5a4a]">
              Responderemos a tu correo en un plazo de 3 a 5 días hábiles.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

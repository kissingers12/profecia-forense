"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Gift } from "lucide-react";
import { saveSession } from "@/lib/auth";

function InvitacionContent() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (form.password !== form.confirm) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/invitacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo completar la invitación.");
      } else {
        saveSession({ email: data.user.email, name: data.user.name, plan: data.user.plan, accessCode: "", activated: data.user.activated });
        router.push("/dashboard");
        return;
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60";

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.jpg" alt="" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-[#050510]/85" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#c9a84c]/50 mb-4">
            <Image src="/logo.jpg" alt="100x100Cristianos" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            100x100 <span className="text-[#c9a84c]">Cristianos</span>
          </h1>
        </div>

        <div className="card-dark rounded-2xl p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <Gift size={28} className="text-[#c9a84c] mb-3" />
            <h2 className="text-white font-bold text-lg">Has recibido una invitación</h2>
            <p className="text-[#8a7a6a] text-sm mt-1">
              Escribe el correo en el que recibiste la invitación y crea tu contraseña para ver tus clases.
            </p>
          </div>

          {!token ? (
            <p className="text-red-400 text-sm text-center">
              Este enlace está incompleto. Ábrelo directamente desde el correo o mensaje que recibiste.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Tu correo</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" placeholder="tu@correo.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Crea tu contraseña</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required autoComplete="new-password" placeholder="Mínimo 6 caracteres" className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a5a4a] hover:text-[#c9a84c]">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Repite la contraseña</label>
                <input type={showPwd ? "text" : "password"} name="confirm" value={form.confirm} onChange={handleChange} required autoComplete="new-password" className={inputClass} />
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : "Entrar a mis clases"}
              </button>

              <p className="text-center text-xs text-[#6a5a4a]">
                ¿Ya creaste tu contraseña?{" "}
                <a href="/login" className="text-[#c9a84c] hover:underline">Inicia sesión aquí</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvitacionPage() {
  return (
    <Suspense>
      <InvitacionContent />
    </Suspense>
  );
}

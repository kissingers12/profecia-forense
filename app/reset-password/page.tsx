"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Mail, KeyRound, Lock, CheckCircle } from "lucide-react";

type Step = "email" | "code" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStep("code");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) { setError("Las contraseñas no coinciden."); return; }
    if (newPassword.length < 6) { setError("Mínimo 6 caracteres."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Código incorrecto."); }
      else { setStep("done"); }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.jpg" alt="" fill className="object-cover opacity-10" />
        <div className="absolute inset-0 bg-[#050510]/90" />
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
          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-3">
                  <Mail size={22} className="text-[#c9a84c]" />
                </div>
                <h2 className="text-white font-bold text-lg">Recuperar contraseña</h2>
                <p className="text-[#8a7a6a] text-sm mt-1">Te enviaremos un código a tu correo</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Correo electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@correo.com"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : <><Mail size={16} />Enviar código</>}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={22} className="text-[#c9a84c]" />
                </div>
                <h2 className="text-white font-bold text-lg">Ingresa el código</h2>
                <p className="text-[#8a7a6a] text-sm mt-1">Revisa tu correo <span className="text-[#c9a84c]">{email}</span></p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Código de 6 dígitos</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="000000" maxLength={6}
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm text-center text-xl tracking-[0.5em] focus:outline-none focus:border-[#c9a84c]/60" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Nueva contraseña</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Confirmar contraseña</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="••••••••"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : <><Lock size={16} />Cambiar contraseña</>}
              </button>
              <button type="button" onClick={() => { setStep("email"); setError(""); }} className="w-full text-center text-xs text-[#6a5a4a] hover:text-[#c9a84c]">
                Reenviar código
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="text-center space-y-5 py-4">
              <CheckCircle size={48} className="text-[#c9a84c] mx-auto" />
              <h2 className="text-white font-bold text-lg">¡Contraseña cambiada!</h2>
              <p className="text-[#8a7a6a] text-sm">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <button onClick={() => router.push("/login")} className="btn-gold w-full py-3.5 rounded-xl font-bold">
                Iniciar sesión
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/login" className="inline-flex items-center gap-1.5 text-[#6a5a4a] hover:text-[#c9a84c] text-sm transition-colors">
            <ArrowLeft size={14} />
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}

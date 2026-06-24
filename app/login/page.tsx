"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft, ShieldCheck } from "lucide-react";
import { saveSession } from "@/lib/auth";

const PLANS = [
  { value: "meditaciones", label: "Meditación Profética", price: 333, payUrl: "https://nowpayments.io/payment/?iid=6358579774&paymentId=4532704630" },
  { value: "escuela", label: "Escuela Avanzada de Profecía", price: 777, payUrl: "https://nowpayments.io/payment/?iid=5100234736&paymentId=5746183612" },
];

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultTab = params.get("tab") === "register" ? "register" : "login";

  const [tab, setTab] = useState<"login" | "register">(defaultTab as "login" | "register");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Register state
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirm: "", plan: "" });
  const [registered, setRegistered] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setError("");
  };
  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    // Load stored accounts
    const accounts = JSON.parse(localStorage.getItem("pf_accounts") || "{}");
    const account = accounts[loginForm.email];
    if (account && account.password === loginForm.password) {
      saveSession({ email: loginForm.email, name: account.name, plan: account.plan, accessCode: "" });
      router.push("/dashboard");
    } else {
      setError("Correo o contraseña incorrectos.");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) { setError("Las contraseñas no coinciden."); return; }
    if (regForm.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (!regForm.plan) { setError("Selecciona un programa."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const accounts = JSON.parse(localStorage.getItem("pf_accounts") || "{}");
    if (accounts[regForm.email]) { setError("Ya existe una cuenta con ese correo."); setLoading(false); return; }
    accounts[regForm.email] = { name: regForm.name, password: regForm.password, plan: regForm.plan };
    localStorage.setItem("pf_accounts", JSON.stringify(accounts));
    setRegistered(true);
    setLoading(false);
  };

  const selectedPlan = PLANS.find((p) => p.value === regForm.plan);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg.jpg" alt="" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-[#050510]/85" />
      </div>
      <div className="orb orb-purple w-96 h-96 top-0 right-0 opacity-10 absolute" />
      <div className="orb orb-blue w-80 h-80 bottom-0 left-0 opacity-10 absolute" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#c9a84c]/50 mb-4">
            <Image src="/logo.jpg" alt="Profecía Forense" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Profecía <span className="text-[#c9a84c]">Forense</span>
          </h1>
          <p className="text-[#8a7a6a] text-sm mt-1">Tu formación espiritual te espera</p>
        </div>

        <div className="card-dark rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-7">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "login" ? "bg-[#c9a84c] text-[#050510]" : "text-[#8a7a6a] hover:text-white"}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "register" ? "bg-[#c9a84c] text-[#050510]" : "text-[#8a7a6a] hover:text-white"}`}
            >
              Registrarse
            </button>
          </div>

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Correo electrónico</label>
                <input type="email" name="email" value={loginForm.email} onChange={handleLoginChange} required placeholder="tu@correo.com"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Contraseña</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} name="password" value={loginForm.password} onChange={handleLoginChange} required placeholder="••••••••"
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 pr-11 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a5a4a] hover:text-[#c9a84c]">
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : <><LogIn size={17} />Ingresar</>}
              </button>
              <p className="text-center text-xs text-[#6a5a4a] mt-2">
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={() => setTab("register")} className="text-[#c9a84c] underline">Regístrate aquí</button>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === "register" && !registered && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Nombre completo</label>
                <input type="text" name="name" value={regForm.name} onChange={handleRegChange} required placeholder="Tu nombre"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Correo electrónico</label>
                <input type="email" name="email" value={regForm.email} onChange={handleRegChange} required placeholder="tu@correo.com"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Contraseña</label>
                  <input type="password" name="password" value={regForm.password} onChange={handleRegChange} required placeholder="••••••••"
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Confirmar</label>
                  <input type="password" name="confirm" value={regForm.confirm} onChange={handleRegChange} required placeholder="••••••••"
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Programa</label>
                <select name="plan" value={regForm.plan} onChange={handleRegChange} required
                  className="w-full bg-[#0a0a20] border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-[#c8b89a] text-sm focus:outline-none focus:border-[#c9a84c]/60">
                  <option value="">Seleccionar programa...</option>
                  {PLANS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label} — ${p.price}</option>
                  ))}
                </select>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : <><UserPlus size={17} />Crear cuenta y pagar</>}
              </button>
            </form>
          )}

          {/* ── AFTER REGISTER: show payment ── */}
          {tab === "register" && registered && (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center mx-auto">
                <ShieldCheck size={28} className="text-[#c9a84c]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">¡Cuenta creada!</h3>
                <p className="text-[#b8a888] text-sm">
                  Completa el pago para activar tu acceso a{" "}
                  <span className="text-[#c9a84c] font-semibold">{selectedPlan?.label}</span>.
                </p>
              </div>
              <div className="card-dark rounded-xl p-5 text-left">
                <p className="text-[#8a7a6a] text-xs mb-1">Total a pagar</p>
                <p className="text-3xl font-bold text-white">${selectedPlan?.price} <span className="text-sm text-[#8a7a6a]">USD</span></p>
                <p className="text-[#6a5a4a] text-xs mt-1">Pago único · Acceso de por vida</p>
              </div>
              <a
                href={selectedPlan?.payUrl ?? "#"}
                className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-base"
              >
                Proceder al pago — ${selectedPlan?.price}
              </a>
              <p className="text-center text-xs text-[#6a5a4a]">
                Por ahora solo disponible pago con criptomonedas.{" "}
                <span className="text-[#c9a84c]/70">Próximamente todos los métodos de pago.</span>
              </p>
              <p className="text-[#6a5a4a] text-xs">
                Después de pagar recibirás acceso inmediato.{" "}
                <button onClick={() => { setTab("login"); setRegistered(false); }} className="text-[#c9a84c] underline">
                  Iniciar sesión
                </button>
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="inline-flex items-center gap-1.5 text-[#6a5a4a] hover:text-[#c9a84c] text-sm transition-colors">
            <ArrowLeft size={14} />
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

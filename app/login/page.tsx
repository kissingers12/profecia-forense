"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft, ShieldCheck } from "lucide-react";
import { saveSession } from "@/lib/auth";

const PLANS = [
  { value: "meditaciones", label: "Meditación Profética", price: 333 },
  { value: "escuela", label: "Escuela Avanzada de Profecía", price: 777 },
];

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultTab = params.get("tab") === "register" ? "register" : "login";
  const defaultPlan = params.get("plan") ?? "";

  const [tab, setTab] = useState<"login" | "register">(defaultTab as "login" | "register");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", confirm: "", plan: defaultPlan, countryCode: "+1", phone: "" });
  const [registered, setRegistered] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [price, setPrice] = useState(0);

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
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Correo o contraseña incorrectos.");
      } else {
        saveSession({ email: data.user.email, name: data.user.name, plan: data.user.plan, accessCode: "", activated: data.user.activated });
        router.push("/dashboard");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) { setError("Las contraseñas no coinciden."); return; }
    if (regForm.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (!regForm.plan) { setError("Selecciona un programa."); return; }
    const whatsapp = regForm.phone ? `${regForm.countryCode}${regForm.phone.replace(/\s/g, "")}` : "";
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regForm.email, name: regForm.name, password: regForm.password, plan: regForm.plan, whatsapp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta.");
      } else {
        saveSession({ email: data.user.email, name: data.user.name, plan: data.user.plan, accessCode: "", activated: false });
        setPaymentUrl(data.paymentUrl);
        setPrice(data.price);
        setRegistered(true);
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    }
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
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#c9a84c]/50 mb-4">
            <Image src="/logo.jpg" alt="100x100Cristianos" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            100x100 <span className="text-[#c9a84c]">Cristianos</span>
          </h1>
          <p className="text-[#8a7a6a] text-sm mt-1">Tu formación espiritual te espera</p>
        </div>

        <div className="card-dark rounded-2xl p-8">
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
              <div className="flex items-center justify-between mt-2">
                <a href="/reset-password" className="text-xs text-[#6a5a4a] hover:text-[#c9a84c] transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
                <button type="button" onClick={() => setTab("register")} className="text-xs text-[#c9a84c] underline">
                  Regístrate aquí
                </button>
              </div>
            </form>
          )}

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

              {regForm.plan === "escuela" && (
                <div>
                  <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                    WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={regForm.countryCode}
                      onChange={(e) => setRegForm({ ...regForm, countryCode: e.target.value })}
                      className="bg-[#0a0a20] border border-[#c9a84c]/20 rounded-xl px-3 py-3 text-[#c8b89a] text-sm focus:outline-none focus:border-[#c9a84c]/60 w-32 shrink-0"
                    >
                      {[
                        // Principales
                        ["+1","🇺🇸 EE.UU. / Canadá +1"],["+34","🇪🇸 España +34"],
                        // LATINOAMÉRICA
                        ["+54","🇦🇷 Argentina +54"],["+501","🇧🇿 Belice +501"],["+591","🇧🇴 Bolivia +591"],
                        ["+55","🇧🇷 Brasil +55"],["+56","🇨🇱 Chile +56"],["+57","🇨🇴 Colombia +57"],
                        ["+506","🇨🇷 Costa Rica +506"],["+53","🇨🇺 Cuba +53"],["+593","🇪🇨 Ecuador +593"],
                        ["+503","🇸🇻 El Salvador +503"],["+502","🇬🇹 Guatemala +502"],["+592","🇬🇾 Guyana +592"],
                        ["+509","🇭🇹 Haití +509"],["+504","🇭🇳 Honduras +504"],["+1-876","🇯🇲 Jamaica +1-876"],
                        ["+52","🇲🇽 México +52"],["+505","🇳🇮 Nicaragua +505"],["+507","🇵🇦 Panamá +507"],
                        ["+595","🇵🇾 Paraguay +595"],["+51","🇵🇪 Perú +51"],["+1-787","🇵🇷 Puerto Rico +1-787"],
                        ["+1-809","🇩🇴 R. Dominicana +1-809"],["+597","🇸🇷 Surinam +597"],["+1-868","🇹🇹 Trinidad y Tobago +1-868"],
                        ["+598","🇺🇾 Uruguay +598"],["+58","🇻🇪 Venezuela +58"],
                        // EUROPA
                        ["+355","🇦🇱 Albania +355"],["+49","🇩🇪 Alemania +49"],["+376","🇦🇩 Andorra +376"],
                        ["+43","🇦🇹 Austria +43"],["+32","🇧🇪 Bélgica +32"],["+375","🇧🇾 Bielorrusia +375"],
                        ["+387","🇧🇦 Bosnia y Herz. +387"],["+359","🇧🇬 Bulgaria +359"],["+357","🇨🇾 Chipre +357"],
                        ["+385","🇭🇷 Croacia +385"],["+45","🇩🇰 Dinamarca +45"],["+421","🇸🇰 Eslovaquia +421"],
                        ["+386","🇸🇮 Eslovenia +386"],["+372","🇪🇪 Estonia +372"],["+358","🇫🇮 Finlandia +358"],
                        ["+33","🇫🇷 Francia +33"],["+30","🇬🇷 Grecia +30"],["+36","🇭🇺 Hungría +36"],
                        ["+353","🇮🇪 Irlanda +353"],["+354","🇮🇸 Islandia +354"],["+39","🇮🇹 Italia +39"],
                        ["+383","🇽🇰 Kosovo +383"],["+371","🇱🇻 Letonia +371"],["+423","🇱🇮 Liechtenstein +423"],
                        ["+370","🇱🇹 Lituania +370"],["+352","🇱🇺 Luxemburgo +352"],["+356","🇲🇹 Malta +356"],
                        ["+373","🇲🇩 Moldavia +373"],["+377","🇲🇨 Mónaco +377"],["+382","🇲🇪 Montenegro +382"],
                        ["+389","🇲🇰 N. Macedonia +389"],["+47","🇳🇴 Noruega +47"],["+31","🇳🇱 Países Bajos +31"],
                        ["+48","🇵🇱 Polonia +48"],["+351","🇵🇹 Portugal +351"],["+44","🇬🇧 Reino Unido +44"],
                        ["+420","🇨🇿 Rep. Checa +420"],["+40","🇷🇴 Rumanía +40"],["+7","🇷🇺 Rusia +7"],
                        ["+381","🇷🇸 Serbia +381"],["+46","🇸🇪 Suecia +46"],["+41","🇨🇭 Suiza +41"],
                        ["+380","🇺🇦 Ucrania +380"],
                        // OTROS
                        ["+966","🇸🇦 Arabia Saudita +966"],["+61","🇦🇺 Australia +61"],["+63","🇵🇭 Filipinas +63"],
                        ["+233","🇬🇭 Ghana +233"],["+91","🇮🇳 India +91"],["+62","🇮🇩 Indonesia +62"],
                        ["+81","🇯🇵 Japón +81"],["+254","🇰🇪 Kenia +254"],["+212","🇲🇦 Marruecos +212"],
                        ["+234","🇳🇬 Nigeria +234"],["+64","🇳🇿 Nueva Zelanda +64"],["+65","🇸🇬 Singapur +65"],
                        ["+27","🇿🇦 Sudáfrica +27"],["+886","🇹🇼 Taiwán +886"],["+216","🇹🇳 Túnez +216"],
                        ["+90","🇹🇷 Turquía +90"],["+84","🇻🇳 Vietnam +84"],["+263","🇿🇼 Zimbabwe +263"],
                        ["+20","🇪🇬 Egipto +20"],["+971","🇦🇪 Emiratos Árabes +971"],["+82","🇰🇷 Corea del Sur +82"],
                        ["+86","🇨🇳 China +86"],
                      ].map(([val, label]) => (
                        <option key={label} value={val}>{label}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      required={regForm.plan === "escuela"}
                      placeholder="Número sin código"
                      className="flex-1 bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60"
                    />
                  </div>
                  <p className="text-[#6a5a4a] text-xs mt-1.5">Te añadiremos al grupo de WhatsApp de la Escuela Avanzada</p>
                </div>
              )}

              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : <><UserPlus size={17} />Crear cuenta y pagar</>}
              </button>
            </form>
          )}

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
                <p className="text-3xl font-bold text-white">${price} <span className="text-sm text-[#8a7a6a]">USD</span></p>
                <p className="text-[#6a5a4a] text-xs mt-1">Pago único · Acceso de por vida</p>
              </div>
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-base"
              >
                Proceder al pago — ${price}
              </a>
              <p className="text-center text-xs text-[#6a5a4a]">
                Elige tu criptomoneda favorita —{" "}
                <span className="text-[#c9a84c]/70">Bitcoin, USDT, ETH y más de 100 opciones.</span>
              </p>
              <p className="text-[#6a5a4a] text-xs">
                Después del pago, tu acceso se activará automáticamente en minutos.{" "}
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

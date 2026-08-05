"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Lock, Users, LogOut, LogIn, Download, Activity, Search, PlayCircle, Copy, UserPlus, DollarSign, MessageCircle, Eye, EyeOff, Trash2, Send, Pencil, KeyRound, Mail } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string;
  plan: string;
  activated: boolean;
  created_at: string;
};

type Log = {
  id: number;
  user_email: string;
  user_name: string;
  action: string;
  created_at: string;
};

type ForoPost = {
  id: number;
  user_email: string;
  user_name: string;
  question: string;
  answer: string | null;
  hidden: boolean;
  created_at: string;
  answered_at: string | null;
  responder_name: string | null;
};

type PaymentRow = {
  id: number;
  email: string;
  fecha: string;
  status: string;
  precio: number;
  pagado: number;
  requerido: number;
  moneda: string;
  recibido: number;
  monedaRecibida: string;
  paymentId: string;
  nombre: string | null;
  plan: string | null;
  activado: boolean | null;
  avisoEnviado: string | null;
  bienvenidaEnviada: string | null;
};

const fechaCorta = (iso: string) =>
  new Date(iso).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const STABLES = ["usd", "usdc", "usdp", "usdt", "busd", "dai"];

// Formatea un importe con su moneda real: $555 si es dólar/stablecoin,
// 0.0086424 BTC si es cripto. Antes se ponía "$" a todo, lo que hacía
// parecer que un pago de 0.0086 BTC eran 0,008 dólares.
function importe(cantidad: number, moneda: string): string {
  const m = (moneda || "").toLowerCase();
  if (!m || STABLES.includes(m)) return `$${cantidad}`;
  return `${cantidad} ${m.toUpperCase()}`;
}

const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditación $333",
  mentoria: "Mentoría $555",
  escuela: "Escuela $777",
  clases: "Clases $555",
};

// Estados de NOWPayments traducidos
const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  waiting: { label: "Esperando pago", color: "text-[#8a7a6a] bg-white/5 border-white/10" },
  confirming: { label: "Confirmando en la red", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  confirmed: { label: "Confirmado", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  sending: { label: "Enviando", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  partially_paid: { label: "PAGO PARCIAL", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  finished: { label: "PAGADO ✓", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  failed: { label: "Fallido", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  refunded: { label: "Reembolsado", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  expired: { label: "Caducado", color: "text-[#6a5a4a] bg-white/5 border-white/10" },
};

type PaymentEntry = {
  payment_id: string | number;
  payment_status: string;
  order_id: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  outcome_amount: number;
  outcome_currency: string;
  created_at: string;
  user_name: string | null;
  user_activated: boolean | null;
  user_plan: string | null;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [foroPosts, setForoPosts] = useState<ForoPost[]>([]);
  const [foroAnswers, setForoAnswers] = useState<Record<number, string>>({});
  const [foroResponder, setForoResponder] = useState<Record<number, string>>({});
  const [foroLoading, setForoLoading] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editAnswers, setEditAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<"clientes" | "pagos" | "actividad" | "ingresos" | "foro" | "hotmart" | "email">("clientes");
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [logSearch, setLogSearch] = useState("");
  const [codes, setCodes] = useState<{ id: string; code: string; file_name: string; used: boolean; created_at: string }[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [newBook, setNewBook] = useState("both");
  const [newCustomCode, setNewCustomCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [setupDbLoading, setSetupDbLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [resetPwd, setResetPwd] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [paymentCheck, setPaymentCheck] = useState<Record<string, string> | null>(null);
  const [paymentCheckLoading, setPaymentCheckLoading] = useState(false);
  const [paymentsList, setPaymentsList] = useState<PaymentEntry[]>([]);
  const [paymentsListLoading, setPaymentsListLoading] = useState(false);
  const [paymentsListError, setPaymentsListError] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchUsers = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { headers: { "x-admin-password": pwd } });
      if (res.status === 401) { setAuthError("Contraseña incorrecta."); setAuthed(false); setLoading(false); return; }
      const data = await res.json();
      setUsers(data.users ?? []);
      setAuthed(true);
      setAuthError("");
      const [logsRes, foroRes] = await Promise.all([
        fetch("/api/admin/logs", { headers: { "x-admin-password": pwd } }),
        fetch("/api/admin/forum", { headers: { "x-admin-password": pwd } }),
      ]);
      if (logsRes.ok) setLogs((await logsRes.json()).logs ?? []);
      if (foroRes.ok) setForoPosts((await foroRes.json()).posts ?? []);
    } catch { setAuthError("Error de conexión."); }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchUsers(password);
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !resetPwd) return;
    setResetLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ email: resetEmail, newPassword: resetPwd }),
      });
      if (res.ok) {
        showToast("Contraseña cambiada ✓");
        setResetEmail(null);
        setResetPwd("");
      } else {
        const d = await res.json();
        showToast(d.error || "Error al cambiar contraseña.");
      }
    } catch {
      showToast("Error de conexión.");
    }
    setResetLoading(false);
  };

  const handleToggle = async (user: User) => {
    setActionLoading(user.email);
    try {
      const res = await fetch("/api/admin/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ email: user.email, activated: !user.activated }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => u.email === user.email ? { ...u, activated: !u.activated } : u)
        );
        if (user.activated) {
          showToast(`${user.name} desactivado`);
        } else if (data.emailSent) {
          showToast(`${user.name} activado ✓ · correo de bienvenida enviado 📧`);
        } else {
          showToast(`${user.name} activado ✓ · el correo NO salió: ${data.emailError ?? "error desconocido"}`);
        }
      }
    } catch {
      showToast("Error al actualizar.");
    }
    setActionLoading(null);
  };

  const handleNotifyUnpaid = async (email: string, nombre: string | null, yaEnviado?: string | null) => {
    const ok = window.confirm(
      yaEnviado
        ? `⚠️ A ${nombre ?? email} YA se le envió este aviso el ${new Date(yaEnviado).toLocaleString("es-ES")}.\n\n¿Quieres enviárselo otra vez?`
        : `¿Enviar a ${nombre ?? email} el aviso de que su pago no se completó?\n\nRecibirá el correo con el diseño de la web y las instrucciones para pagar.`
    );
    if (!ok) return;
    setActionLoading(email);
    try {
      const res = await fetch("/api/admin/notify-unpaid", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      showToast(res.ok ? `Aviso enviado a ${email} 📧` : (data.error ?? "No se pudo enviar."));
      if (res.ok) await fetchPayments();
    } catch {
      showToast("Error de conexión.");
    }
    setActionLoading(null);
  };

  const fetchPayments = async () => {
    setPaymentsLoading(true);
    try {
      const res = await fetch("/api/admin/payments", { headers: { "x-admin-password": password } });
      if (res.ok) setPayments((await res.json()).payments ?? []);
    } catch {
      showToast("Error al cargar los pagos.");
    }
    setPaymentsLoading(false);
  };

  const handleDeleteUser = async (user: User) => {
    const ok = window.confirm(
      `¿Eliminar el registro de ${user.name} (${user.email})?\n\nPodrá registrarse de nuevo en el futuro y elegir otro plan.`
    );
    if (!ok) return;
    setActionLoading(user.email);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.email !== user.email));
        showToast("Registro eliminado ✓");
      } else {
        showToast(data.error ?? "Error al eliminar.");
      }
    } catch {
      showToast("Error de conexión.");
    }
    setActionLoading(null);
  };

  const activatedCount = users.filter((u) => u.activated).length;
  const filteredUsers = users
    .filter((u) =>
      statusFilter === "active" ? u.activated :
      statusFilter === "pending" ? !u.activated :
      true
    )
    .filter((u) =>
      search.trim()
        ? u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.name.toLowerCase().includes(search.toLowerCase())
        : true
    );

  const handleStatClick = (filter: "all" | "active" | "pending") => {
    setStatusFilter((prev) => prev === filter ? "all" : filter);
    setActiveTab("clientes");
    setSearch("");
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => showToast("Email copiado ✓"));
  };

  const handleForoAnswer = async (postId: number) => {
    const answer = foroAnswers[postId]?.trim();
    if (!answer) return;
    const responderName = foroResponder[postId] ?? "Kissingers";
    setForoLoading(postId);
    const res = await fetch("/api/admin/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ postId, answer, responderName }),
    });
    if (res.ok) {
      setForoPosts((prev) => prev.map((p) => p.id === postId ? { ...p, answer, answered_at: new Date().toISOString(), responder_name: responderName } : p));
      setForoAnswers((prev) => { const n = { ...prev }; delete n[postId]; return n; });
      setForoResponder((prev) => { const n = { ...prev }; delete n[postId]; return n; });
      showToast("Respuesta publicada ✓");
    }
    setForoLoading(null);
  };

  const handleForoToggle = async (post: ForoPost) => {
    setForoLoading(post.id);
    const res = await fetch("/api/admin/forum", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ postId: post.id, hidden: !post.hidden }),
    });
    if (res.ok) {
      setForoPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, hidden: !p.hidden } : p));
      showToast(post.hidden ? "Pregunta visible ✓" : "Pregunta ocultada");
    }
    setForoLoading(null);
  };

  const handleForoEdit = async (postId: number) => {
    const answer = editAnswers[postId]?.trim();
    if (!answer) return;
    const responderName = foroResponder[postId] ?? "Kissingers";
    setForoLoading(postId);
    const res = await fetch("/api/admin/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ postId, answer, responderName }),
    });
    if (res.ok) {
      setForoPosts((prev) => prev.map((p) => p.id === postId ? { ...p, answer, responder_name: responderName } : p));
      setEditingPost(null);
      setEditAnswers((prev) => { const n = { ...prev }; delete n[postId]; return n; });
      showToast("Respuesta actualizada ✓");
    }
    setForoLoading(null);
  };

  const handleForoDelete = async (postId: number) => {
    if (!confirm("¿Eliminar esta pregunta permanentemente?")) return;
    setForoLoading(postId);
    const res = await fetch("/api/admin/forum", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) {
      setForoPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast("Pregunta eliminada");
    }
    setForoLoading(null);
  };

  const fetchCodes = async () => {
    setCodesLoading(true);
    const res = await fetch("/api/admin/download-codes", { headers: { "x-admin-password": password } });
    if (res.ok) setCodes((await res.json()).codes ?? []);
    setCodesLoading(false);
  };

  const handleCreateCode = async () => {
    setCodesLoading(true);
    setCodeError("");
    try {
      const res = await fetch("/api/admin/download-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ bookId: newBook, customCode: newCustomCode || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedCode(data.code);
        setCodeError("");
        setNewCustomCode("");
        await fetchCodes();
        showToast("Código creado ✓");
      } else {
        setCodeError(data.error === "TABLE_MISSING"
          ? "La tabla download_codes no existe en Supabase. Ejecuta el SQL en el editor de Supabase."
          : (data.error || "Error desconocido al crear el código."));
      }
    } catch (e) {
      setCodeError("Error de conexión. Verifica tu internet e intenta de nuevo.");
    }
    setCodesLoading(false);
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm("¿Eliminar este código permanentemente?")) return;
    const res = await fetch("/api/admin/download-codes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setCodes((prev) => prev.filter((c) => c.id !== id));
      showToast("Código eliminado");
    }
  };

  const handleSetupDb = async () => {
    setSetupDbLoading(true);
    try {
      const res = await fetch("/api/admin/setup-db", {
        method: "POST",
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      if (res.ok) {
        setCodeError("");
        showToast(data.message ?? "Base de datos actualizada ✓");
        await fetchCodes();
      } else {
        setCodeError(`Error al actualizar la base de datos: ${data.error}`);
      }
    } catch {
      setCodeError("Error de conexión al intentar crear la tabla.");
    }
    setSetupDbLoading(false);
  };

  const fetchPaymentsList = async () => {
    setPaymentsListLoading(true);
    setPaymentsListError("");
    try {
      const res = await fetch("/api/admin/payments-list", { headers: { "x-admin-password": password } });
      const data = await res.json();
      if (res.ok) {
        setPaymentsList(data.payments ?? []);
      } else {
        setPaymentsListError(data.error ?? "Error al cargar pagos.");
      }
    } catch {
      setPaymentsListError("Error de conexión.");
    }
    setPaymentsListLoading(false);
  };

  const handleActivateFromPayment = async (email: string) => {
    try {
      const res = await fetch("/api/admin/payments-list", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setPaymentsList((prev) =>
          prev.map((p) => p.order_id?.toLowerCase() === email.toLowerCase() ? { ...p, user_activated: true } : p)
        );
        setUsers((prev) => prev.map((u) => u.email === email ? { ...u, activated: true } : u));
        showToast("Cliente activado ✓");
      }
    } catch {
      showToast("Error al activar.");
    }
  };

  const handlePaymentCheck = async () => {
    setPaymentCheckLoading(true);
    try {
      const res = await fetch("/api/admin/check-payments", {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      setPaymentCheck(data);
    } catch {
      setPaymentCheck({ error: "Error de conexión." });
    }
    setPaymentCheckLoading(false);
  };

  const escuelaActivos = users.filter((u) => u.activated && u.plan === "escuela").length;
  const mentoriaActivos = users.filter((u) => u.activated && u.plan === "mentoria").length;
  const meditActivos = users.filter((u) => u.activated && u.plan === "meditaciones").length;
  const clasesActivos = users.filter((u) => u.activated && u.plan === "clases").length;
  const totalRevenue = escuelaActivos * 777 + meditActivos * 333 + clasesActivos * 555;

  const filteredLogs = logSearch.trim()
    ? logs.filter((l) =>
        l.user_email.toLowerCase().includes(logSearch.toLowerCase()) ||
        (l.user_name ?? "").toLowerCase().includes(logSearch.toLowerCase())
      )
    : logs;

  const EMAIL_TEMPLATES = [
    {
      id: "bienvenida",
      nombre: "🎉 Bienvenida — acceso activado",
      asunto: "¡Bienvenida a la Escuela de Profetas!",
      body: `Querida [NOMBRE],

¡Tu acceso ha sido activado! Ya puedes entrar a la plataforma con tu correo y contraseña.

Para ingresar:
1. Ve a kissingersaraque.com
2. Haz clic en "Iniciar sesión"
3. Escribe tu correo: [EMAIL]
4. Escribe tu contraseña

Si tienes algún problema para entrar, responde a este correo y te ayudamos de inmediato.

Estamos muy contentos de tenerte con nosotros. Que Dios te bendiga y llene de su presencia profética en cada clase.

Con amor,
Servicio al Estudiante
100x100Cristianos · kissingersaraque.com`,
    },
    {
      id: "pago-pendiente",
      nombre: "⏳ Pago en espera — sin cripto",
      asunto: "Tu acceso está casi listo",
      body: `Querida [NOMBRE],

Hemos recibido tu solicitud de acceso. Estamos verificando tu pago, lo cual puede tardar entre 10 y 30 minutos una vez confirmado en la red.

En cuanto se confirme, recibirás un correo de bienvenida con instrucciones para entrar.

Si tienes alguna duda o pasado ese tiempo no recibes respuesta, escríbenos directamente a este correo y te atendemos de inmediato.

Gracias por tu confianza.

Con cariño,
Servicio al Estudiante
100x100Cristianos · kissingersaraque.com`,
    },
    {
      id: "cambio-clave",
      nombre: "🔑 Cambio de contraseña manual",
      asunto: "Tu nueva contraseña — 100x100Cristianos",
      body: `Hola [NOMBRE],

Hemos actualizado tu contraseña de acceso a la plataforma.

Tus nuevos datos de acceso son:
• Correo: [EMAIL]
• Contraseña: [NUEVA_CLAVE]

Para entrar ve a: kissingersaraque.com → Iniciar sesión

Te recomendamos cambiar la contraseña una vez dentro desde la sección de perfil.

Si no solicitaste este cambio, responde a este correo de inmediato.

Con cariño,
Servicio al Estudiante
100x100Cristianos`,
    },
  ];

  const handleSendEmail = async () => {
    if (!emailTo || !emailSubject || !emailBody) return;
    setEmailSending(true);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ to: emailTo, subject: emailSubject, body: emailBody }),
      });
      if (res.ok) {
        showToast("Correo enviado ✓");
        setEmailTo("");
        setEmailSubject("");
        setEmailBody("");
        setSelectedTemplate("");
      } else {
        const d = await res.json();
        showToast(d.error || "Error al enviar.");
      }
    } catch {
      showToast("Error de conexión.");
    }
    setEmailSending(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mb-4">
              <Lock size={24} className="text-[#c9a84c]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
            <p className="text-[#6a5a4a] text-sm mt-1">100x100 Cristianos</p>
          </div>
          <form onSubmit={handleLogin} className="card-dark rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">
                Contraseña de administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60"
              />
            </div>
            {authError && <p className="text-red-400 text-xs">{authError}</p>}
            <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#c9a84c] text-[#050510] px-5 py-3 rounded-xl font-semibold text-sm shadow-lg">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#050510]/95 backdrop-blur-md border-b border-[#c9a84c]/20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-[#c9a84c]" />
            <span className="text-white font-bold">Panel Admin</span>
            <span className="text-[#6a5a4a] text-sm hidden sm:block">· 100x100 Cristianos</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchUsers(password)}
              disabled={loading}
              className="p-2 text-[#6a5a4a] hover:text-[#c9a84c] transition-colors"
              title="Actualizar"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => { setAuthed(false); setPassword(""); setUsers([]); }}
              className="btn-outline-gold px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut size={13} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleStatClick("all")}
            className={`card-dark rounded-2xl p-5 text-left transition-all ${statusFilter === "all" ? "ring-2 ring-white/30" : "hover:ring-1 hover:ring-white/10"}`}
          >
            <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-1">Total registrados</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </button>
          <button
            onClick={() => handleStatClick("active")}
            className={`card-dark rounded-2xl p-5 text-left transition-all ${statusFilter === "active" ? "ring-2 ring-[#c9a84c]/60" : "hover:ring-1 hover:ring-[#c9a84c]/20"}`}
          >
            <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-1">Con acceso activo</p>
            <p className="text-3xl font-bold text-[#c9a84c]">{activatedCount}</p>
          </button>
          <button
            onClick={() => handleStatClick("pending")}
            className={`card-dark rounded-2xl p-5 text-left transition-all ${statusFilter === "pending" ? "ring-2 ring-red-400/60" : "hover:ring-1 hover:ring-red-400/20"}`}
          >
            <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-red-400">{users.length - activatedCount}</p>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#c9a84c]/10 pb-0">
          <button
            onClick={() => setActiveTab("clientes")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "clientes"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <Users size={15} />
            Clientes
          </button>
          <button
            onClick={() => { setActiveTab("pagos"); fetchPayments(); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "pagos"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <DollarSign size={15} />
            Pagos
          </button>
          <button
            onClick={() => setActiveTab("actividad")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "actividad"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <Activity size={15} />
            Actividad
            {logs.length > 0 && (
              <span className="bg-[#c9a84c]/20 text-[#c9a84c] text-xs rounded-full px-1.5 py-0.5">{logs.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("ingresos")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "ingresos"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <DollarSign size={15} />
            Ingresos
          </button>
          <button
            onClick={() => setActiveTab("foro")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "foro"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <MessageCircle size={15} />
            Foro
            {foroPosts.filter((p) => !p.answer && !p.hidden).length > 0 && (
              <span className="bg-red-500/80 text-white text-xs rounded-full px-1.5 py-0.5">
                {foroPosts.filter((p) => !p.answer && !p.hidden).length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab("hotmart"); if (codes.length === 0) fetchCodes(); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "hotmart"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <KeyRound size={15} />
            Hotmart
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "email"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <Mail size={15} />
            Email
          </button>
        </div>

        {/* Tab: Clientes */}
        {activeTab === "clientes" && (
          loading ? (
            <div className="flex justify-center py-20">
              <span className="w-8 h-8 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="relative mb-5">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a5a4a]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por email o nombre..."
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a5a4a] hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              {filteredUsers.length === 0 ? (
                <div className="card-dark rounded-2xl p-10 text-center text-[#6a5a4a] text-sm">
                  No se encontró ningún cliente con ese email.
                </div>
              ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="card-dark rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                      {user.activated ? (
                        <span className="shrink-0 inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5">
                          <CheckCircle size={11} />
                          Activo
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5">
                          <XCircle size={11} />
                          Pendiente
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => copyEmail(user.email)}
                      className="flex items-center gap-1 text-[#8a7a6a] text-xs hover:text-[#c9a84c] transition-colors mt-0.5 max-w-full"
                    >
                      <span className="truncate">{user.email}</span>
                      <Copy size={11} className="shrink-0" />
                    </button>
                    <p className="text-[#6a5a4a] text-xs mt-0.5">
                      {PLAN_LABELS[user.plan] ?? user.plan} ·{" "}
                      {new Date(user.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(user)}
                      disabled={actionLoading === user.email}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                        user.activated
                          ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                          : "btn-gold"
                      }`}
                    >
                      {actionLoading === user.email ? (
                        <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin inline-block" />
                      ) : user.activated ? "Desactivar" : "Activar acceso"}
                    </button>
                    <button
                      onClick={() => { setResetEmail(user.email); setResetPwd(""); }}
                      className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-white/5 text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/10 transition-all"
                    >
                      <KeyRound size={13} />
                      Contraseña
                    </button>
                    {!user.activated && (
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={actionLoading === user.email}
                        title="Eliminar registro (podrá registrarse de nuevo)"
                        className="flex items-center justify-center gap-1.5 px-5 py-1.5 rounded-xl text-xs font-bold text-red-400/80 border border-red-500/20 hover:bg-red-500/10 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={12} />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
              )}
            </>
          )
        )}

        {/* Tab: Pagos */}
        {activeTab === "pagos" && (
          <div className="space-y-4">
            <div className="card-dark rounded-2xl p-5 border border-[#c9a84c]/15">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">Pagos recibidos de NOWPayments</p>
                  <p className="text-[#8a7a6a] text-xs leading-relaxed max-w-xl">
                    Cada aviso que NOWPayments envía al cobrar aparece aquí: quién pagó, su correo y cuánto.
                    Incluye los pagos parciales. Si alguien pagó y no tiene acceso, actívalo con un clic desde aquí.
                  </p>
                </div>
                <button
                  onClick={fetchPayments}
                  disabled={paymentsLoading}
                  className="btn-gold px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 disabled:opacity-50 shrink-0"
                >
                  <RefreshCw size={13} className={paymentsLoading ? "animate-spin" : ""} />
                  Actualizar
                </button>
              </div>
            </div>

            {paymentsLoading ? (
              <div className="text-center py-10">
                <span className="w-6 h-6 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin inline-block" />
              </div>
            ) : payments.length === 0 ? (
              <div className="card-dark rounded-2xl p-8 text-center">
                <DollarSign size={30} className="text-[#c9a84c]/30 mx-auto mb-3" />
                <p className="text-white font-semibold text-sm mb-1">Aún no hay pagos registrados</p>
                <p className="text-[#6a5a4a] text-xs max-w-md mx-auto">
                  Aquí aparecerán automáticamente los pagos en cuanto NOWPayments avise del primero.
                  Los pagos anteriores a hoy no salen porque este registro empieza ahora.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => {
                  let st = PAYMENT_STATUS[p.status] ?? { label: p.status, color: "text-[#8a7a6a] bg-white/5 border-white/10" };

                  // Comparar SIEMPRE en la misma moneda: la cripto enviada contra
                  // la cripto que se le pidió. NOWPayments marca "pago parcial"
                  // por diferencias mínimas de redondeo aunque haya pagado todo.
                  const cubierto = p.requerido > 0 ? p.pagado / p.requerido : 0;
                  const faltaCripto = p.requerido > 0 ? p.requerido - p.pagado : 0;
                  const esParcial = p.status === "partially_paid";
                  const casiCompleto = esParcial && cubierto >= 0.974;
                  const faltaDeVerdad = esParcial && p.requerido > 0 && cubierto < 0.974;

                  if (casiCompleto) {
                    st = { label: "PAGADO ✓ (diferencia mínima)", color: "text-green-400 bg-green-500/10 border-green-500/30" };
                  }
                  return (
                    <div key={p.id} className="card-dark rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-white font-semibold text-sm truncate">{p.nombre ?? "Sin cuenta registrada"}</p>
                          <span className={`shrink-0 text-[10px] font-bold border rounded-full px-2 py-0.5 ${st.color}`}>
                            {st.label}
                          </span>
                          {p.activado === true && (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5">
                              <CheckCircle size={10} />
                              Con acceso
                            </span>
                          )}
                          {p.activado === false && (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5">
                              <XCircle size={10} />
                              Sin acceso
                            </span>
                          )}
                          {p.avisoEnviado && (
                            <span
                              title={`Aviso de pago no completado enviado el ${fechaCorta(p.avisoEnviado)}`}
                              className="shrink-0 inline-flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/25 rounded-full px-2 py-0.5"
                            >
                              <Send size={9} />
                              Aviso enviado · {fechaCorta(p.avisoEnviado)}
                            </span>
                          )}
                          {p.bienvenidaEnviada && (
                            <span
                              title={`Correo de bienvenida enviado el ${fechaCorta(p.bienvenidaEnviada)}`}
                              className="shrink-0 inline-flex items-center gap-1 text-[10px] bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/25 rounded-full px-2 py-0.5"
                            >
                              <Send size={9} />
                              Bienvenida enviada
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => copyEmail(p.email)}
                          className="flex items-center gap-1 text-[#8a7a6a] text-xs hover:text-[#c9a84c] transition-colors max-w-full"
                        >
                          <span className="truncate">{p.email}</span>
                          <Copy size={11} className="shrink-0" />
                        </button>
                        <p className="text-[#6a5a4a] text-xs mt-1">
                          Debía pagar <span className="text-[#c9a84c] font-bold">${p.precio}</span>
                          {p.requerido > 0 && <> (= {importe(p.requerido, p.moneda)})</>}
                          {p.pagado > 0 && <> · envió <span className="text-white font-bold">{importe(p.pagado, p.moneda)}</span></>}
                          {p.recibido > 0 && <> · llegó {importe(p.recibido, p.monedaRecibida || p.moneda)}</>}
                          {" · "}
                          {new Date(p.fecha).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {casiCompleto && (
                          <p className="text-green-400 text-xs mt-1">
                            Pagó el {(cubierto * 100).toFixed(1)}% — la diferencia es por comisiones de red, se considera pagado
                          </p>
                        )}
                        {faltaDeVerdad && (
                          <p className="text-orange-400 text-xs mt-1 font-semibold">
                            Pagó solo el {(cubierto * 100).toFixed(1)}% — faltan {importe(Number(faltaCripto.toFixed(8)), p.moneda)}
                          </p>
                        )}
                      </div>
                      {p.activado === false && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => {
                              const u = users.find((x) => x.email.toLowerCase() === p.email.toLowerCase());
                              if (u) handleToggle(u).then(() => fetchPayments());
                              else showToast("Ese correo no tiene cuenta en la web.");
                            }}
                            disabled={actionLoading === p.email}
                            className="btn-gold px-5 py-2 rounded-xl text-sm font-bold"
                          >
                            {actionLoading === p.email ? (
                              <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin inline-block" />
                            ) : "Dar acceso"}
                          </button>
                          {p.pagado <= 0 && (
                            <button
                              onClick={() => handleNotifyUnpaid(p.email, p.nombre, p.avisoEnviado)}
                              disabled={actionLoading === p.email}
                              title={p.avisoEnviado
                                ? `Ya se le avisó el ${fechaCorta(p.avisoEnviado)}. Puedes volver a enviarlo si hace falta.`
                                : "Enviarle el correo explicando que su pago no llegó a completarse"}
                              className={`flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold border transition-all ${
                                p.avisoEnviado
                                  ? "bg-transparent text-[#6a5a4a] border-white/10 hover:text-[#c9a84c] hover:border-[#c9a84c]/30"
                                  : "bg-white/5 text-[#c9a84c] border-[#c9a84c]/25 hover:bg-[#c9a84c]/10"
                              }`}
                            >
                              <Send size={12} />
                              {p.avisoEnviado ? "Reenviar aviso" : "Avisar: no pagó"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Actividad */}
        {activeTab === "actividad" && (
          <>
            <div className="relative mb-5">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6a5a4a]" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60"
              />
              {logSearch && (
                <button onClick={() => setLogSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a5a4a] hover:text-white text-xs">✕</button>
              )}
            </div>
            {filteredLogs.length === 0 ? (
              <div className="card-dark rounded-2xl p-8 text-center text-[#6a5a4a] text-sm">
                {logSearch ? "No se encontró actividad para ese usuario." : "No hay actividad registrada aún."}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLogs.map((log) => {
                  // Los avisos técnicos de NOWPayments llevan el detalle en `action`,
                  // así que se identifican por quién los escribe, no por su texto
                  const esWebhook = log.user_email === "webhook@nowpayments";
                  const etiquetaWebhook =
                    log.user_name === "WEBHOOK_ACTIVATED" ? "Cliente activado por pago" :
                    log.user_name === "WEBHOOK_SIG_FAIL" ? "Aviso rechazado (clave incorrecta)" :
                    log.user_name === "WEBHOOK_RECEIVED" ? "Aviso de pago recibido" :
                    log.user_name === "WEBHOOK_OK" ? "Aviso verificado" :
                    log.user_name === "WEBHOOK_SKIP" ? "Aviso sin pago completo" :
                    log.user_name === "WEBHOOK_PLAN_MISMATCH" ? "Importe no coincide con el plan" :
                    "Aviso de NOWPayments";
                  return (
                  <div key={log.id} className="card-dark rounded-xl px-5 py-3 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      esWebhook ? "bg-white/5 border border-white/10" :
                      log.action === "course_access" ? "bg-green-500/10 border border-green-500/20" :
                      log.action === "login" ? "bg-blue-500/10 border border-blue-500/20" :
                      log.action === "register" ? "bg-purple-500/10 border border-purple-500/20" :
                      "bg-[#c9a84c]/10 border border-[#c9a84c]/20"
                    }`}>
                      {esWebhook ? <DollarSign size={14} className="text-[#8a7a6a]" />
                        : log.action === "course_access" ? <PlayCircle size={14} className="text-green-400" />
                        : log.action === "login" ? <LogIn size={14} className="text-blue-400" />
                        : log.action === "register" ? <UserPlus size={14} className="text-purple-400" />
                        : <Download size={14} className="text-[#c9a84c]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{log.user_name || log.user_email}</p>
                      <p className="text-[#8a7a6a] text-xs truncate">
                        {esWebhook ? log.action : log.user_email}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-bold ${
                        esWebhook ? (log.user_name === "WEBHOOK_SIG_FAIL" ? "text-red-400" : "text-[#8a7a6a]") :
                        log.action === "course_access" ? "text-green-400" :
                        log.action === "login" ? "text-blue-400" :
                        log.action === "register" ? "text-purple-400" :
                        "text-[#c9a84c]"
                      }`}>
                        {esWebhook ? etiquetaWebhook :
                         log.action === "course_access" ? "Entró al curso" :
                         log.action === "login" ? "Inició sesión" :
                         log.action === "register" ? "Se registró" :
                         log.action === "download_pdf" ? "Descargó PDF" :
                         log.action === "download_epub" ? "Descargó eBook" : log.action}
                      </p>
                      <p className="text-[#6a5a4a] text-xs">
                        {new Date(log.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Tab: Ingresos */}
        {activeTab === "ingresos" && (
          <div className="space-y-5">
            <div className="card-dark rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
                <DollarSign size={22} className="text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-1">Total estimado en ingresos</p>
                <p className="text-4xl font-bold text-[#c9a84c]">${totalRevenue.toLocaleString("es-ES")}</p>
                <p className="text-[#6a5a4a] text-xs mt-1">Basado en {activatedCount} usuarios con acceso activo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-dark rounded-2xl p-5">
                <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-3">Escuela Avanzada · $777</p>
                <p className="text-3xl font-bold text-white mb-1">{escuelaActivos}</p>
                <p className="text-[#c9a84c] text-sm font-bold">${(escuelaActivos * 777).toLocaleString("es-ES")}</p>
                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c9a84c] rounded-full" style={{ width: activatedCount ? `${(escuelaActivos / activatedCount) * 100}%` : "0%" }} />
                </div>
              </div>
              <div className="card-dark rounded-2xl p-5">
                <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-3">Todas las Clases · $555</p>
                <p className="text-3xl font-bold text-white mb-1">{clasesActivos}</p>
                <p className="text-[#c9a84c] text-sm font-bold">${(clasesActivos * 555).toLocaleString("es-ES")}</p>
                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c9a84c] rounded-full" style={{ width: activatedCount ? `${(clasesActivos / activatedCount) * 100}%` : "0%" }} />
                </div>
              </div>
              <div className="card-dark rounded-2xl p-5">
                <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-3">Meditación Profética · $333</p>
                <p className="text-3xl font-bold text-white mb-1">{meditActivos}</p>
                <p className="text-[#c9a84c] text-sm font-bold">${(meditActivos * 333).toLocaleString("es-ES")}</p>
                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c9a84c] rounded-full" style={{ width: activatedCount ? `${(meditActivos / activatedCount) * 100}%` : "0%" }} />
                </div>
              </div>
            </div>

            <div className="card-dark rounded-2xl p-5">
              <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-3">Potencial si se activan todos los pendientes</p>
              <p className="text-2xl font-bold text-white">
                ${(
                  users.filter((u) => !u.activated && u.plan === "escuela").length * 777 +
                  users.filter((u) => !u.activated && u.plan === "clases").length * 555 +
                  users.filter((u) => !u.activated && u.plan === "meditaciones").length * 333
                ).toLocaleString("es-ES")}
              </p>
              <p className="text-[#6a5a4a] text-xs mt-1">{users.length - activatedCount} usuarios pendientes de activación</p>
            </div>

            <div className="card-dark rounded-2xl p-5 border border-[#c9a84c]/15">
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Diagnóstico — activación automática</p>
              <p className="text-[#8a7a6a] text-xs mb-3">Prueba si la conexión con NOWPayments funciona correctamente para activar clientes tras el pago.</p>
              <button
                onClick={handlePaymentCheck}
                disabled={paymentCheckLoading}
                className="btn-gold px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 disabled:opacity-50 mb-3"
              >
                {paymentCheckLoading
                  ? <span className="w-3 h-3 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                  : "Probar conexión NOWPayments"}
              </button>
              {paymentCheck && (
                <div className="space-y-1.5 text-xs font-mono">
                  {Object.entries(paymentCheck).map(([k, v]) => (
                    <div key={k} className={`flex gap-2 ${String(v).includes("✗") || String(v) === "false" || k === "apiError" ? "text-red-400" : String(v).includes("✓") || String(v) === "true" ? "text-green-400" : "text-[#8a7a6a]"}`}>
                      <span className="shrink-0 text-[#6a5a4a]">{k}:</span>
                      <span className="break-all">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PAGOS RECIBIDOS DE NOWPAYMENTS */}
            <div className="card-dark rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest">Pagos recibidos de NOWPayments</p>
                <button
                  onClick={fetchPaymentsList}
                  disabled={paymentsListLoading}
                  className="p-1.5 text-[#6a5a4a] hover:text-[#c9a84c] transition-colors"
                  title="Actualizar"
                >
                  <RefreshCw size={14} className={paymentsListLoading ? "animate-spin" : ""} />
                </button>
              </div>
              <p className="text-[#8a7a6a] text-xs mb-4">Cada aviso que NOWPayments envía al cobrar aparece aquí: quién pagó, su correo y cuánto. Incluye los pagos parciales. Si alguien pagó y no tiene acceso, actívalo con un clic desde aquí.</p>
              {!paymentsList.length && !paymentsListLoading && !paymentsListError && (
                <button
                  onClick={fetchPaymentsList}
                  className="btn-gold px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2"
                >
                  <RefreshCw size={13} /> Actualizar
                </button>
              )}
              {paymentsListLoading && (
                <div className="flex justify-center py-6">
                  <span className="w-5 h-5 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
                </div>
              )}
              {paymentsListError && (
                <p className="text-red-400 text-xs">{paymentsListError}</p>
              )}
              {paymentsList.length > 0 && (
                <div className="space-y-3">
                  {paymentsList.map((p) => {
                    const statusMap: Record<string, string> = {
                      waiting: "Esperando pago",
                      confirming: "Confirmando en la red",
                      confirmed: "Confirmado",
                      sending: "Enviando",
                      partially_paid: "PAGO PARCIAL",
                      finished: "Completado",
                      failed: "Fallido",
                      refunded: "Reembolsado",
                    };
                    const statusLabel = statusMap[p.payment_status] ?? p.payment_status;
                    const isOk = p.payment_status === "finished" || p.payment_status === "confirmed";
                    const isPartial = p.payment_status === "partially_paid";
                    const isSending = p.payment_status === "sending";
                    const payCurrency = p.pay_currency.toLowerCase();
                    const isStablecoin = ["usd", "usdc", "usdp", "usdt", "busd", "dai"].includes(payCurrency);

                    // Received amount: use outcome (fiat) if available, else crypto with unit
                    const receivedStr = p.outcome_amount > 0
                      ? `$${p.outcome_amount.toFixed(2)}`
                      : isStablecoin
                        ? `$${p.actually_paid.toFixed(2)}`
                        : `${p.actually_paid} ${payCurrency.toUpperCase()}`;

                    // "Faltan" only meaningful when we have fiat or stablecoin reference
                    const fiatReceived = p.outcome_amount > 0
                      ? p.outcome_amount
                      : isStablecoin ? p.actually_paid : null;
                    const faltan = fiatReceived !== null ? Math.max(0, p.price_amount - fiatReceived) : null;

                    // Crypto comparison for "complete enough"
                    const cryptoPaid = p.pay_amount > 0 && p.actually_paid >= p.pay_amount * 0.974;

                    return (
                      <div key={p.payment_id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-white text-sm font-semibold">{p.user_name ?? p.order_id}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            isOk ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            isPartial ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                            isSending ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            "bg-white/5 text-[#8a7a6a] border-white/10"
                          }`}>
                            {statusLabel}
                          </span>
                          {p.user_activated === true && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">Con acceso</span>
                          )}
                          {p.user_activated === false && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Sin acceso</span>
                          )}
                        </div>
                        <p className="text-[#8a7a6a] text-xs mb-1">{p.order_id}</p>
                        <p className="text-[#d0c0b0] text-xs">
                          Debía pagar <span className="text-white font-semibold">${p.price_amount}</span>
                          {p.actually_paid > 0 && <> · recibido <span className="text-white font-semibold">{receivedStr}</span></>}
                          {!isStablecoin && p.pay_amount > 0 && <> · envió {p.pay_amount} {payCurrency.toUpperCase()}</>}
                          {p.created_at && <> · {new Date(p.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}, {new Date(p.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</>}
                        </p>
                        {isPartial && (
                          faltan !== null && faltan > 20 ? (
                            <p className="text-orange-400 text-xs mt-1">Faltan ${faltan.toFixed(2)} para completar el pago</p>
                          ) : (faltan !== null && faltan <= 20) || cryptoPaid ? (
                            <p className="text-green-400 text-xs mt-1">Pago completo (diferencia por conversión) ✓</p>
                          ) : (
                            <p className="text-[#8a7a6a] text-xs mt-1">Pago parcial — verificar manualmente</p>
                          )
                        )}
                        {p.user_activated === false && (isOk || isPartial) && (
                          <button
                            onClick={() => handleActivateFromPayment(p.order_id)}
                            className="mt-2 btn-gold px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                          >
                            <CheckCircle size={11} /> Activar acceso
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Tab: Foro */}
        {activeTab === "foro" && (
          foroPosts.length === 0 ? (
            <div className="card-dark rounded-2xl p-8 text-center text-[#6a5a4a] text-sm">
              No hay preguntas en el foro aún.
            </div>
          ) : (
            <div className="space-y-4">
              {foroPosts.map((post) => (
                <div
                  key={post.id}
                  className={`card-dark rounded-2xl p-5 transition-opacity ${post.hidden ? "opacity-40" : ""}`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <div className="w-7 h-7 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center text-xs font-bold text-[#c9a84c] shrink-0">
                      {post.user_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-semibold">{post.user_name}</span>
                    <span className="text-[#6a5a4a] text-xs">{post.user_email}</span>
                    {post.hidden && (
                      <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5">Oculta</span>
                    )}
                    {!post.answer && !post.hidden && (
                      <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-2 py-0.5">Sin respuesta</span>
                    )}
                    <span className="text-[#6a5a4a] text-xs ml-auto shrink-0">
                      {new Date(post.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-[#d0c0b0] text-sm leading-relaxed mb-4">{post.question}</p>

                  {/* Existing answer */}
                  {post.answer && (
                    <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/15 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[#c9a84c] text-xs font-bold">
                          {post.responder_name ?? "Kissingers"} · Respuesta
                        </p>
                        <button
                          onClick={() => {
                            setEditingPost(editingPost === post.id ? null : post.id);
                            setEditAnswers((prev) => ({ ...prev, [post.id]: post.answer ?? "" }));
                            setForoResponder((prev) => ({ ...prev, [post.id]: post.responder_name ?? "Kissingers" }));
                          }}
                          className="text-[10px] text-[#6a5a4a] hover:text-[#c9a84c] transition-colors flex items-center gap-1"
                        >
                          <Pencil size={10} /> Editar
                        </button>
                      </div>
                      {editingPost === post.id ? (
                        <div className="flex flex-col gap-2 mt-2">
                          <select
                            value={foroResponder[post.id] ?? "Kissingers"}
                            onChange={(e) => setForoResponder((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            className="bg-white/5 border border-[#c9a84c]/20 rounded-xl px-3 py-2 text-[#c9a84c] text-xs font-bold focus:outline-none focus:border-[#c9a84c]/60 w-fit"
                          >
                            <option value="Kissingers">Kissingers</option>
                            <option value="Servicio al Estudiante">Servicio al Estudiante</option>
                          </select>
                          <textarea
                            value={editAnswers[post.id] ?? ""}
                            onChange={(e) => setEditAnswers((prev) => ({ ...prev, [post.id]: e.target.value }))}
                            rows={3}
                            className="w-full bg-white/5 border border-[#c9a84c]/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleForoEdit(post.id)}
                              disabled={foroLoading === post.id || !editAnswers[post.id]?.trim()}
                              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {foroLoading === post.id ? <span className="w-3 h-3 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : "Guardar"}
                            </button>
                            <button
                              onClick={() => setEditingPost(null)}
                              className="text-xs text-[#6a5a4a] hover:text-white transition-colors px-3"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-white text-sm leading-relaxed">{post.answer}</p>
                      )}
                    </div>
                  )}

                  {/* Answer input */}
                  {!post.answer && !post.hidden && (
                    <div className="flex flex-col gap-2 mb-4">
                      <select
                        value={foroResponder[post.id] ?? "Kissingers"}
                        onChange={(e) => setForoResponder((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        className="bg-white/5 border border-[#c9a84c]/20 rounded-xl px-3 py-2 text-[#c9a84c] text-xs font-bold focus:outline-none focus:border-[#c9a84c]/60 w-fit"
                      >
                        <option value="Kissingers">Kissingers</option>
                        <option value="Servicio al Estudiante">Servicio al Estudiante</option>
                      </select>
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={foroAnswers[post.id] ?? ""}
                        onChange={(e) => setForoAnswers((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Escribe tu respuesta..."
                        rows={4}
                        className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-2.5 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60 resize-none"
                      />
                      <button
                        onClick={() => handleForoAnswer(post.id)}
                        disabled={foroLoading === post.id || !foroAnswers[post.id]?.trim()}
                        className="btn-gold px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 self-end disabled:opacity-50"
                      >
                        {foroLoading === post.id
                          ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                          : <><Send size={13} /> Responder</>
                        }
                      </button>
                    </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleForoToggle(post)}
                      disabled={foroLoading === post.id}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 text-[#8a7a6a] hover:text-white transition-colors"
                    >
                      {post.hidden ? <><Eye size={12} /> Mostrar</> : <><EyeOff size={12} /> Ocultar</>}
                    </button>
                    <button
                      onClick={() => handleForoDelete(post.id)}
                      disabled={foroLoading === post.id}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        {/* Tab: Hotmart */}
        {activeTab === "hotmart" && (
          <div className="space-y-6">
            {/* Create code */}
            <div className="card-dark rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <KeyRound size={16} className="text-[#c9a84c]" />
                Generar código de descarga
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Libro</label>
                  <select
                    value={newBook}
                    onChange={(e) => setNewBook(e.target.value)}
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
                  >
                    <option value="both">eBook + PDF (ambos formatos)</option>
                    <option value="ebook">Solo eBook</option>
                    <option value="pdf">Solo PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Código personalizado (opcional)</label>
                  <input
                    type="text"
                    value={newCustomCode}
                    onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                    placeholder="Ej: HOTMART-MARIA"
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60 uppercase tracking-widest"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateCode}
                disabled={codesLoading}
                className="btn-gold px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {codesLoading
                  ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                  : <><KeyRound size={15} /> Generar código</>}
              </button>
              {codeError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm font-semibold mb-1">Error al crear el código</p>
                  <p className="text-red-300 text-xs leading-relaxed">{codeError}</p>
                  {codeError.includes("download_codes") && (
                    <div className="mt-3">
                      <button
                        onClick={handleSetupDb}
                        disabled={setupDbLoading}
                        className="btn-gold w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
                      >
                        {setupDbLoading
                          ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                          : "Crear tabla automáticamente"}
                      </button>
                      <p className="text-[#8a7a6a] text-xs mb-2">O copia y ejecuta este SQL manualmente en Supabase → SQL Editor:</p>
                      <div className="bg-[#050510] rounded-lg p-3 flex items-start justify-between gap-2">
                        <code className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap font-mono">
{`create table download_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  file_url text not null,
  file_name text not null,
  used boolean default false,
  used_at timestamptz,
  created_at timestamptz default now()
);`}
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(`create table download_codes (\n  id uuid primary key default gen_random_uuid(),\n  code text unique not null,\n  file_url text not null,\n  file_name text not null,\n  used boolean default false,\n  used_at timestamptz,\n  created_at timestamptz default now()\n);`).then(() => showToast("SQL copiado ✓"))}
                          className="shrink-0 p-1.5 text-[#6a5a4a] hover:text-[#c9a84c] transition-colors"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {generatedCode && !codeError && (
                <div className="mt-4 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">Código generado</p>
                    <p className="text-white font-bold text-lg tracking-widest">{generatedCode}</p>
                    <p className="text-[#8a7a6a] text-xs mt-1">Envía este código al cliente. Solo se puede usar una vez.</p>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(generatedCode); showToast("Código copiado ✓"); }}
                    className="shrink-0 p-2 text-[#c9a84c] hover:bg-[#c9a84c]/20 rounded-lg transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Code list */}
            <div className="card-dark rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Download size={16} className="text-[#c9a84c]" />
                  Códigos generados
                </h3>
                <button onClick={fetchCodes} disabled={codesLoading} className="p-2 text-[#6a5a4a] hover:text-[#c9a84c] transition-colors">
                  <RefreshCw size={14} className={codesLoading ? "animate-spin" : ""} />
                </button>
              </div>
              {codesLoading && codes.length === 0 ? (
                <div className="flex justify-center py-8">
                  <span className="w-6 h-6 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
                </div>
              ) : codes.length === 0 ? (
                <p className="text-[#6a5a4a] text-sm text-center py-8">No hay códigos generados aún.</p>
              ) : (
                <div className="space-y-2">
                  {codes.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/5 transition-colors">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${c.used ? "bg-red-400" : "bg-green-400"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm tracking-widest">{c.code}</p>
                        <p className="text-[#8a7a6a] text-xs truncate">
                          {c.file_name.startsWith("[") ? "eBook + PDF" : c.file_name}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${c.used ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
                        {c.used ? "Usado" : "Disponible"}
                      </span>
                      <p className="text-[#6a5a4a] text-xs shrink-0 hidden sm:block">
                        {new Date(c.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                      </p>
                      {!c.used && (
                        <button
                          onClick={() => { navigator.clipboard.writeText(c.code); showToast("Código copiado ✓"); }}
                          className="p-1.5 text-[#6a5a4a] hover:text-[#c9a84c] transition-colors shrink-0"
                          title="Copiar código"
                        >
                          <Copy size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCode(c.id)}
                        className="p-1.5 text-[#6a5a4a] hover:text-red-400 transition-colors shrink-0"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-dark rounded-2xl p-5 border border-[#c9a84c]/15">
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">Instrucciones</p>
              <p className="text-[#b8a888] text-sm leading-relaxed">
                Genera un código y envíaselo al cliente por email. El cliente va a{" "}
                <span className="text-white font-semibold">kissingersaraque.com/libro</span>,
                ingresa el código y descarga el libro. El código queda inactivo tras el primer uso.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Email */}
        {activeTab === "email" && (
          <div className="space-y-5">
            {/* Plantillas */}
            <div className="card-dark rounded-2xl p-5">
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Plantillas de correo</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {EMAIL_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t.id);
                      setEmailSubject(t.asunto);
                      setEmailBody(t.body);
                    }}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      selectedTemplate === t.id
                        ? "border-[#c9a84c]/60 bg-[#c9a84c]/10 text-white"
                        : "border-white/5 bg-white/[0.03] text-[#8a7a6a] hover:border-[#c9a84c]/30 hover:text-white"
                    }`}
                  >
                    <p className="font-semibold">{t.nombre}</p>
                    <p className="text-xs mt-0.5 opacity-60">Asunto: {t.asunto}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario de envío */}
            <div className="card-dark rounded-2xl p-5 space-y-4">
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest">Redactar y enviar</p>

              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-1.5">Para (correo del cliente)</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-2.5 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-1.5">Asunto</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Asunto del correo"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-2.5 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-1.5">Mensaje</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={16}
                  placeholder="Escribe o selecciona una plantilla arriba..."
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60 resize-none font-mono leading-relaxed"
                />
                <p className="text-[#6a5a4a] text-xs mt-1.5">Edita el texto antes de enviar. Cambia [NOMBRE], [EMAIL], [ENLACE_PAYPAL] por los datos reales.</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSendEmail}
                  disabled={emailSending || !emailTo || !emailSubject || !emailBody}
                  className="btn-gold px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {emailSending
                    ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" />
                    : <><Send size={14} /> Enviar correo</>}
                </button>
                <button
                  onClick={() => { setEmailTo(""); setEmailSubject(""); setEmailBody(""); setSelectedTemplate(""); }}
                  className="px-4 py-3 rounded-xl text-sm text-[#6a5a4a] hover:text-white bg-white/5 border border-white/5 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reset password modal */}
      {resetEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="card-dark rounded-2xl p-6 w-full max-w-sm border border-[#c9a84c]/30">
            <h3 className="text-white font-bold mb-1 flex items-center gap-2">
              <KeyRound size={16} className="text-[#c9a84c]" />
              Cambiar contraseña
            </h3>
            <p className="text-[#8a7a6a] text-xs mb-4 truncate">{resetEmail}</p>
            <input
              type="password"
              value={resetPwd}
              onChange={(e) => setResetPwd(e.target.value)}
              placeholder="Nueva contraseña (mín. 6 caracteres)"
              className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60 mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setResetEmail(null); setResetPwd(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white/5 text-[#8a7a6a] hover:text-white border border-white/10 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetPassword}
                disabled={resetLoading || resetPwd.length < 6}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold btn-gold disabled:opacity-50 transition-all"
              >
                {resetLoading ? (
                  <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin inline-block" />
                ) : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

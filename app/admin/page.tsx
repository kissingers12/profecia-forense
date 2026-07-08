"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Lock, Users, LogOut, LogIn, Download, Activity, Search, PlayCircle, Copy, UserPlus, DollarSign, MessageCircle, Eye, EyeOff, Trash2, Send } from "lucide-react";

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

const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditación $333",
  escuela: "Escuela $777",
};

export default function AdminPage() {
  const [selectedProfile, setSelectedProfile] = useState<"kissingers" | "servicio" | null>(null);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [adminProfile, setAdminProfile] = useState<"kissingers" | "servicio">("kissingers");
  const [authError, setAuthError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [foroPosts, setForoPosts] = useState<ForoPost[]>([]);
  const [foroAnswers, setForoAnswers] = useState<Record<number, string>>({});
  const [foroResponder, setForoResponder] = useState<Record<number, string>>({});
  const [foroLoading, setForoLoading] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<"clientes" | "actividad" | "ingresos" | "foro">("clientes");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending">("all");
  const [logSearch, setLogSearch] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchUsers = async (pwd: string, profile: "kissingers" | "servicio") => {
    setLoading(true);
    try {
      // Servicio solo necesita el foro — valida con el endpoint de foro
      const checkRes = await fetch("/api/admin/forum", { headers: { "x-admin-password": pwd } });
      if (checkRes.status === 401) {
        setAuthError("Contraseña incorrecta.");
        setAuthed(false);
        setLoading(false);
        return;
      }
      const foroData = await checkRes.json();
      setForoPosts(foroData.posts ?? []);
      setAuthed(true);
      setAdminProfile(profile);
      setAuthError("");

      if (profile === "kissingers") {
        const [usersRes, logsRes] = await Promise.all([
          fetch("/api/admin/users", { headers: { "x-admin-password": pwd } }),
          fetch("/api/admin/logs", { headers: { "x-admin-password": pwd } }),
        ]);
        if (usersRes.ok) setUsers((await usersRes.json()).users ?? []);
        if (logsRes.ok) setLogs((await logsRes.json()).logs ?? []);
      }
    } catch {
      setAuthError("Error de conexión.");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;
    await fetchUsers(password, selectedProfile);
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
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => u.email === user.email ? { ...u, activated: !u.activated } : u)
        );
        showToast(user.activated ? `${user.name} desactivado` : `${user.name} activado ✓`);
      }
    } catch {
      showToast("Error al actualizar.");
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
    const responderName = adminProfile === "servicio" ? "Servicio al Estudiante" : "Kissingers";
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

  const escuelaActivos = users.filter((u) => u.activated && u.plan === "escuela").length;
  const meditActivos = users.filter((u) => u.activated && u.plan === "meditaciones").length;
  const totalRevenue = escuelaActivos * 777 + meditActivos * 333;

  const filteredLogs = logSearch.trim()
    ? logs.filter((l) =>
        l.user_email.toLowerCase().includes(logSearch.toLowerCase()) ||
        (l.user_name ?? "").toLowerCase().includes(logSearch.toLowerCase())
      )
    : logs;

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

          {/* Selección de perfil */}
          {!selectedProfile ? (
            <div className="space-y-3">
              <p className="text-center text-[#6a5a4a] text-xs uppercase tracking-widest mb-4">¿Quién eres?</p>
              <button
                onClick={() => setSelectedProfile("kissingers")}
                className="w-full card-dark rounded-2xl p-5 flex items-center gap-4 hover:border-[#c9a84c]/40 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/50 flex items-center justify-center text-lg font-bold text-[#c9a84c] shrink-0">K</div>
                <div>
                  <p className="text-white font-bold">Kissingers</p>
                  <p className="text-[#6a5a4a] text-xs">Acceso completo</p>
                </div>
              </button>
              <button
                onClick={() => setSelectedProfile("servicio")}
                className="w-full card-dark rounded-2xl p-5 flex items-center gap-4 hover:border-[#c9a84c]/40 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-lg font-bold text-white shrink-0">S</div>
                <div>
                  <p className="text-white font-bold">Servicio al Estudiante</p>
                  <p className="text-[#6a5a4a] text-xs">Solo foro</p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="card-dark rounded-2xl p-8 space-y-5">
              <button type="button" onClick={() => { setSelectedProfile(null); setPassword(""); setAuthError(""); }} className="text-[#6a5a4a] text-xs flex items-center gap-1 hover:text-white transition-colors">
                ← Volver
              </button>
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${selectedProfile === "kissingers" ? "bg-[#c9a84c]/20 border border-[#c9a84c]/50 text-[#c9a84c]" : "bg-white/5 border border-white/20 text-white"}`}>
                  {selectedProfile === "kissingers" ? "K" : "S"}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{selectedProfile === "kissingers" ? "Kissingers" : "Servicio al Estudiante"}</p>
                  <p className="text-[#6a5a4a] text-xs">{selectedProfile === "kissingers" ? "Acceso completo" : "Solo foro"}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60"
                />
              </div>
              {authError && <p className="text-red-400 text-xs">{authError}</p>}
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-[#050510]/40 border-t-[#050510] rounded-full animate-spin" /> : "Entrar"}
              </button>
            </form>
          )}
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
              onClick={() => fetchUsers(password, adminProfile)}
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
          {adminProfile === "kissingers" && <button
            onClick={() => setActiveTab("clientes")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "clientes"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <Users size={15} />
            Clientes
          </button>}
          {adminProfile === "kissingers" && <button
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
          </button>}
          {adminProfile === "kissingers" && <button
            onClick={() => setActiveTab("ingresos")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              activeTab === "ingresos"
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a4a] hover:text-white"
            }`}
          >
            <DollarSign size={15} />
            Ingresos
          </button>}
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
                  <button
                    onClick={() => handleToggle(user)}
                    disabled={actionLoading === user.email}
                    className={`shrink-0 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                      user.activated
                        ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        : "btn-gold"
                    }`}
                  >
                    {actionLoading === user.email ? (
                      <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin inline-block" />
                    ) : user.activated ? "Desactivar" : "Activar acceso"}
                  </button>
                </div>
              ))}
            </div>
              )}
            </>
          )
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
                {filteredLogs.map((log) => (
                  <div key={log.id} className="card-dark rounded-xl px-5 py-3 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      log.action === "course_access" ? "bg-green-500/10 border border-green-500/20" :
                      log.action === "login" ? "bg-blue-500/10 border border-blue-500/20" :
                      log.action === "register" ? "bg-purple-500/10 border border-purple-500/20" :
                      "bg-[#c9a84c]/10 border border-[#c9a84c]/20"
                    }`}>
                      {log.action === "course_access" ? <PlayCircle size={14} className="text-green-400" />
                        : log.action === "login" ? <LogIn size={14} className="text-blue-400" />
                        : log.action === "register" ? <UserPlus size={14} className="text-purple-400" />
                        : <Download size={14} className="text-[#c9a84c]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{log.user_name || log.user_email}</p>
                      <p className="text-[#8a7a6a] text-xs truncate">{log.user_email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-bold ${
                        log.action === "course_access" ? "text-green-400" :
                        log.action === "login" ? "text-blue-400" :
                        log.action === "register" ? "text-purple-400" :
                        "text-[#c9a84c]"
                      }`}>
                        {log.action === "course_access" ? "Entró al curso" :
                         log.action === "login" ? "Inició sesión" :
                         log.action === "register" ? "Se registró" :
                         log.action === "download_pdf" ? "Descargó PDF" : "Descargó eBook"}
                      </p>
                      <p className="text-[#6a5a4a] text-xs">
                        {new Date(log.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-dark rounded-2xl p-5">
                <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-3">Escuela Avanzada · $777</p>
                <p className="text-3xl font-bold text-white mb-1">{escuelaActivos}</p>
                <p className="text-[#c9a84c] text-sm font-bold">${(escuelaActivos * 777).toLocaleString("es-ES")}</p>
                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c9a84c] rounded-full" style={{ width: activatedCount ? `${(escuelaActivos / activatedCount) * 100}%` : "0%" }} />
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
                  users.filter((u) => !u.activated && u.plan === "meditaciones").length * 333
                ).toLocaleString("es-ES")}
              </p>
              <p className="text-[#6a5a4a] text-xs mt-1">{users.length - activatedCount} usuarios pendientes de activación</p>
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
                      <p className="text-[#c9a84c] text-xs font-bold mb-1">Tu respuesta:</p>
                      <p className="text-white text-sm leading-relaxed">{post.answer}</p>
                    </div>
                  )}

                  {/* Answer input */}
                  {!post.answer && !post.hidden && (
                    <div className="flex flex-col gap-2 mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={foroAnswers[post.id] ?? ""}
                        onChange={(e) => setForoAnswers((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Escribe tu respuesta..."
                        className="flex-1 bg-white/5 border border-[#c9a84c]/20 rounded-xl px-4 py-2.5 text-white placeholder-[#4a3a2a] text-sm focus:outline-none focus:border-[#c9a84c]/60"
                        onKeyDown={(e) => { if (e.key === "Enter") handleForoAnswer(post.id); }}
                      />
                      <button
                        onClick={() => handleForoAnswer(post.id)}
                        disabled={foroLoading === post.id || !foroAnswers[post.id]?.trim()}
                        className="btn-gold px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-50"
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
      </main>
    </div>
  );
}

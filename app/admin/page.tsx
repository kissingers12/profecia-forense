"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Lock, Users, LogOut } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string;
  plan: string;
  activated: boolean;
  created_at: string;
};

const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditación $333",
  escuela: "Escuela $777",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchUsers = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { "x-admin-password": pwd },
      });
      if (res.status === 401) {
        setAuthError("Contraseña incorrecta.");
        setAuthed(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users ?? []);
      setAuthed(true);
      setAuthError("");
    } catch {
      setAuthError("Error de conexión.");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchUsers(password);
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
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
            >
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="card-dark rounded-2xl p-5">
            <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-1">Total registrados</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="card-dark rounded-2xl p-5">
            <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-1">Con acceso activo</p>
            <p className="text-3xl font-bold text-[#c9a84c]">{activatedCount}</p>
          </div>
          <div className="card-dark rounded-2xl p-5">
            <p className="text-[#6a5a4a] text-xs uppercase tracking-widest mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-red-400">{users.length - activatedCount}</p>
          </div>
        </div>

        <h2 className="text-white font-bold text-lg mb-5">Clientes registrados</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="w-8 h-8 border-2 border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="card-dark rounded-2xl p-10 text-center text-[#6a5a4a]">
            No hay usuarios registrados aún.
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
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
                  <p className="text-[#8a7a6a] text-xs truncate">{user.email}</p>
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
      </main>
    </div>
  );
}

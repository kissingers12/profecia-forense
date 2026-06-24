// Simple client-side auth with localStorage
// In production replace with a real backend (Supabase, Clerk, etc.)

export type UserSession = {
  email: string;
  name: string;
  plan: "meditaciones" | "escuela" | null;
  accessCode: string;
};

// Demo access codes — in production these come from your payment provider webhook
const VALID_CODES: Record<string, Omit<UserSession, "email" | "name">> = {
  "MED-2025-DEMO": { plan: "meditaciones", accessCode: "MED-2025-DEMO" },
  "ESC-2025-DEMO": { plan: "escuela", accessCode: "ESC-2025-DEMO" },
};

export function validateAccessCode(code: string): Omit<UserSession, "email" | "name"> | null {
  return VALID_CODES[code.toUpperCase()] ?? null;
}

export function saveSession(session: UserSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pf_session", JSON.stringify(session));
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("pf_session");
    return raw ? (JSON.parse(raw) as UserSession) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("pf_session");
}

export const PLAN_LABELS: Record<string, string> = {
  meditaciones: "Meditaciones para Profecía Forense",
  escuela: "Escuela Avanzada de Profecía",
};

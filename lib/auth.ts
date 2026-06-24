export type UserSession = {
  email: string;
  name: string;
  plan: "meditaciones" | "escuela" | null;
  accessCode: string;
  activated: boolean;
};

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
  meditaciones: "Meditación Profética",
  escuela: "Escuela Avanzada de Profecía",
};

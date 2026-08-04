// Limitador de intentos en memoria.
// Nota: en Vercel cada instancia tiene su propio contador y se reinicia al
// arrancar, así que no es perfecto — pero frena de forma efectiva los ataques
// de fuerza bruta y los bots, que dependen de hacer miles de intentos seguidos.

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Map<string, Entry>>();

/**
 * Devuelve true si la acción está permitida, false si se pasó del límite.
 * @param bucket  nombre del grupo (ej: "login")
 * @param key     identificador (IP, email…)
 * @param max     intentos permitidos dentro de la ventana
 * @param windowMs duración de la ventana en milisegundos
 */
export function allow(bucket: string, key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  let b = buckets.get(bucket);
  if (!b) {
    b = new Map();
    buckets.set(bucket, b);
  }

  // Limpieza ocasional para que el mapa no crezca sin control
  if (b.size > 5000) {
    for (const [k, v] of b) if (now > v.resetAt) b.delete(k);
  }

  const entry = b.get(key);
  if (!entry || now > entry.resetAt) {
    b.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

/** Reinicia el contador tras una acción legítima (ej: login correcto). */
export function reset(bucket: string, key: string) {
  buckets.get(bucket)?.delete(key);
}

/** IP del visitante según las cabeceras que pone Vercel. */
export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "desconocida"
  );
}

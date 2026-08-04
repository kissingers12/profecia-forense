import crypto from "crypto";
import { allow, clientIp } from "./rate-limit";

/**
 * Comprueba la contraseña de administrador.
 *
 * - Compara en tiempo constante para no filtrar la contraseña carácter a carácter.
 * - Limita los intentos por IP: sin esto, un bot podría probar contraseñas sin parar
 *   hasta entrar en el panel (que da acceso a todos los clientes).
 */
export function checkAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  if (!allow("admin", clientIp(req), 12, 15 * 60_000)) return false;

  const given = req.headers.get("x-admin-password") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

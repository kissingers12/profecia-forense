import crypto from "crypto";
import { allow, reset, clientIp } from "./rate-limit";

const DIA = 24 * 60 * 60_000;

/**
 * Comprueba la contraseña de administrador.
 *
 * - Compara en tiempo constante para no filtrar la contraseña carácter a carácter.
 * - Solo 3 intentos fallidos por dispositivo cada 24 h: el panel da acceso a todos
 *   los clientes, así que se protege al máximo.
 * - Al acertar se borra el contador, de modo que equivocarse una o dos veces
 *   no deja a Kissingers fuera del panel.
 */
export function checkAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const ip = clientIp(req);
  if (!allow("admin", ip, 3, DIA)) return false;

  const given = req.headers.get("x-admin-password") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  const ok = crypto.timingSafeEqual(a, b);
  if (ok) reset("admin", ip);
  return ok;
}

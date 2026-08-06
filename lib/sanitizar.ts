/**
 * Limpieza de textos que van a parar al correo de Kissingers.
 *
 * Los mensajes los escribe cualquiera desde la web, así que se tratan como
 * material no fiable: se eliminan los enlaces (la vía habitual de phishing y
 * estafas) y los caracteres que podrían manipular la cabecera del correo.
 */

// Direcciones de correo: se conservan, porque suelen ser el dato que el
// alumno necesita darnos ("mi correo de registro es ...").
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// Enlaces escritos de las formas más habituales
const CON_ESQUEMA = /\b(?:[a-z][a-z0-9+.-]*:\/\/|www\.)\S+/gi;
const ESQUEMAS_PELIGROSOS = /\b(?:javascript|data|vbscript|file|mailto|tel)\s*:\S*/gi;
// Dominios sueltos escritos sin http, tipo "misitio.com/oferta"
const DOMINIO_SUELTO =
  /\b[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9-]+)*\.(?:com|net|org|io|co|me|info|biz|xyz|top|link|click|shop|online|site|store|app|dev|ru|cn|tk|ml|ga|cf|gq|es|mx|ar|cl|pe|ve|do|gt|hn|sv|ni|cr|pa|py|uy|bo|ec|br|us|uk|de|fr|it|pt)\b(?:\/\S*)?/gi;
// Intentos de disimular el enlace: "hxxp://", "misitio punto com"
const DISIMULADO =
  /\bh\s*x+\s*t*\s*p\s*s?\b\S*|\b\w+\s*\(?\s*punto\s*\)?\s*(?:com|net|org|co)\b/gi;

// Caracteres invisibles usados para disimular texto.
// INVISIBLES conserva los saltos de línea del mensaje; la otra versión no.
const INVISIBLES = new RegExp(
  "[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2060\uFEFF]",
  "g"
);
const INVISIBLES_Y_SALTOS = new RegExp(
  "[\u0000-\u001F\u007F\u200B-\u200F\u2060\uFEFF]",
  "g"
);

const MARCA = "[enlace eliminado por seguridad]";

/** Quita enlaces de un texto libre, conservando las direcciones de correo. */
export function sinEnlaces(texto: string): string {
  if (!texto) return "";

  // Se apartan los correos para que no se confundan con dominios
  const correos: string[] = [];
  let t = texto.replace(EMAIL, (m) => {
    correos.push(m);
    return `${correos.length - 1}`;
  });

  t = t
    .replace(ESQUEMAS_PELIGROSOS, MARCA)
    .replace(CON_ESQUEMA, MARCA)
    .replace(DOMINIO_SUELTO, MARCA)
    .replace(DISIMULADO, MARCA);

  // Se devuelven los correos a su sitio
  return t.replace(/(\d+)/g, (_, i) => correos[Number(i)] ?? "");
}

/** Texto de mensaje: sin enlaces, sin caracteres ocultos y de largo limitado. */
export function limpiarMensaje(texto: unknown, maxLargo = 2000): string {
  if (typeof texto !== "string") return "";
  return sinEnlaces(texto.replace(INVISIBLES, "")).slice(0, maxLargo).trim();
}

/**
 * Texto que va en el asunto o en el nombre del remitente.
 * Sin saltos de línea, que permitirían colar cabeceras falsas en el correo.
 */
export function limpiarCabecera(texto: unknown, maxLargo = 120): string {
  if (typeof texto !== "string") return "";
  return sinEnlaces(texto.replace(INVISIBLES_Y_SALTOS, " "))
    .replace(/\s+/g, " ")
    .slice(0, maxLargo)
    .trim();
}

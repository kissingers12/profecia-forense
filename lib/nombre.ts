/**
 * Prepara el nombre del alumno para saludarle en un correo.
 *
 * Los nombres guardados vienen tal cual los escribió cada persona: con espacios
 * de más (" Mary Cruz Umbarila Malagon ") o en mayúsculas ("ANA TULIA URRUTIA").
 * Se usa solo el primer nombre y se corrige el formato para que el saludo
 * quede natural: "¡Bendiciones, Mary!" en vez de "¡Bendiciones,  MARY CRUZ !".
 */
export function nombreDeSaludo(nombreCompleto: string | null | undefined): string {
  if (!nombreCompleto) return "";

  const limpio = nombreCompleto.replace(/\s+/g, " ").trim();
  if (!limpio) return "";

  const primero = limpio.split(" ")[0];

  // Descartar valores que no parecen un nombre (correos, números, iniciales sueltas)
  if (primero.length < 2 || primero.includes("@") || /\d/.test(primero)) return "";

  // Si viene todo en mayúsculas, pasarlo a formato normal
  if (primero === primero.toUpperCase()) {
    return primero.charAt(0) + primero.slice(1).toLowerCase();
  }

  return primero;
}

// Única lista de clases individuales: la usan el panel del alumno, el admin y los correos.
export const CLASES_INDIVIDUALES: Array<{ id: number; title: string; vimeoId: string | null; nivel: string }> = [
  { id: 101, title: "Desbloqueando los ojos espirituales", vimeoId: "1204614170", nivel: "Basico" },
  { id: 102, title: "Cómo recibir Espíritu de Profecía", vimeoId: "1204614262", nivel: "Basico" },
  { id: 103, title: "Primeros pasos profetizando", vimeoId: "1204614337", nivel: "Basico" },
  { id: 104, title: "La honra y el llamado a profetizar", vimeoId: "1204614447", nivel: "Basico" },
  { id: 105, title: "Profecía por interpretación", vimeoId: "1204615096", nivel: "Basico" },
  { id: 106, title: "Profecía al tocar una persona", vimeoId: "1204615280", nivel: "Basico" },
  { id: 107, title: "Cómo ver letras y nombres en el espíritu", vimeoId: "1204615509", nivel: "Basico" },
  { id: 108, title: "Abrir los ojos y tener visiones", vimeoId: "1204615620", nivel: "Basico" },
  { id: 1, title: "El Secreto de la Meditación 1", vimeoId: "1204206028", nivel: "Intermedio" },
  { id: 2, title: "El Secreto de la Meditación 2", vimeoId: "1204206979", nivel: "Intermedio" },
  { id: 3, title: "El Secreto de la Meditación 3", vimeoId: "1204224003", nivel: "Intermedio" },
  { id: 4, title: "El Secreto de la Meditación 4", vimeoId: "1204242854", nivel: "Intermedio" },
  { id: 7, title: "4 horas instrumental para meditar", vimeoId: "1204255913", nivel: "Intermedio" },
  { id: 201, title: "LA LLAVE DE LA CIENCIA: ESTO ACTIVA LO PROFÉTICO", vimeoId: "1204243775", nivel: "Avanzado" },
  { id: 202, title: "La Meditación de los profetas para salir del cuerpo", vimeoId: "1204243894", nivel: "Avanzado" },
  { id: 203, title: "Actos Proféticos 1", vimeoId: "1204621088", nivel: "Avanzado" },
  { id: 204, title: "Actos Proféticos 2", vimeoId: "1204621216", nivel: "Avanzado" },
  { id: 205, title: "Acto profético 3", vimeoId: "1204621410", nivel: "Avanzado" },
  { id: 206, title: "Ángeles, Fantasmas y sombras", vimeoId: "1204621581", nivel: "Avanzado" },
  { id: 207, title: "El secreto de la prosperidad", vimeoId: "1204620987", nivel: "Avanzado" },
  { id: 208, title: "esto me hizo millonario (Parte 1)", vimeoId: "1204621966", nivel: "Avanzado" },
  { id: 209, title: "esto me hizo millonario (Parte 2)", vimeoId: "1204621894", nivel: "Avanzado" },
  { id: 210, title: "Si lo crees ya eres profeta", vimeoId: "1204621749", nivel: "Avanzado" },
  { id: 301, title: "Profecía Forense 1", vimeoId: "1213817829", nivel: "Avanzado" },
  { id: 401, title: "Meditación Imaginaria: Navegando en lo Invisible", vimeoId: "1232777507", nivel: "Avanzado" },
  { id: 402, title: "Este es mi SECRETO para hacer millones... Entrar en meditación antes que llegue", vimeoId: "1237664905", nivel: "Avanzado" },
];

export const CLASS_NAMES: Record<number, string> = {
  100: "Nivel Básico completo (8 clases)",
  ...Object.fromEntries(CLASES_INDIVIDUALES.map((c) => [c.id, c.title])),
};

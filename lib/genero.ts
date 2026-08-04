/**
 * Deduce si un nombre es de mujer o de hombre para poder saludar
 * "Bienvenida" o "Bienvenido".
 *
 * Devuelve "f", "m" o null cuando no está claro. En caso de duda SIEMPRE
 * devuelve null: es preferible un saludo neutro antes que equivocarse
 * y dirigirse mal a un alumno.
 */

// Nombres de mujer que NO terminan en -a
const FEMENINOS = new Set([
  "isabel", "carmen", "beatriz", "raquel", "ester", "esther", "judith", "judit",
  "ruth", "rut", "mercedes", "dolores", "ines", "inés", "soledad", "consuelo",
  "rocio", "rocío", "pilar", "belen", "belén", "noemi", "noemí", "nohemi", "nohemí",
  "miriam", "myriam", "maribel", "marisol", "milagros", "remedios", "nieves",
  "yaneth", "yanet", "janeth", "lisbeth", "elizabeth", "elisabeth", "meybelin",
  "caridad", "libertad", "trinidad", "yamileth", "yamilet", "nazareth", "anabel",
  "cruz", "estrella", "flor", "luz", "paz", "sol", "abigail", "mabel",
  "yasmin", "yazmin", "jazmin", "jazmín", "yohana", "carol", "eunice", "keren",
  // Frecuentes en Latinoamérica
  "yeny", "yenny", "jenny", "yenifer", "jennifer", "yeniffer", "lilibeth",
  "marlenne", "marlene", "marleny", "desiree", "desirée", "anamery", "astrid",
  "mayerly", "karelys", "madeline", "rosiel", "arneidy", "yanuzzi", "nancy",
  "yaritza", "yaneth", "leidy", "leydi", "yulieth", "yuleisy", "dayana", "wendy",
  "nayibe", "maidelys", "yorgelis", "greisy", "yusmary", "yanetsy", "solangel",
  "mariangel", "maryori", "yolimar", "yubisay", "naybeth", "damaris", "dámaris",
  "yosmar", "yeidy", "kelly", "shirley", "yamil", "aracelis", "mariel", "meybel",
  "nohely", "noely", "yulissa", "roxana", "ivon", "yvon", "yubi", "lucy", "cindy",
]);

// Nombres de hombre que SÍ terminan en -a, o que no terminan en -o
const MASCULINOS = new Set([
  "elia", "elias", "elías", "josua", "josue", "josué", "luca", "nicola", "andrea",
  "sasha", "misha", "bautista", "cuauhtemoc", "zacarias", "zacarías", "matias",
  "matías", "tobias", "tobías", "jeremias", "jeremías", "isaias", "isaías",
  "ezequias", "ezequías", "barnaba", "aquila", "akira", "yeshua", "joshua",
  // Frecuentes en Latinoamérica que no acaban en -o
  "daniel", "edwin", "robinson", "joaquin", "joaquín", "hector", "héctor",
  "jesus", "jesús", "ariel", "magdiel", "gabriel", "miguel", "manuel", "rafael",
  "israel", "ismael", "samuel", "ezequiel", "nathaniel", "emmanuel", "uriel",
  "jose", "josé", "andres", "andrés", "luis", "carlos", "juan", "victor", "víctor",
  "javier", "jose", "oscar", "óscar", "cesar", "césar", "wilmer", "wilder",
  "yeison", "jeison", "jhon", "john", "jonathan", "brayan", "bryan", "kevin",
  "cristian", "christian", "yeiner", "deiber", "elkin", "nelson", "wilson",
  "jefferson", "anderson", "yorman", "alexander", "alexis", "yohan", "johan",
  "abel", "adan", "adán", "aaron", "aarón", "simon", "simón", "ruben", "rubén",
  "efrain", "efraín", "german", "germán", "hernan", "hernán", "adrian", "adrián",
  "sebastian", "sebastián", "julian", "julián", "fabian", "fabián", "damian",
  "damián", "esteban", "ivan", "iván", "martin", "martín", "agustin", "agustín",
  "kissingers", "yeferson", "leider", "smith", "walter", "milton", "einer",
]);

export function generoPorNombre(nombreCompleto: string | null | undefined): "f" | "m" | null {
  if (!nombreCompleto) return null;

  const limpio = nombreCompleto.replace(/\s+/g, " ").trim().toLowerCase();
  if (!limpio) return null;

  const primero = limpio.split(" ")[0];
  if (primero.length < 3) return null;

  // "María José" es mujer y "José María" es hombre: manda el primer nombre,
  // así que las listas de excepciones se consultan antes que la terminación
  if (MASCULINOS.has(primero)) return "m";
  if (FEMENINOS.has(primero)) return "f";

  const ultima = primero.slice(-1);
  if (ultima === "a") return "f";
  if (ultima === "o") return "m";

  // Terminaciones típicas de mujer
  if (/(ión|ion)$/.test(primero)) return null; // Asunción/Encarnación son de mujer, pero también hay apellidos
  if (/(triz|dad)$/.test(primero)) return "f";

  return null;
}

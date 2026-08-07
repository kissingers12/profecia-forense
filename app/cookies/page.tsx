import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de cookies | 100x100Cristianos",
  description: "Qué se guarda en tu navegador al usar la web y cómo eliminarlo.",
};

export default function Cookies() {
  return (
    <PaginaLegal titulo="Política de cookies" actualizado="7 de agosto de 2026">
      <section>
        <h2>En resumen</h2>
        <p>
          Esta web <strong>no utiliza cookies publicitarias ni de seguimiento</strong>. No tenemos
          Google Analytics, ni píxeles de redes sociales, ni ningún sistema que siga tu navegación
          por otros sitios. Por eso no verás el típico aviso de cookies.
        </p>
      </section>

      <section>
        <h2>Qué se guarda en tu navegador</h2>
        <ul>
          <li>
            · <strong>Tu sesión.</strong> Cuando inicias sesión, tu navegador guarda localmente tus
            datos de acceso para no pedirte la contraseña en cada página. No es una cookie y no se
            envía a terceros. Desaparece al cerrar sesión.
          </li>
          <li>
            · <strong>Cookies de Vimeo.</strong> Los vídeos de las clases se reproducen a través de
            Vimeo. Al abrir una clase, Vimeo puede instalar sus propias cookies para recordar
            ajustes del reproductor y medir la reproducción. Se rigen por la política de privacidad
            de Vimeo.
          </li>
          <li>
            · <strong>Cookies técnicas de pago.</strong> Si pagas con criptomonedas o por PayPal,
            esas plataformas usan sus propias cookies dentro de sus páginas. Ese proceso ocurre
            fuera de nuestra web.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cómo eliminarlas</h2>
        <p>
          Puedes borrar en cualquier momento lo que tu navegador guarda desde sus ajustes, en la
          sección de privacidad o de datos de navegación. Ten en cuenta que si borras los datos de
          esta web, se cerrará tu sesión y tendrás que iniciarla de nuevo. Tu progreso en las clases
          no se pierde: queda guardado en tu cuenta.
        </p>
      </section>

      <section>
        <h2>Más información</h2>
        <p>
          Para saber qué datos tratamos y con qué finalidad, consulta nuestra{" "}
          <a href="/privacidad" className="text-[#c9a84c] hover:underline">
            política de privacidad
          </a>
          .
        </p>
      </section>
    </PaginaLegal>
  );
}

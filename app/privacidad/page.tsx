import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de privacidad | 100x100Cristianos",
  description: "Qué datos guardamos, para qué los usamos y cómo puedes controlarlos.",
};

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad" actualizado="7 de agosto de 2026">
      <section>
        <h2>¿Quién trata tus datos?</h2>
        <p>
          El responsable de esta plataforma es <strong>Greca S.L.U.</strong>, que gestiona la
          formación espiritual ofrecida en kissingersaraque.com. Puedes ponerte en contacto a través
          del formulario de contacto de la web para cualquier asunto relacionado con tus datos.
        </p>
      </section>

      <section>
        <h2>¿Qué datos recogemos?</h2>
        <ul>
          <li>· <strong>Al registrarte:</strong> tu nombre, tu correo electrónico y una contraseña.</li>
          <li>· <strong>Opcionalmente:</strong> tu número de WhatsApp, si decides facilitarlo.</li>
          <li>· <strong>De tu formación:</strong> el programa que elegiste y qué clases has visto, para mostrarte tu progreso.</li>
          <li>· <strong>De tus pagos:</strong> el importe, la fecha y el estado. Nunca vemos ni guardamos los datos de tu tarjeta o de tu monedero.</li>
          <li>· <strong>De tu actividad:</strong> registros de acceso y de descargas, para poder ayudarte si algo falla.</li>
        </ul>
        <p className="mt-3">
          Tu contraseña se guarda <strong>cifrada</strong>: ni nosotros podemos leerla. Si la
          olvidas, se restablece con un código enviado a tu correo.
        </p>
      </section>

      <section>
        <h2>¿Para qué los usamos?</h2>
        <ul>
          <li>· Darte acceso a la formación que has adquirido y guardar tu progreso.</li>
          <li>· Enviarte los correos propios del servicio: bienvenida, acceso activado o avisos sobre tu pago.</li>
          <li>· Atender tus mensajes de soporte y comprobar tus pagos.</li>
          <li>· Cumplir con nuestras obligaciones legales y fiscales.</li>
        </ul>
        <p className="mt-3">
          No usamos tus datos para publicidad, no los vendemos y no los cedemos a terceros con
          fines comerciales.
        </p>
      </section>

      <section>
        <h2>¿Quién más interviene?</h2>
        <p>
          Para que la plataforma funcione nos apoyamos en estos servicios, que tratan datos por
          nuestra cuenta:
        </p>
        <ul className="mt-3">
          <li>· <strong>Supabase</strong> — guarda la base de datos de las cuentas.</li>
          <li>· <strong>Vercel</strong> — aloja la página web.</li>
          <li>· <strong>NOWPayments</strong> — procesa los pagos con criptomonedas.</li>
          <li>· <strong>PayPal</strong> — procesa las donaciones y pagos con tarjeta.</li>
          <li>· <strong>Google (Gmail)</strong> — envía los correos del servicio.</li>
          <li>· <strong>Vimeo</strong> — reproduce los vídeos de las clases.</li>
        </ul>
      </section>

      <section>
        <h2>¿Cuánto tiempo conservamos tu información?</h2>
        <p>
          Toda tu información personal la guardaremos durante el tiempo en el que seas usuario o
          usuaria de la plataforma. Si nos pides que eliminemos tu cuenta, borramos tus datos
          personales, salvo los registros de pago que debamos conservar por obligación fiscal.
        </p>
      </section>

      <section>
        <h2>¿Qué derechos tienes sobre tus datos?</h2>
        <p>
          Puedes pedirnos en cualquier momento <strong>acceder</strong> a tus datos,{" "}
          <strong>corregirlos</strong>, <strong>eliminarlos</strong>, obtener una{" "}
          <strong>copia</strong> de ellos u <strong>oponerte</strong> a determinados usos. Basta con
          que nos escribas desde el formulario de contacto usando el correo con el que te
          registraste. Responderemos lo antes posible.
        </p>
      </section>

      <section>
        <h2>¿Cómo protegemos tu información?</h2>
        <p>
          Las contraseñas se guardan cifradas, la web funciona siempre bajo conexión segura (HTTPS)
          y el acceso a la administración está protegido con contraseña y con límites que frenan los
          intentos automáticos. Aun así, ningún sistema es infalible: si detectas algo extraño en tu
          cuenta, avísanos enseguida.
        </p>
      </section>

      <section>
        <h2>¿Pueden registrarse menores de edad?</h2>
        <p>
          Esta plataforma no está dirigida a menores de 16 años. Si eres menor, necesitas la
          autorización de tu padre, madre o tutor para registrarte.
        </p>
      </section>

      <section>
        <h2>¿Puede cambiar esta política?</h2>
        <p>
          Si cambiamos algo importante, actualizaremos la fecha que aparece al principio de esta
          página. Te recomendamos revisarla de vez en cuando.
        </p>
      </section>
    </PaginaLegal>
  );
}

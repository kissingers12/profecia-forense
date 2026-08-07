import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de seguridad | 100x100Cristianos",
  description: "Cómo protegemos tu cuenta, tus pagos y tu información.",
};

export default function Seguridad() {
  return (
    <PaginaLegal titulo="Política de seguridad" actualizado="7 de agosto de 2026">
      <section>
        <h2>¿Cómo se protege tu contraseña?</h2>
        <p>
          Tu contraseña <strong>nunca se guarda tal como la escribiste</strong>. Se transforma
          mediante un sistema de cifrado que no puede revertirse, de modo que ni siquiera nosotros
          podemos leerla. Si la olvidas, no te la enviamos: se restablece con un código temporal que
          llega a tu correo y caduca a los 15 minutos.
        </p>
      </section>

      <section>
        <h2>¿Cómo se protege tu cuenta frente a intrusos?</h2>
        <ul>
          <li>· <strong>Límite de intentos:</strong> tras varios intentos fallidos de contraseña, el acceso a esa cuenta se bloquea temporalmente. Así se frenan los programas que prueban miles de claves.</li>
          <li>· <strong>Códigos de recuperación limitados:</strong> el código de 6 dígitos solo admite unos pocos intentos, para que nadie pueda adivinarlo probando combinaciones.</li>
          <li>· <strong>Panel de administración protegido:</strong> con contraseña propia y un límite muy estricto de intentos.</li>
          <li>· <strong>Conexión cifrada:</strong> toda la web funciona bajo HTTPS, de forma que lo que envías viaja protegido.</li>
        </ul>
      </section>

      <section>
        <h2>¿Están seguros mis datos de pago?</h2>
        <p>
          Sí, porque <strong>no pasan por nuestra web</strong>. Los pagos con criptomonedas los
          gestiona NOWPayments y los pagos con tarjeta se realizan a través de PayPal, ambas
          plataformas especializadas. Nosotros solo recibimos la confirmación de que un pago se ha
          realizado: el importe, la fecha y el estado.
        </p>
        <p className="mt-3">
          <strong>Nunca vemos ni almacenamos</strong> los datos de tu tarjeta, tus claves bancarias
          ni las de tu monedero de criptomonedas. Además, cada aviso de pago que recibimos se
          comprueba con una firma digital: los avisos falsos se rechazan automáticamente.
        </p>
      </section>

      <section>
        <h2>¿Quién puede ver tu información?</h2>
        <p>
          Solo la administración de la plataforma, y únicamente para gestionar tu acceso y darte
          soporte. El contenido de las clases está alojado en Vimeo con restricción de dominio: los
          vídeos solo pueden reproducirse dentro de kissingersaraque.com.
        </p>
      </section>

      <section>
        <h2>¿Qué haces tú para estar más seguro?</h2>
        <ul>
          <li>· Usa una contraseña que no utilices en otros sitios.</li>
          <li>· No compartas tus credenciales: el acceso es personal e intransferible.</li>
          <li>· Cierra sesión si usas un ordenador o un móvil compartido.</li>
          <li>· Desconfía de cualquier correo que te pida tu contraseña: <strong>nosotros nunca te la pediremos</strong>.</li>
        </ul>
      </section>

      <section>
        <h2>¿Y si detectas algo raro?</h2>
        <p>
          Escríbenos cuanto antes desde el formulario de contacto, con el correo de tu cuenta. Si
          sospechas que alguien ha entrado en tu cuenta, cambia tu contraseña de inmediato desde la
          opción «¿Olvidaste tu contraseña?» del inicio de sesión.
        </p>
      </section>

      <section>
        <h2>¿Es infalible?</h2>
        <p>
          Ningún sistema lo es, y sería deshonesto afirmarlo. Trabajamos con proveedores serios y
          revisamos la seguridad de la plataforma de forma periódica, pero si llegara a producirse
          un incidente que afecte a tus datos, te lo comunicaríamos y te indicaríamos qué hacer.
        </p>
      </section>
    </PaginaLegal>
  );
}

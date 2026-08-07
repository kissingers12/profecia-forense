import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";

export const metadata: Metadata = {
  title: "Términos y condiciones | 100x100Cristianos",
  description: "Condiciones de uso, pagos, accesos y devoluciones de las formaciones.",
};

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones" actualizado="7 de agosto de 2026">
      <section>
        <h2>¿Quién presta el servicio?</h2>
        <p>
          <strong>Greca, SLU</strong> (NIF L718895M) ofrece a través de kissingersaraque.com la formación
          espiritual impartida por Kissingers Araque, en formato de clases grabadas. Al registrarte
          y realizar un pago aceptas estas condiciones.
        </p>
      </section>

      <section>
        <h2>¿Qué incluye cada formación?</h2>
        <ul>
          <li>· <strong>Meditación Profética — $333 USD:</strong> las enseñanzas de meditación profética publicadas en esa sección.</li>
          <li>· <strong>Escuela de Profetas · Todas las Clases — $555 USD:</strong> más de 25 enseñanzas grabadas desde 2023, organizadas por niveles, más el libro «El Manual para Escuchar a Dios» de regalo.</li>
        </ul>
        <p className="mt-3">
          Para contratar cualquiera de estas dos formaciones solo se piden{" "}
          <strong>tu nombre y tu correo electrónico</strong>. No se solicita número de teléfono.
        </p>
        <p className="mt-3">
          La <strong>Escuela Avanzada de Profecía ($777)</strong>, que incluía mentoría personalizada
          y clases por Zoom, tenía 15 plazas y está agotada: no admite nuevas inscripciones. Era la
          única que pedía el número de WhatsApp, necesario para el grupo donde se coordinaban las
          sesiones en directo. Quienes ya la adquirieron conservan su acceso en las condiciones en
          que la contrataron.
        </p>
        <p className="mt-3">
          Ambos programas son <strong>de pago único y acceso permanente</strong>, disponibles 24
          horas. Las nuevas enseñanzas que se publiquen en tu formación quedan incluidas sin coste
          adicional. Salvo que se indique lo contrario, <strong>no incluyen mentoría personalizada
          ni clases en directo</strong>.
        </p>
      </section>

      <section>
        <h2>¿Puedo compartir mi cuenta?</h2>
        <p>
          El acceso es <strong>personal e intransferible</strong>. No está permitido compartir tus
          credenciales, dar acceso a terceros ni descargar, copiar, revender o redifundir los
          vídeos, el libro o cualquier material de la formación.
        </p>
        <p className="mt-3">
          Si detectamos que una cuenta se comparte o que el contenido se redistribuye, podremos
          suspenderla sin derecho a devolución. Eres responsable de mantener tu contraseña a salvo.
        </p>
      </section>

      <section>
        <h2>¿Cómo se paga y cuándo se activa el acceso?</h2>
        <ul>
          <li>· <strong>Con criptomonedas:</strong> el acceso se activa de forma automática al confirmarse el pago en la red. Suele tardar entre 20 y 40 minutos.</li>
          <li>· <strong>Con tarjeta, mediante donación por PayPal:</strong> debes enviarnos el comprobante desde tu cuenta. Activamos el acceso manualmente, normalmente en menos de 24 horas.</li>
        </ul>
        <p className="mt-3">
          Los precios están expresados en dólares estadounidenses (USD). Las comisiones de red o de
          conversión que aplique tu monedero o PayPal corren por tu cuenta.
        </p>
      </section>

      <section>
        <h2>¿Puedo pedir una devolución?</h2>
        <p>
          Como se trata de contenido digital al que accedes de inmediato, la devolución funciona
          así:
        </p>
        <ul className="mt-3">
          <li>· <strong>Pago por error</strong> (importe equivocado, pago duplicado o formación que no querías): se devuelve el importe completo, siempre que no hayas accedido al contenido.</li>
          <li>· <strong>Si ya has visto parte del contenido:</strong> la devolución es parcial y proporcional, calculada según las clases que <strong>no</strong> hayas visto. El sistema registra qué clases has visto, y ese registro es el que se utiliza para el cálculo.</li>
          <li>· <strong>Si has visto la formación completa:</strong> no procede devolución.</li>
        </ul>
        <p className="mt-3">
          Para solicitarla, escríbenos desde el formulario de contacto con el correo de tu cuenta,
          indicando el motivo. Las devoluciones se abonan por el mismo medio de pago siempre que sea
          posible.
        </p>
      </section>

      <section>
        <h2>¿De quién es el contenido?</h2>
        <p>
          Todas las enseñanzas, vídeos, textos, materiales y el libro son obra de Kissingers Araque,
          se explotan a través de <strong>Greca, SLU</strong> y están protegidos por derechos de
          autor. Tu compra te da derecho a{" "}
          <strong>verlos y estudiarlos personalmente</strong>, no a reproducirlos, distribuirlos ni
          utilizarlos con fines comerciales.
        </p>
      </section>

      <section>
        <h2>¿Qué pasa si la plataforma no está disponible?</h2>
        <p>
          Trabajamos para que la plataforma esté siempre disponible, pero puede haber
          interrupciones puntuales por mantenimiento o por causas ajenas a nosotros (fallos de los
          proveedores de alojamiento, vídeo o pagos). Esas interrupciones no dan derecho a
          devolución.
        </p>
      </section>

      <section>
        <h2>¿Qué tipo de formación es esta?</h2>
        <p>
          El contenido tiene una finalidad de <strong>formación espiritual y crecimiento
          personal</strong>. No sustituye el consejo médico, psicológico, legal ni financiero
          profesional, y no garantizamos resultados concretos, ya que dependen del recorrido
          personal de cada participante.
        </p>
      </section>

      <section>
        <h2>¿Pueden cambiar estas condiciones?</h2>
        <p>
          Podemos actualizarlas para reflejar cambios en los programas o en la ley. La fecha de la
          última actualización aparece al principio. Los cambios no afectan retroactivamente a las
          compras ya realizadas.
        </p>
      </section>
    </PaginaLegal>
  );
}

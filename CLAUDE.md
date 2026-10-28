@AGENTS.md

- Responde siempre en español.

# Clase individual — cómo funciona (PRs #31–#38)

## Lista de clases
- `lib/clases.ts` es la ÚNICA lista de clases (id, título, vimeoId, nivel). La usan el dashboard, el admin y los correos. No crear copias: antes había una lista inventada en admin y correos con nombres que no coincidían (p. ej. 201 ≠ "El Secreto de la Meditación 1").
- IDs reales: 101–108 (Básico), 1–4 y 7 (Intermedio), 201–210, 301, 401, 402 (Avanzado). Bundles: 100 → 101–108; 208 → 208+209 (`BUNDLE_IDS` en webhook y grant-class).

## Datos (Supabase)
- `class_purchases(user_email, video_id, UNIQUE(user_email, video_id))`: clases desbloqueadas. Desactivar un usuario NO borra sus filas; ELIMINAR al usuario sí (antes no, y un nuevo registro con el mismo correo heredaba clases viejas). `DELETE /api/admin/grant-class` quita una clase concreta (✕ en el admin).
- `activity_logs` sirve de registro de eventos:
  - `user_name="CLASE_ELEGIDA"`, `action=<videoId>`: clase elegida al registrarse (`/api/auth/register`) o al comprar desde el panel (`/api/payment/class`). Antes no se guardaba si el alumno no pagaba con cripto (p. ej. PayPal).
  - `user_name="PAGO"`, `user_email=<order_id>`: avisos de NOWPayments. En clase individual el order_id es `email:clase:videoId`.
  - `user_name="PAYPAL"`: pulsó pagar con PayPal (no indica clase).
  - `user_name="CORREO"`, `action="bienvenida" | "bienvenida_clase"`: correos de bienvenida enviados.
- `lib/clase-elegida.ts` → `clasesElegidas()`: última clase elegida por email (CLASE_ELEGIDA o PAGO con `:clase:`). Lo usan `/api/admin/users` (campo `claseElegida`) y `/api/admin/payments` (campo `claseId`).

## Acceso y correos
- Pago automático: `app/api/webhooks/nowpayments/route.ts` detecta `:clase:`, hace upsert en `class_purchases`, pone `activated=true` y envía `sendClaseIndividualWelcomeEmail` (lib/emails.ts) SOLO por clases que el usuario no tenía (NOWPayments avisa varias veces del mismo pago).
- Admin manual: `/api/admin/grant-class` asigna clase + activa + envía el correo solo por clases nuevas. Desactivar y reactivar la misma clase no reenvía.
- `/api/admin/activate` (otros planes y "Dar acceso" genérico): no reenvía la bienvenida si ya existe un log CORREO bienvenida/bienvenida_clase; devuelve `yaEnviada`.
- Planes que no son clase individual usan `sendWelcomeEmail` (texto genérico de "contenido futuro"); clase individual NUNCA debe recibir ese correo.

## Panel admin (`app/admin/page.tsx`)
- Clientes: usuario clase_individual pendiente → botón "Activar y asignar clase" (selector SIN preselección: el usuario pidió no preseleccionar) → grant-class. La tarjeta muestra "Eligió: <nombre>".
- Pagos: muestra "Clase: <nombre>". "Dar acceso" para clase individual confirma y asigna la clase conocida; si no se conoce, abre el selector en Clientes.
- Se eliminó el bloque SQL "Reparar base de datos" (la tabla class_purchases ya existe en producción).

## Invitaciones (pestaña "Invitar" del admin)
- `POST /api/admin/invite {email, name?, videoIds[]}`: si no existe, crea usuario `clase_individual` activado con contraseña aleatoria; añade las clases a `class_purchases`; envía `sendInvitationEmail`. Devuelve `link` para copiarlo (WhatsApp).
- Enlace `/invitacion?token=...`: token aleatorio; en `activity_logs` (`user_name="INVITACION"`) se guarda solo su sha256 (`lib/invitacion.ts`). Al usarlo, `action` pasa a `usada:<hash>`; al reinvitar, los anteriores pasan a `anulada:<hash>`.
- `POST /api/auth/invitacion {token, email, password}`: comprueba token+email, guarda la contraseña y devuelve el usuario para iniciar sesión → `/dashboard`.
- Si la persona ya tenía cuenta (y no tiene invitación pendiente) solo se añaden clases y el enlace es `/login`.

## Pendiente / a tener en cuenta
- Usuarios registrados antes del PR #37 no tienen CLASE_ELEGIDA.
- Correos de clase enviados antes del PR #38 pudieron llevar el nombre de clase equivocado (el vídeo desbloqueado sí era correcto).
- No se ha probado de punta a punta en producción desde el entorno de Claude (la red bloquea kissingersaraque.com); el usuario prueba manualmente.
- Cuenta de prueba del dueño: pskissingers@gmail.com ("Hugo boss"/"Kissingers 12"/"Kissingers Araque"); tenía la 201 heredada de pruebas anteriores.

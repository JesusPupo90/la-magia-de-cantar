# 📋 Especificaciones Técnicas y Edge Cases: Pasarela de Pagos

## Mercado Pago + Next.js + Supabase

> **Documento de Especificaciones Técnicas (Checkout / Pagos)**
> **Proyecto:** YANETSIS + La Magia de Cantar
> **Alcance:** Sistema de cobros y ordenamiento en línea

Este documento centraliza todos los requerimientos técnicos, consideraciones de seguridad, flujos de UX y casos límite (edge cases) para la implementación del sistema de cobros y ordenamiento en línea para La Magia de Cantar.

---

## 1. 🛡️ Seguridad e Integridad de Datos (Pre-Pago)

### Precios Centralizados en el Servidor

- **Regla de oro:** El cliente (frontend) NUNCA envía montos monetarios al servidor ni a la pasarela.
- **Flujo:** El frontend solo envía el `service_id` y el `variant_id` (el CTA `#formulario-compra?service=...&plan=...` del UI ya los provee). El Server Action consulta el precio oficial (`service_variants.price`) directo desde Supabase y crea la **Preferencia** en Mercado Pago (`POST /checkout/preferences`) con ese monto (`items[].unit_price`) y `external_reference = orders.id`.
- **Payment Brick:** se monta con `initialization.preferenceId` (Checkout Pro embebido). MP procesa el pago y redirige a los `back_urls` (`/checkout/success`, `/checkout/failure`) con `payment_id`, `status` y `external_reference`. El frontend NUNCA vuelve a tocar el monto ni crea pagos.
- **Validación anti-manipulación:** El Server Action verifica que el `variant_id` pertenezca al `service_id` recibido (join en BD) y que `service.is_custom_quote = false`. El servicio `coaching-yanetsis` (`is_custom_quote = true`) NUNCA genera preferencia.
- **Fix de reintentos (1 orden / N intentos):** `createOrder(input, orderId?)` reutiliza la misma fila `orders` si el `orderId` coincide en `variant_id` + `payer_email` y está en `draft|rejected|expired`. Cada intento genera una **nueva Preferencia** (se guarda en `orders.preference_id`) y el pago real queda en `order_payments`. El frontend guarda el `orderId` en `sessionStorage` y lo reenvía en los reintentos.

### Prevención de Doble Envío (Idempotencia en UI)

- Bloqueo inmediato del botón de pago con estado `isSubmitting` / `loading` en React.
- Evita la creación de múltiples intenciones de pago o preferencias duplicadas si el usuario hace clic compulsivo.

### Protección contra Bots (Anti-Spam / Honeypot)

- Implementación de un campo trampa (honeypot) oculto por CSS en el formulario. Si un bot lo llena, el Server Action simula una respuesta exitosa sin procesar la orden ni saturar la base de datos.

### Sanitización y Validación de Entrada (Zod)

- Límite estricto de caracteres en campos de texto (`.max()`).
- Validación Regex en el número telefónico/WhatsApp (`/^[0-9+\s-]+$/`).
- Forzado de minúsculas y formato correcto en email.

---

## 2. ⚡ Arquitectura de Webhooks y Manejo Asíncrono

> **Integración:** Checkout Pro embebido (Payment Brick con `preferenceId`). El webhook recibe notificaciones **topic `payment`** y, opcionalmente, `merchant_order`. Ante cada evento se **reconcilia contra `GET /v1/payments/{id}`** para confirmar el estado real del pago.

### Verificación de Firma Criptográfica (HMAC / X-Signature)

- La API Route que recibe el webhook (`/api/webhooks/mercadopago`) debe validar obligatoriamente la firma del header recibida desde Mercado Pago utilizando la clave secreta del webhook (`MP_WEBHOOK_SECRET`). Si la firma no es válida, la petición se rechaza con `401 Unauthorized`.
- **Formato (implementado):** headers `x-signature: ts=...,v1=...` y `x-request-id`. El manifest a firmar es `id:{data.id};request-id:{x-request-id};ts:{ts};` → HMAC-SHA256 con `MP_WEBHOOK_SECRET` en hex, comparado con `v1` (comparación de tiempo constante).

### Idempotencia en Procesamiento de Eventos

- Para evitar procesar eventos duplicados enviados por reintentos de la pasarela, se consulta/registra el `event_id`/`resource_id` en una tabla `webhook_logs`. Si el ID ya fue procesado, se responde inmediatamente `200 OK` sin reejecutar lógica de negocio.
- **Idempotencia en la creación de la Preferencia:** El Server Action genera un `X-Idempotency-Key` nuevo (uuid) por intento y lo guarda en `orders.idempotency_key`. Si se reutiliza, MP responde `409`. Cada reintento reutiliza la misma fila `orders` y crea una preferencia nueva (intento histórico en `order_payments`).

### Reconciliación y Validación de Monto (Anti-Fraude)

- Ante cada evento `payment`, consultar `GET /v1/payments/{id}` y comparar `transaction_amount` contra `orders.amount_total` (localizadas por `external_reference == orders.id`). Si difieren, **NO** marcar la orden como `paid`; registrar una alerta interna y dejar la orden para revisión manual.

### Gestión de Eventos Desordenados

- Si llega un webhook tardío o antiguo de "Rechazado" o "Pendiente" para una orden que ya está en estado `paid`, el servidor debe ignorar el cambio de estado. La orden no puede retroceder de `paid` a estados anteriores.

### Respuesta Rápida (Timeout Serverless en Vercel)

- El endpoint del webhook debe limitarse a validar la firma, comprobar idempotencia, reconciliar y actualizar el estado de la orden en Supabase (200 OK).
- Tareas pesadas (generación de facturas, envío de e-mails con adjuntos vía Resend) deben ejecutarse de forma asíncrona sin bloquear la respuesta HTTP.

---

## 3. 👥 Gestión de Concurrencia e Inventario (Cupos)

### Prevención de Sobreventa (Race Conditions)

- Para talleres o eventos con cupos limitados, se genera un bloqueo/reserva temporal del cupo al crear la orden en estado `pending_payment` con un tiempo de expiración (ej. 30 minutos).
- Si el pago no se confirma dentro del tiempo límite, la orden pasa a `expired` y el cupo se libera automáticamente.

### Soporte para Pagos Asíncronos (PSE, Efecty, Nequi)

- Métodos que no son de aprobación inmediata (PSE: `bank_transfer`) inician la Order en estado `action_required` con `status_detail: pending_waiting_payment`. El pago devuelve un `payment_method.redirect_url` al que el servidor redirige al usuario (app bancaria/PSE).
- La orden queda en `pending_payment` en la BD. La arquitectura confía 100% en el **Webhook + reconciliación `GET /v1/orders/{id}`** para mutar el estado a `paid` en el momento en que se confirme la transferencia (minutos o horas después).

---

## 4. 🎨 Experiencia de Usuario (UX) y Navegación

### Desacoplamiento de la Redirección del Navegador

- **Regla de oro:** La página de retorno (`/checkout/result`) NUNCA actualiza la base de datos a `paid`. Es una vista de solo lectura que consulta el estado real confirmado previamente por el Webhook.
- Previene fraudes cuando el usuario manipula la URL de retorno o abandona la pestaña antes de la redirección.

### Persistencia en Navegadores In-App (Instagram, TikTok, WhatsApp)

- Al pagar desde Webviews de redes sociales, el salto a la app bancaria (ej. Bancolombia/PSE) puede reiniciar la pestaña al volver.
- La URL de confirmación `/checkout/result?order_id=UUID` debe validar la transacción usando el `order_id` o un token firmado explícito en la URL, sin depender de cookies de sesión.

### Manejo de Orders/Intenciones de Pago Caducadas

- En Checkout API Orders la expiración se configura por transacción con `expiration_time` (formato ISO 8601 duración, ej. `P30M`) y/o `date_of_expiration` en el request de creación de la Order. `orders.expires_at` refleja ese límite en la BD.
- Si el usuario intenta pagar después del vencimiento, la web le muestra un estado limpio con la opción "Reintentar Pago": el Server Action crea una **nueva Order** en MP bajo la misma orden BD, con nueva `X-Idempotency-Key` y nuevo `mp_order_id` (las intenciones vencidas se sobrescriben o quedan como intentos históricos en `order_payments`).

### Persistencia del Formulario ante Recarga / Abandono (Recovery UX)

**Escenario:** El cliente abandona la página por cualquier motivo (salto a la app bancaria/PSE, cierre del Webview in-app, recarga accidental, pérdida de red) y al volver la página se recarga perdiendo los datos que ya había escrito en el formulario.

**Regla de oro:** Ningún dato tipeado por el usuario debe perderse por una recarga; el formulario se auto-guarda y se restaura en el mismo estado.

**Sub-escenarios:**
- **A. Abandono durante el llenado (pre-submit):** Datos aún no enviados al servidor → se restauran desde `sessionStorage`.
- **B. Abandono tras pagar/redirigir (post-submit):** Datos ya persistidos en la orden (`draft`) en Supabase → reanudación por `order_id`/token, sin depender del estado del navegador.

**Arquitectura de persistencia (dos capas):**
1. **Cap primaria — `sessionStorage`:** Autosave con debounce (ej. 300–500 ms) mientras el usuario tipea; restore al montar el componente.
   - *Privacidad (PII):* Limpiar el storage tras pago exitoso o expiración de la orden. Los datos de facturación (documento, teléfono) son datos personales.
   - *Limitación:* No sobrevive al cierre de la pestaña ni al storage efímero de ciertos Webviews.
2. **Cap de respaldo — Draft en Supabase (al intencionar pago):** El `draft` de la orden se crea al crear la Order en MP (estado `draft`), guardando los campos del formulario. La URL de reanudación `/checkout?order_id=UUID` rehidrata el formulario desde el servidor.
   - *Sobrevive* a cualquier recarga/cierre, incluso con storage local perdido.
   - *Seguridad:* El `order_id` actúa como bearer token → no exponerse en analytics/referrer; considerar token firmado de un solo uso.
   - *Limpieza automática:* Los drafts tienen **tiempo límite de vida (TTL)** antes de su borrado automático (ej. 48 horas), liberando cupos y eliminando la PII retenida. Al completarse el pago o caducar la orden, se borra la PII.

**Edge cases:**
- **Contención de capas:** Si existe draft en BD y datos más recientes en storage local, priorizar el más reciente (comparar `updated_at`).
- **Orden expirada con datos restaurados:** Mostrar estado limpio (ver "Manejo de Enlaces/Preferencias Caducadas") conservando los datos del formulario para "Reintentar Pago" sin re-tipear.
- **Storage bloqueado/lleno (incógnito, Webview estricto):** Degradar con gracia → depender del draft en BD.

### Scroll Suave y Feedback Inmediato

- Tras presionar "Pagar" o recibir un error de validación en móvil, la pantalla realiza un desplazamiento suave (`window.scrollTo`) al mensaje correspondiente para asegurar visibilidad en la pantalla (viewport).

---

## 5. 💰 Manejo Monetario y Base de Datos

### Almacenamiento en Enteros (Pesos Colombianos - COP)

- Los precios en la base de datos de Supabase se almacenan como enteros puros (`integer` / `bigint`) en COP (ej. `450000`). Se evitan decimales en SQL para prevenir errores de redondeo en coma flotante.

### Formateo para Mercado Pago (Checkout Pro — Preferencias)

- **`items[].unit_price` es NUMBER** en la unidad principal de la moneda. Para **COP (moneda sin decimales)** se envía el entero de la BD (`unit_price: 2299000`), igual que `transaction_amount` en `GET /v1/payments` (float, sin `.00`).
- ⚠️ **Riesgo off-by-100 (validar en sandbox):** según el método de pago (PSE/efectivo), MP puede interpretar la moneda con decimales implícitos. Validar con tarjeta de prueba y con PSE que el monto cobrado coincida exactamente con `orders.amount_total`.
- La preferencia incluye `external_reference = orders.id` (uuid ≤ 150 chars ✓) y `notification_url = <APP_URL>/api/webhooks/mercadopago`.
- `back_urls`: `success` y `pending` → `/checkout/success`, `failure` → `/checkout/failure`. Con `auto_return: "approved"`, MP redirige automáticamente al aprobar. Las páginas de resultado son SOLO lectura (spec §4).
- ⚠️ **Hallazgo validado (2026-08):** `auto_return: "approved"` exige `back_urls`/`notification_url` **HTTPS públicos**. Con `http://localhost:3000` MP responde `400 invalid_auto_return: "back_url.success must be defined"`. `NEXT_PUBLIC_APP_URL` debe ser **HTTPS** (en local: un túnel tipo ngrok). El `auto_return` se mantiene SIEMPRE en el código (no olvidarlo en producción); `create-order.ts` devuelve un error claro si la URL no es HTTPS.
- ⚠️ **Payment Brick (`MpBricks.tsx`):** el SDK exige `initialization.amount` SIEMPRE, incluso con `preferenceId` (error *"Amount property is required"* si falta). Se envían juntos: `initialization: { preferenceId, amount }` (doc oficial: `amount` es REQUIRED).
- ⚠️ **Contrato `onError` del Payment Brick:** `BrickError.type` es `"critical" | "non_critical"`. Solo los **critical** (falla de inicialización) deben mostrar un banner; los **non_critical** (p. ej. número de tarjeta inválido mientras se tipea, `no_payment_method_for_provided_bin`) los valida y recupera el propio brick inline → **no tocar estado** ni desmontar la UI. El contenedor `#payment-brick-container` nunca se desmonta/intercambia tras el montaje; los errores críticos viven en un banner separado ARRIBA del brick.
- Los reintentos crean una **nueva preferencia** bajo la misma `orders` (nuevo `preference_id`); las anteriores quedan como intentos en `order_payments`.

### Mapeo de Estados Mercado Pago → `order_status`

| MP `status` (payment) | MP `status_detail` | BD `order_status` |
| :--- | :--- | :--- |
| `approved` | `accredited` | `paid` |
| `in_process` / `pending` | `pending_waiting_payment` / `pending_challenge` | `pending_payment` |
| `rejected` / `cancelled` | (cualquiera) | `rejected` |
| reembolso parcial | — | `partially_refunded` |
| reembolso total / contracargo | — | `refunded` |

- La orden NO retrocede: si ya está en `paid`, un evento tardío de `rejected`/`pending` se ignora.

### Ciclo de Vida de las Órdenes (`orders.status`)

```sql
-- Definición Enum en PostgreSQL
create type order_status as enum (
  'draft',             -- Formulario completado, Preferencia creada en MP
  'pending_payment',   -- Redirigido a la pasarela (esperando aprobación / PSE / Efecty)
  'paid',              -- Transacción aprobada y confirmada por Webhook + reconciliación
  'rejected',          -- Rechazado por el banco o fondos insuficientes
  'expired',           -- Expiró el tiempo límite para completar el pago
  'refunded',          -- Dinero devuelto al cliente (reembolso o contracargo)
  'partially_refunded' -- Reembolso parcial
);
```

---

## 6. ⚖️ Cumplimiento Legal y Datos Fiscales (Colombia)

### Habeas Data (Ley 1581 de 2012)

- Checkbox obligatorio en el formulario previo al pago: *"Autorizo el tratamiento de mis datos personales según la política de privacidad"*. Validador estricto de Zod (`z.literal(true)`).

### Recolección de Datos de Facturación (DIAN / Contabilidad)

Para conciliación contable y emisión de recibos en Colombia, el formulario solicita obligatoriamente:

- Tipo de documento (CC, NIT, CE, Pasaporte).
- Número de documento de identidad.
- Nombre completo o Razón Social.
- Correo electrónico y teléfono de contacto.

---

## 7. 🔄 Post-Pago, Notificaciones y Reembolsos

### Notificación Inmediata por Email (Resend)

- Al confirmarse el estado `paid` vía Webhook, el servidor dispara de forma asíncrona un correo de bienvenida/confirmación al comprador con el resumen de su compra y los pasos a seguir.

### Manejo de Devoluciones y Contracargos

- El endpoint del Webhook debe procesar eventos de reembolso (Orders API: `POST /v1/orders/{id}/refund`) actualizando el estado de la orden a `refunded` (total) o `partially_refunded` (parcial, registrando `refunded_amount` en `order_payments`) para revocar accesos automáticamente o liberar inventario.

---

## 8. 🗄️ Modelado de Base de Datos

> **Fuente canónica ejecutable:** `supabase/schema.sql` (aplica con Supabase CLI). Este esquema es la fuente de verdad para la UI (catálogo), el Server Action (precios) y la reconciliación con Mercado Pago.

### Diagrama de relaciones

```
categories (1) ──── (N) services (1) ──── (N) service_variants (1) ──── (N) orders (1) ──── (N) order_payments
                                   (1) ──── (N) orders                     (1) ──── (N) webhook_logs (independiente)
```

### 8.1 `categories`

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `text PK` | `'canto-ninos'` |
| `label` | `text UNIQUE` | Label EXACTO del filtro: `'Canto para niños'`, `'Canto para jóvenes'`, `'Canto para adultos'`, `'Técnica vocal'`, `'Escena'`, `'Bienestar'`, `'Instrumentos'`, `'Trabajar con Yanetsis'` |
| `position` | `integer` | Orden de aparición en el filtro |
| `is_active` | `boolean` | |

### 8.2 `services`

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `text PK` | `'kids-grupales'` |
| `category_id` | `FK categories` | |
| `micro_title` | `text` | `'Para los más pequeños'` (etiqueta de tarjeta) |
| `title` | `text` | `'Clases Grupales Kids'` |
| `description` | `text` | Descripción de la tarjeta |
| `modality` | `text` | `'Presencial' \| 'Virtual' \| 'Híbrido'` |
| `mode` | `text` | Display: `'Presencial o virtual'` |
| `age` | `text` | `'Niños de 5 a 10 años'` |
| `schedule` | `text` | `'Sábados 8:00 a. m. a 10:00 a. m.'` |
| `intensity_or_duration` | `text` | `'2 horas semanales'` \| `'1 hora por sesión'` |
| `learn_list` | `text[]` | Lista "Aquí aprende" |
| `is_special` | `boolean` | Tarjeta destacada |
| `is_custom_quote` | `boolean` | `true` ⇒ NUNCA crear Order (`coaching-yanetsis`) |
| `note` | `text` | `'Valor desde...'` |
| `mp_category_id` | `text` | `items[].category_id` de MP |
| `is_active` | `boolean` | |

### 8.3 `service_variants`

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `text PK` | `'kids-grupales__mensual'` |
| `service_id` | `FK services` | |
| `label` | `text` | `'Mensual'`, `'Paquete 5'`, `'Clase única'` |
| `price` | `integer` | **COP ENTERO — único origen del precio (regla de oro §1)** |
| `unit` | `text` | `'sesion' \| 'mes' \| 'paquete' \| 'proceso'` |
| `quantity` | `integer` | `5` / `10` (paquetes) |
| `is_recommended` | `boolean` | |
| `tag` | `text` | `'Más elegido para ver progreso real.'` |
| `is_active` | `boolean` | |
| `UNIQUE(service_id, id)` | | |

### 8.4 `orders` (núcleo transaccional)

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `uuid PK` | |
| `external_reference` | `text UNIQUE` | `= orders.id::text` para MP (≤150 chars ✓) |
| `variant_id` | `FK service_variants` | |
| `service_title` / `variant_label` | `text` | **Snapshot** del producto comprado (factura/ops aunque el catálogo cambie) |
| `amount_total` | `integer` | COP entero (precio oficial de BD) |
| `currency` | `text` | `'COP'` |
| `student_*` | | `first_name`, `last_name`, `age`, `notes` (operación academia) |
| `payer_*` | | `email`, `first_name`, `last_name`, `doc_type`, `doc_number`, `phone`, `ip_address` (MP + DIAN) |
| `habeas_data_accepted` + `_at` | | Evidencia legal (Ley 1581) |
| `status` | `order_status` | Mapeo en §5 |
| `expires_at` | `timestamptz` | TTL: reserva de cupo / expiración de la Order |
| `paid_at` / `rejected_at` / `refunded_at` | `timestamptz` | Timestamps de estado |
| `idempotency_key` | `uuid` | `X-Idempotency-Key` por intento de Preferencia |
| `preference_id` | `text` | id de la Preferencia MP (recreada por intento) |
| `mp_order_id` | `text` | `merchant_order_id` de MP (si aplica) |
| `mp_status` / `mp_status_detail` | `text` | Estado crudo del pago (`approved` / `pending` / `rejected` / ...) |
| `mp_payment_method` | `text` | `payment_method_id` del pago (auditoría) |
| `mp_raw` | `jsonb` | Respuesta cruda de MP (auditoría) |

### 8.5 `order_payments`

Una Order puede tener varias transacciones (reintentos, reembolsos). Registra cada `mp_payment_id` (`PAY...`), monto, estado y `refunded_amount`.

### 8.6 `webhook_logs`

Idempotencia de eventos (§2): `event_id UNIQUE`, `topic`, `resource_id`, `payload`, `processed`.

### 8.7 Reglas de acceso (RLS)

**Implementado** en `supabase/schema.sql` (sección 8):

- `ENABLE ROW LEVEL SECURITY` en las 6 tablas.
- **Catálogo** (`categories`, `services`, `service_variants`): política `catalog_select` de solo lectura para `anon`/`authenticated` (la UI consume estos datos vía anon key).
- **`orders`, `order_payments`, `webhook_logs`:** SIN políticas anónimas (contienen PII, §6). Única vía de acceso: `service_role`, que omite RLS.
- **Cliente admin:** `lib/supabase/admin.ts` (`createAdminClient()`) usa `SUPABASE_SERVICE_ROLE_KEY` (solo servidor) → Server Actions de órdenes y Route Handler del webhook. El cliente `lib/supabase/server.ts` (anon) queda para el B2B existente.

### 8.8 Implementado y pendientes

- **Implementado:**
  - Trigger `orders_set_updated_at` (`set_updated_at()`) en `supabase/schema.sql` — auto-actualiza `orders.updated_at` en cada UPDATE.
  - RLS en `supabase/schema.sql` (§8.7) + cliente service-role `lib/supabase/admin.ts` (`SUPABASE_SERVICE_ROLE_KEY` en `.env.local`).
  - **Flujo de pago (Checkout Pro + Payment Brick):** `lib/orders/create-order.ts` (`createOrder` con fix de reintentos + `POST /checkout/preferences`), `components/MpBricks.tsx` (brick con `preferenceId`), webhook `app/api/webhooks/mercadopago/route.ts` (X-Signature + idempotencia + reconciliación).
  - Páginas de resultado `/checkout/success` y `/checkout/failure` (solo lectura, spec §4).
  - Jobs `pg_cron` en `supabase/cron.sql`:
    - `expire-pending-orders` (`*/5 * * * *`): `pending_payment` con `expires_at < now()` → `expired`.
    - `purge-stale-drafts` (`0 3 * * *`): drafts > 48h → **DELETE físico** (PII, Ley 1581).
    - ⚠️ Requiere habilitar `pg_cron` en Supabase (Database → Extensions).
- **Pendiente (futuro, no bloquea):** el modelo no contempla inventario/cupos limitados (la naturaleza del negocio lo permite difícilmente). Si algún día se presentara un evento/taller con cupo, se debe: (a) extender `expire-pending-orders` para liberar el cupo atómicamente, y (b) validar disponibilidad en el Server Action antes de crear la orden (§3).

### 8.9 Credenciales y variables de entorno (Mercado Pago)

Ubicación: `.env.local` (ignorado por git — las claves secretas NUNCA se commitean).

| Variable | Uso | ¿Se expone al cliente? | Formato válido |
| :--- | :--- | :--- | :--- |
| `MP_ACCESS_TOKEN` | Backend → `POST /checkout/preferences` y `GET /v1/payments/{id}` (webhook) | ❌ Solo servidor | `APP_USR-...` (producción) / `TEST-...` (pruebas) |
| `MP_WEBHOOK_SECRET` | Backend → verificación de firma del webhook (§2) | ❌ Solo servidor | cadena secreta de MP |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | Frontend → inicializar SDK de Bricks (`MpBricks.tsx`) | ✅ Pública por diseño | `APP_USR-...` (producción) / `TESTUSER...` (pruebas) |
| `NEXT_PUBLIC_APP_URL` | Backend → construir `back_urls` y `notification_url` de la preferencia. **Debe ser HTTPS** (`auto_return` exige back_urls públicos HTTPS; en local usar túnel ngrok) | ⚠️ Pública (sin secretos) | `https://...` (dominio o túnel) |

**Reglas de oro:**
- Las 3 credenciales deben pertenecer al **mismo entorno** (producción o pruebas). Mezclar `APP_USR-...` (access token de producción) con una public key `TESTUSER...` (pruebas) rompe la inicialización de Bricks.
- `MP_ACCESS_TOKEN` y `MP_WEBHOOK_SECRET` solo se leen desde el servidor (Server Actions / Route Handlers / scripts). `NEXT_PUBLIC_MP_PUBLIC_KEY` viaja al navegador (necesaria para el SDK).
- La **Public Key NO es el Access Token ni el Webhook Secret**: son 3 valores distintos de "Credenciales" en el panel de Mercado Pago.
- Validación: una public key no funciona como Bearer en la REST API (responde `400 invalid_token` en `identification_types`) — eso es normal; su validación real ocurre client-side al inicializar Bricks. Señal de entorno correcto: en pruebas los pagos creados no mueven dinero real y el panel muestra el modo TEST.

### 8.10 Vista `v_students_paid` (estudiantes que pagaron)

En `supabase/schema.sql` (§8b) y migración `supabase/migration_v_students_paid.sql`.

Presenta a los estudiantes con **pago confirmado** (`status = 'paid'`) junto con el detalle del servicio adquirido. Los datos viven en `orders` (snapshot inmutable §8.4); la vista solo los proyecta.

| Columna | Fuente |
| :--- | :--- |
| `order_id` | `orders.id` |
| `student_first_name` / `student_last_name` / `student_age` / `student_notes` | Bloque estudiante (§8.4) |
| `service_title` / `variant_label` | Snapshot del producto |
| `amount_total` / `currency` | Precio oficial al momento de compra |
| `payer_email` / `payer_*` | Pagador / facturación |
| `preference_id` / `mp_order_id` / `mp_payment_method` / `mp_status_detail` | Datos de Mercado Pago |
| `paid_at` / `created_at` | Timestamps |

**Acceso:** solo `service_role` (contiene PII, §6). Sin políticas para `anon`.

**Nota de reconciliación:** la vista localiza las órdenes por `external_reference == orders.id` (que MP conserva del preference flow). El pago de MP llega como `payment` con `external_reference`; el webhook lo cruza contra la vista/orden y valida el monto antes de marcar `paid`.

### 8.11 Brand Brick (banner de marca / confianza) — RETIRADO

Referencia: `docs/MPBrand.md` (extractos crudos de la doc oficial).

**Estado (2026-08):** **NO disponible en esta cuenta/región.** El SDK respondió *"Bricks Brand Brick: Brick not enabled in your site. Coming soon..."* al intentar crearlo. Se **eliminó** del checkout (`components/MpBrandBrick.tsx` y su uso en `CheckoutForm.tsx`) porque no aporta y ensucia la consola con errores.

Si algún día MP lo habilite en la cuenta, la integración es simple (resumen de la doc que quedó en `docs/MPBrand.md`):
- No necesita `initialization` ni credenciales nuevas: solo `NEXT_PUBLIC_MP_PUBLIC_KEY`.
- Creación: `mp.bricks().create("brand", "brand-brick-container", { customization, callbacks })`. Único callback: `onReady`.
- `valueProp`: `payment_methods` (default), `payment_methods_logos`, `installments`, `security`, `credits`.
- `customization.paymentMethods`: `excludedPaymentMethods`, `excludedPaymentTypes`, `maxInstallments`, `interestFreeInstallments`.
- `customization.visual`: `backgroundColor`, `border`/`borderColor`/`borderWidth`/`borderRadius`, `verticalPadding`/`horizontalPadding` (máx 40px), `hideMercadoPagoLogo`, `contentAlign`.
- `customization.text`: `valueProp`, `align`, `useCustomFont`, `size`, `fontWeight`, `color`.

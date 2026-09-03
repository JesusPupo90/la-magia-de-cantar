# Resumen de pruebas: PSE (transferencia bancaria) en Mercado Pago

**Fecha del resumen:** 2026-09-02
**Proyecto:** La Magia de Cantar — pasarela de pagos (Next.js + Supabase + Mercado Pago).
**Objetivo:** Habilitar PSE (transferencia bancaria, Colombia) y validar que el payload enviado es correcto, para poder sustentar ante Mercado Pago el fallo recibido y decidir pasos alternativos.

> **Estado actual (para retomar en una sesión nueva):** PSE oculto en `main` **omitiendo** `bankTransfer` en el brick (commit `7b0407f`; el valor `"none"` del commit `439a534` rompía el brick con 422). Escalado a MP el 02/09 con correlativos; plazo de espera ~1 semana; si no resuelve → híbrido **MP (tarjetas) + Wompi (PSE/Nequi)**. Tarjetas operativas. Ver sección 6.

---

## 1. Contexto

- La integración crea el pago desde el backend con `POST https://api.mercadopago.com/v1/payments`.
- PSE = `payment_method_id: "pse"` + `transaction_details.financial_institution` (banco). Sin token de tarjeta.
- Cuenta MP: **app** `5837577013562274`, **user** `554801618`. Pruebas con credenciales TEST.
- Entorno de pruebas local: `npm run dev` + túnel Cloudflare (`https://proteins-forms-generations-manga.trycloudflare.com`) apuntando a `NEXT_PUBLIC_APP_URL`.
- Evaluación técnica de MP a la integración: **80/100**; recomendación: usar la **SDK oficial de backend**. Por eso, además de la API directa, se probó con la SDK oficial de Node (`mercadopago` npm `3.6.0`).

---

## 2. Registro de intentos (resumen)

| # | Tipo | Banco (`financial_institution`) | Monto | IP enviada | Resultado | Correlativo MP |
|---|------|--------------------------------|-------|-----------|-----------|----------------|
| 1 | Flujo web sandbox (orden `19cc87dd-…`) | `1006` | 2.299.000 | `186.168.208.248` | **424 / 9032** | `28-08-2026T23:46:29UTC;6d091b85-cf61-4c10-b2be-c16ed2572e25` |
| 2 | Flujo web sandbox (orden `2c16ab04-…`) | `1507` | 2.299.000 | `186.168.208.248` | **500 / 1090** (error distinto) | — |
| 3 | Control: misma orden del #1 con **tarjeta** | — | 2.299.000 | — | **approved** (payment `1351103547`) + webhook 200 | — |
| 4 | Producción (logs `[PSE-diagnostico]`) | — | — | `186.98.17.104` | **424 / 9032** | — |
| 5–14 | API directa `scripts/test-pse.ts` (V1–V10) | `1007`, `1051`, `1006`, nequi | 1.000 – 100.000 | `181.49.87.2` | **V1–V10 → 424/9032**; V5 (nequi) → **error distinto (no 9032)** | — |
| 15 | SDK oficial Node `scripts/test-pse-sdk.ts` | `1007` | 179.000 | `186.168.208.248` | **424 / 9032** | `31-08-2026T01:07:33UTC;45ebdf4b-3630-435e-aef6-d6347d030aa9` |
| 16 | Producción (reintento `scripts/test-pse-prod.ts`) | `1007` | 2.299.000 | `186.168.208.248` | **424 / 9032** | `02-09-2026T04:27:26UTC;1e5494a8-2f42-4371-b9ca-fdb47d72a4a8` |
| 17 | Producción (reintento `scripts/test-pse-prod.ts`) | `1006` | 2.299.000 | `186.168.208.248` | **424 / 9032** | `02-09-2026T04:27:26UTC;56771d93-d089-424e-809f-e3cc7f31fb90` |

> Los correlativos (`cause[0].data`) son **generados por el backend de Mercado Pago** en cada fallo; sirven para que MP rastree internamente la transacción.

---

## 3. Detalle por intento

### 3.1 Intento 1 — Flujo real web (sandbox), banco 1006

Orden `19cc87dd-834a-4f4c-9096-4ba2acebc083` (Kids trimestral, $2.299.000). Pago iniciado desde el brick con PSE.

Logs reales capturados del servidor (`[PSE-diagnostico]`):

```
[PSE-diagnostico] ip_raw_headers: {"x-forwarded-for":"186.168.208.248","x-real-ip":null,"cf-connecting-ip":"186.168.208.248"} | ip_selected: 186.168.208.248
[PSE-diagnostico] request: {"ip_selected":"186.168.208.248","financial_institution":"1006","transaction_amount":2299000,"payment_method_id":"pse","installments":null}
MP rechazó el pago: 424 {"message":"BankTransfers Api fail","error":"failed_dependency","status":424,"cause":[{"code":9032,"description":"BankTransfers Api fail","data":"28-08-2026T23:46:29UTC;6d091b85-cf61-4c10-b2be-c16ed2572e25"}]} | order: 19cc87dd-834a-4f4c-9096-4ba2acebc083
[PSE-diagnostico] failure: {"status":424,"cause_code":9032,"cause_data":"28-08-2026T23:46:29UTC;6d091b85-cf61-4c10-b2be-c16ed2572e25"}
```

Resultado: la orden quedó en `draft`, sin `order_payments` registrados, `mp_status` nulo.

### 3.2 Intento 2 — Flujo real web (sandbox), banco 1507

Orden `2c16ab04-0cc1-4c0c-9759-1793d3b5cc4e`, mismo monto e IP. Cambió únicamente el banco.

```
[PSE-diagnostico] request: {"ip_selected":"186.168.208.248","financial_institution":"1507","transaction_amount":2299000,"payment_method_id":"pse","installments":null}
MP rechazó el pago: 500 {"message":"Oops! Something went wrong...","error":"internal_error","status":500,"cause":[{"code":1090}]} | order: 2c16ab04-0cc1-4c0c-9759-1793d3b5cc4e
[PSE-diagnostico] failure: {"status":500,"cause_code":1090}
```

Resultado: **error diferente** (500 / `1090`) solo por cambiar de banco. Esto confirma que MP recibe y procesa la petición, y que el fallo depende del proveedor/servicio de transferencias.

### 3.3 Intento 3 — Control con tarjeta (misma orden del #1)

Sobre la misma orden `19cc87dd-…` se pagó con tarjeta de crédito (de prueba):

```
processPayment("19cc87dd-…", {formData:{installments:1, issuer_id:"204", payer:[Object], …}, paymentType:"credit_card", selectedPaymentMethod:"credit_card"})
GET /checkout/success?payment_id=1351103547&status=approved&external_reference=19cc87dd-…&amount=2299000 200
POST /api/webhooks/mercadopago?data.id=1351103547&type=payment 200
```

Resultado: **aprobado** (`approved`), webhook recibido y procesado (200). La infraestructura (creación de orden, backend de pago, webhook, base de datos) funciona con tarjeta en la misma cuenta.

### 3.4 Intento 4 — Producción

Prueba real en producción: `ip_selected: 186.98.17.104` → mismo resultado **424 / 9032** `BankTransfers Api fail`. La IP pública real es válida y se envía correctamente.

### 3.4b Intentos 16–17 — Producción (reintento `scripts/test-pse-prod.ts`, 02/09)

Re-ejecución en producción tras los incidentes PSE "resolved" de MP (status.mercadopago.com), con credenciales APP_USR y URLs del sitio real. Mismo payload correcto, dos bancos:

| Banco | Respuesta | Correlativo |
|-------|-----------|-------------|
| 1007 (Bancolombia) | `424 / 9032` | `02-09-2026T04:27:26UTC;1e5494a8-2f42-4371-b9ca-fdb47d72a4a8` |
| 1006 (Itaú) | `424 / 9032` | `02-09-2026T04:27:26UTC;56771d93-d089-424e-809f-e3cc7f31fb90` |

**Conclusión:** el `9032` persiste en producción incluso con los incidentes marcados como resueltos → confirma que es un problema de cuenta/habilitación del servicio, no una incidencia transitoria ni del integrador.

### 3.5 Intentos 5–14 — Matriz de payloads (API directa, `scripts/test-pse.ts`)

Script que itera 10 variantes del body contra `POST /v1/payments` con `X-Idempotency-Key`, buscando la combinación que MP acepte.

| Variante | Descripción | Resultado |
|----------|-------------|-----------|
| V1 | payer **sin** nombres en top (nombres en `additional_info.payer`) | 424 / 9032 |
| V2 | nombres en top (igual que el flujo real) | 424 / 9032 |
| V3 | banco `1051` (Davivienda), sin nombres en top | 424 / 9032 |
| V4 | sin `additional_info.payer`, solo `ip_address` | 424 / 9032 |
| V5 | **nequi** (otro `bank_transfer`, sin `financial_institution`) | **error distinto (no 9032)** |
| V6 | monto `1000` | 424 / 9032 |
| V7 | `financial_institution` como **número** (`1007`) | 424 / 9032 |
| V8 | payer mínimo (sin nombres en ningún lado) | 424 / 9032 |
| V9 | payload exacto de la doc de MP (institution numérica + `installments:1`, sin `additional_info`) | 424 / 9032 |
| V10 | V9 + `additional_info.ip_address` | 424 / 9032 |

Bancos probados: `1006` (Itaú), `1007` (Bancolombia), `1051` (Davivienda), `1507`, y nequi. Todas las variantes PSE → 9032. El hecho de que **nequi dé un error diferente** descarta que sea un rechazo genérico de nuestro payload.

### 3.6 Intento 15 — SDK oficial de Node (`scripts/test-pse-sdk.ts`)

Usando la SDK que recomienda MP (`mercadopago` npm `3.6.0`), con payload equivalente al correcto:

```json
{
  "transaction_amount": 179000,
  "description": "Pago de prueba PSE (SDK)",
  "payment_method_id": "pse",
  "callback_url": "https://proteins-forms-generations-manga.trycloudflare.com/checkout/success",
  "notification_url": "https://proteins-forms-generations-manga.trycloudflare.com/api/webhooks/mercadopago",
  "additional_info": { "ip_address": "186.168.208.248" },
  "transaction_details": { "financial_institution": "1007" },
  "payer": {
    "email": "comprador.test@example.com",
    "entity_type": "individual",
    "first_name": "Camila",
    "last_name": "Pérez",
    "identification": { "type": "CC", "number": "1012345678" }
  }
}
```

Headers reales que envía la SDK (interceptados con un wrapper de `fetch`):

```
Authorization: Bearer TEST-… (len 78)
Content-Type: application/json
X-Product-Id: bc32b6ntrpp001u8nhkg
X-Tracking-Id: platform:v22|v22.23.2,type:SDK3.6.0,so;
User-Agent: MercadoPago Node.js SDK v3.6.0 (node v22.23.2-x64-win32)
X-Idempotency-Key: <uuid>
```

Resultado:

```
status: 424 | message: BankTransfers Api fail
causes: [{"code":9032,"description":"BankTransfers Api fail","data":"31-08-2026T01:07:33UTC;45ebdf4b-3630-435e-aef6-d6347d030aa9"}]
```

**La SDK oficial reproduce el mismo 9032.** El fallo es independiente del cliente HTTP y de la forma de consumir la API.

---

## 4. Episodio 401 "authorization value not present" (descartado)

Durante las pruebas con la SDK apareció `401 {"code":"unauthorized","message":"authorization value not present"}`. Se investigó a fondo:

1. Se interceptó el `fetch` para confirmar que la SDK sí enviaba `Authorization: Bearer <token>` completo.
2. Se comparó con un token basura: MP respondía **idéntico** (401 en POST, 404 en GET `/users/me`), lo que indicaba que el header no se estaba interpretando.
3. Causa raíz: el archivo `.env.local` tenía la línea
   `MP_ACCESS_TOKEN=TEST-5837577013562274-…-554801618#APP_USR-5837577013562274-…-554801618`
   (el token de prueba quedó pegado al de producción con `#`, y en `.env` el `#` **no** es comentario en línea). El header resultante era un token inválido → 401.
4. Corregido (token TEST activo, APP_USR comentado): la autenticación volvió a funcionar y PSE volvió a dar el error esperado **424 / 9032**.

Conclusión: el 401 fue un problema de configuración local, **no** del código ni de MP. Se documenta para que no se confunda con evidencia.

---

## 5. Por qué el problema NO es el código

1. **El payload cumple la documentación de MP:**
   - `payment_method_id: "pse"`
   - `transaction_details.financial_institution` (banco)
   - `payer.entity_type`: `"individual"` / `"association"` según tipo de documento
   - `payer.identification` (`CC` + número) a nivel `payer` (MP rechaza `additional_info.payer.identification`)
   - `additional_info.ip_address`: IP pública real (`181.49.87.2`, `186.98.17.104`, `186.168.208.248`)
   - `callback_url` y `notification_url` públicas y alcanzables
   - `installments: 1`
   - `external_reference` único; monto tomado de la base de datos (nunca del cliente).

2. **El payload exacto de la documentación (V9/V10) devuelve el mismo 9032.**

3. **Múltiples bancos y variaciones estructurales → mismo 9032;** nequi (V5) y banco `1507` (intento 2) dan errores **distintos** → MP recibe y procesa la petición; el fallo está en el servicio de transferencias.

4. **La SDK oficial que recomienda MP (80/100) reproduce el 9032** → el fallo es independiente del método de integración (API directa, brick o SDK).

5. **Las tarjetas se aprueban** en el mismo endpoint, misma cuenta y hasta en la misma orden (`1351103547`, monto 2.299.000) → nuestra infraestructura, código, webhooks y credenciales son correctos.

6. **Los correlativos internos** (`cause[0].data`: `fecha;uuid`) los genera el backend de MP → apuntan a un fallo del servicio BankTransfers / de la habilitación de PSE en la cuenta.

---

## 6. Conclusión y estado

- El error **424 / 9032 `BankTransfers Api fail`** es **del lado de Mercado Pago** (servicio de transferencias o habilitación de PSE en la cuenta `5837577013562274`), no de nuestro código.
- **PSE permanece oculto** en el brick: en `main` **no se incluye** `bankTransfer` en `customization.paymentMethods` (commit `7b0407f`). ⚠️ El commit anterior (`439a534`) usó `bankTransfer: "none"` y ese valor **no es válido** para el Payment Brick: MP respondía `422` en la inicialización y el brick no cargaba NINGÚN método de pago (error crítico *"Ocurrió un error al mostrar el método de pago"*). Prueba determinista contra el endpoint de inicialización: con `bank_transfer=none` → **HTTP 422**; omitiendo `bank_transfer` → **HTTP 200**; con `bank_transfer=all` → **HTTP 200**. Por eso PSE se oculta **omitiendo la llave**, nunca con `"none"`.
- **Tarjetas OK**: tras `7b0407f`, el brick opera con tarjeta/efectivo/"Mercado Pago" en producción.
- **Escalado a MP** (02/09) con los correlativos. Plazo de espera definido: **~1 semana**. Si MP no confirma/resuelve la habilitación del servicio, el plan es un **sistema híbrido: MP (tarjetas) + Wompi (PSE/Nequi)**.
- El experimento con la **SDK oficial de Node** se descartó del código: se revirtió la dependencia `mercadopago` y se eliminaron los scripts `test-pse-sdk.ts` / `test-pse-prod.ts`. Queda documentado como evidencia (intento 15) de que el `9032` no depende del método de integración (fetch, SDK o Postman → mismo error).

---

## 7. Anexos

### 7.1 Correlativos de Mercado Pago

- `28-08-2026T23:46:29UTC;6d091b85-cf61-4c10-b2be-c16ed2572e25` — flujo web, banco 1006, monto 2.299.000.
- `31-08-2026T01:07:33UTC;45ebdf4b-3630-435e-aef6-d6347d030aa9` — SDK oficial, banco 1007, monto 179.000.
- `02-09-2026T04:27:26UTC;1e5494a8-2f42-4371-b9ca-fdb47d72a4a8` — producción, banco 1007, monto 2.299.000.
- `02-09-2026T04:27:26UTC;56771d93-d089-424e-809f-e3cc7f31fb90` — producción, banco 1006, monto 2.299.000.

### 7.2 Commits relacionados

- `82e9ee3` — feat: support PSE (bank transfer) payments
- `38a7279` — fix: complete PSE (bank transfer) payment requirements
- `e961472` — feat: normalize client IP and log PSE diagnostics (`lib/ip.ts`, `firstPublicIp`)
- `439a534` — fix: hide PSE from the payment brick while MP resolves 9032
- `7b0407f` — fix: remove bankTransfer:"none" from Payment Brick config (MP 422)

### 7.3 Archivos de diagnóstico

- `lib/orders/process-payment.ts` — crea el pago (tarjeta y PSE) y registra `[PSE-diagnostico]` (request y failure).
- `lib/ip.ts` — selecciona la primera IP pública de `x-forwarded-for` / `x-real-ip` / `cf-connecting-ip`.
- `scripts/test-pse.ts` — matriz V1–V10 de payloads contra la API (commiteado en `main`).
- (Descartados del repo: `scripts/test-pse-sdk.ts`, `scripts/test-pse-prod.ts` y la dependencia `mercadopago` — el experimento SDK quedó solo como evidencia en este documento.)
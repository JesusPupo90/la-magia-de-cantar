# La Magia de Cantar — Web Platform for Yanetsis

> The official website I developed for **Yanetsis** and her vocal school in Bogotá, Colombia.
> A complete platform that sells her courses online, collects payments automatically, captures B2B leads, offers a free AI voice assessment, and builds her authority as a TV vocal coach.

| Stack | Technologies |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 |
| Styling | Tailwind CSS v4 · TypeScript |
| Backend | Supabase (Postgres, RLS, cron) |
| Payments | Mercado Pago Colombia (cards, cash, wallet) |
| AI | Anthropic Claude (voice verdict) |
| Email | Resend |
| Analytics | Meta Pixel · GTM/GA4 · Microsoft Clarity · Vercel Analytics |

---

## English

Hi 👋 — I'm the developer who built this site. Below you'll find the human story behind it (and the business problems it solves), followed by the full technical documentation for anyone who wants to work on the repository.

### The story behind the site

I built this website for **Yanetsis**, a vocal coach from Bogotá whose classes go far beyond technique: they bring together the voice, the body, the emotion and the stage — the approach she calls her method. She has coached artists on Colombian TV (think *La Voz Kids*, *Yo Me Llamo*), and now she wanted a website that would reflect that authority and, honestly, stop running her business through WhatsApp messages.

So the real product is not "a website about singing courses". The product is **a business that sells and collects on its own**, and this site is the engine.

### What the site solves for her (and her team)

**Before:** prices and plans lived in chats. Every "How much?" and "What's included?" was answered by hand. Payments were chased. Company leads arrived scattered. Nobody was sure who had paid.

**After — the site does all of that automatically:**

- **It sells 24/7.** The catalog (kids, teens, adults, vocal technique, stage, instruments, working with Yanetsis) is always online, with plans and prices that her team updates from a control panel — no code changes needed.
- **It collects and confirms payments automatically.** Customers pay with cards, cash or digital wallets (Nequi/Daviplata via the Mercado Pago wallet, plus back-end PSE support). Confirmation emails go out on their own.
- **It frees the team from repetitive work.** The FAQ page answers the common questions, checkout walks students through everything, receipts are sent automatically, and nobody has to verify payments by hand.
- **It turns company inquiries into organized leads.** Companies fill a quote form and her team receives a clean, de-duplicated request by email — done.
- **It attracts new students for free.** The voice test (`/prueba-de-voz`) records 10 seconds from any device, gives a personalized verdict in Yanetsis' voice style, and opens a WhatsApp chat with the message already written.
- **It builds authority.** Testimonials from real artists she has accompanied, animated impact stats, and her TV track record — presented with taste, no fluff.
- **It protects her money.** Prices never come from the browser; the server reads them from the database and verifies every payment received before marking an order as paid.
- **It respects the law without effort.** Privacy policy, personal-data processing (Colombia's Habeas Data — Ley 1581), payment policy and terms, plus a cookie-consent layer that only loads trackers when visitors accept.
- **It shows what works.** Privacy-respecting analytics (only after consent) so she knows which efforts convert.

### If you're reading this as a potential client

If your business has the same pain — manual sales, chasing payments, scattered leads, no presence — that's exactly the kind of problem I like to take on. **Let's talk.**

### Technical documentation (for developers)

#### Stack

- **Next.js 16** (App Router) with server components, server actions and route handlers.
- **React 19**, TypeScript (strict), Tailwind CSS v4 (design system **"Pop Minimal Elegante & Vibrant"**).
- **Supabase** (Postgres) as the single source of truth: catalog + orders + payments + webhook logs, with RLS enabled.
- **Mercado Pago** for payments (preferences → Payment Brick → v1 payments API → signed webhooks).
- **Anthropic Claude** for the AI voice verdict, **Resend** for transactional email, **lucide-react** for icons.

#### Project structure

```
app/            Routes, pages and API routes (App Router)
  api/veredicto/            POST — AI voice assessment (Anthropic)
  api/webhooks/mercadopago/ POST — payment webhook (signed, idempotent)
  checkout/                  Payment pages (order, success, failure)
  prueba-de-voz/             Free AI voice test
  politica-*, terminos, etc. Legal pages
components/     React components (checkout form, promos, sections, trackers)
data/           Typed catalog layer that talks to Supabase
lib/            Supabase clients, payments, orders, email, schemas, meta
scripts/        Test harnesses (create order, PSE, emails, webhook)
supabase/       schema.sql, migrations, cron jobs (expire pending orders)
docs/           PRD (spec.md), design system (design.md), payment specs
```

#### Pages and routes

| Route | Purpose |
|---|---|
| `/` | Home: hero → achievements → method → services → B2B → testimonials |
| `/checkout?service=&variant=` | Pay for a service (price resolved server-side) |
| `/checkout/success` / `/checkout/failure` | Payment results (read-only) |
| `/prueba-de-voz` | Free AI voice test |
| `/preguntas-frecuentes` | FAQ |
| `/politica-de-pagos`, `/politica-de-privacidad`, `/terminos-y-condiciones`, `/tratamiento-de-datos` | Legal pages |
| `POST /api/veredicto` | AI voice assessment |
| `POST /api/webhooks/mercadopago` | Payment webhook |

#### Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your values — see variables below
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

> `next.config.ts` allows LAN dev (`192.168.x.x`) and a Cloudflare tunnel origin (`*.trycloudflare.com`) for testing payments on mobile.

#### Environment variables

A `.env.example` is committed at the repo root — copy it to `.env.local` and fill in the values. Optional keys can stay blank.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_MP_PUBLIC_KEY=
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_NOTIFICATION_EMAIL=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

| Variable | Scope |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public |
| `SUPABASE_SERVICE_ROLE_KEY` | server |
| `NEXT_PUBLIC_APP_URL` | public (must be HTTPS) |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | public |
| `MP_ACCESS_TOKEN` | server |
| `MP_WEBHOOK_SECRET` | server |
| `ANTHROPIC_API_KEY` | server (optional — falls back to local verdict) |
| `RESEND_API_KEY` | server (optional — emails skip gracefully) |
| `RESEND_FROM_EMAIL` | server |
| `CONTACT_NOTIFICATION_EMAIL` | server |
| `NEXT_PUBLIC_META_PIXEL_ID` | public (optional) |
| `NEXT_PUBLIC_GTM_ID` | public (optional) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | public (optional) |

> For a quick start: `cp .env.example .env.local` and fill in the values.

#### Architecture highlights

- **The server is the price authority.** The checkout sends only `service_id` and `variant_id`; prices always come from Supabase. Order amounts are never trusted from the client.
- **Secure checkout.** zod-validated order form (Habeas Data consent required), honeypot anti-spam, order TTL (30 min), and a guard that prevents double billing while a payment is pending.
- **Signed, idempotent webhook.** Mercado Pago's `X-Signature` is verified with HMAC-SHA256 + `timingSafeEqual`; events are de-duplicated via `webhook_logs`; amounts are reconciled against the database (mismatch on paid → manual review, no status change). Always responds 200 and never causes a painful retry experience.
- **Consent-gated tracking.** Meta Pixel, GTM and Clarity only boot after the cookie notice is accepted; rejects load none.
- **Graceful degradation.** No `ANTHROPIC_API_KEY` → the AI route returns a fallback and the client renders a local Yanetsis-voice verdict. No `RESEND_API_KEY` → send functions no-op with a warning. Payments, by design, **fail closed**.
- **Async email delivery.** Confirmation emails are fire-and-forget and sent at most once per order (atomic claim).
- **Privacy by design.** The voice test processes audio entirely in the browser — nothing leaves the device. AI requests send hashed, non-PII identifiers only.

---

## Español

Hola 👋 — soy el desarrollador que construyó este sitio. Aquí encontrarás la historia humana detrás del proyecto (y los problemas de negocio que resuelve), seguida de toda la documentación técnica para quien quiera trabajar sobre el repositorio.

### La historia detrás del sitio

Construí este sitio web para **Yanetsis**, una coach vocal de Bogotá cuyas clases van mucho más allá de la técnica: unen la voz, el cuerpo, la emoción y el escenario — el enfoque que ella llama su método. Ha entrenado artistas en la televisión colombiana (piensa en *La Voz Kids*, *Yo Me Llamo*), y ahora quería un sitio que reflejara esa autoridad y, siendo honestos, que dejara de manejar su negocio a punta de mensajes de WhatsApp.

Así que el producto real no es "un sitio sobre clases de canto". El producto es **un negocio que vende y cobra por sí solo**, y este sitio es su motor.

### Lo que el sitio le resuelve a ella (y a su equipo)

**Antes:** precios y planes vivían en los chats. Cada "¿cuánto vale?" y "¿qué incluye?" se respondía a mano. Se perseguían los pagos. Los leads de empresas llegaban dispersos. Nadie estaba seguro de quién había pagado.

**Después — el sitio hace todo eso automáticamente:**

- **Vende 24/7.** El catálogo (niños, jóvenes, adultos, técnica vocal, escena, instrumentos y trabajar con Yanetsis) está siempre en línea, con planes y precios que su equipo actualiza desde un panel — sin tocar código.
- **Cobra y confirma pagos automáticamente.** El cliente paga con tarjeta, efectivo o billeteras digitales (Nequi/Daviplata vía la wallet de Mercado Pago, más soporte PSE en el backend). Los correos de confirmación salen solos.
- **Libera al equipo de tareas repetitivas.** La página de preguntas frecuentes responde lo común, el checkout guía al alumno, los recibos se envían solos y nadie tiene que verificar pagos a mano.
- **Convierte las consultas de empresas en leads organizados.** Las empresas llenan un formulario de cotización y su equipo recibe la solicitud ordenada y sin duplicados por correo — y listo.
- **Atrae alumnos nuevos gratis.** La prueba de voz (`/prueba-de-voz`) graba 10 segundos desde cualquier dispositivo, da un veredicto personalizado en el estilo de voz de Yanetsis y abre un chat de WhatsApp con el mensaje ya escrito.
- **Construye autoridad.** Testimonios de artistas reales que ya ha acompañado, cifras de impacto animadas y su trayectoria en TV — presentados con gusto, sin exagerar.
- **Protege su dinero.** Los precios nunca vienen del navegador; el servidor los lee desde la base de datos y verifica cada pago recibido antes de marcar una orden como pagada.
- **Cumple la ley sin esfuerzo.** Política de privacidad, tratamiento de datos personales (Habeas Data — Ley 1581), política de pagos y términos, más una capa de cookies que solo carga los rastreadores si el visitante acepta.
- **Muestra qué funciona.** Analítica respetuosa de la privacidad (solo con consentimiento) para que ella sepa qué esfuerzos convierten.

### Si lees esto como posible cliente

Si tu negocio tiene el mismo dolor — ventas manuales, tener que perseguir pagos, leads dispersos, falta de presencia — ese es exactamente el tipo de problema que me gusta asumir. **Hablemos.**

### Documentación técnica (para desarrolladores)

#### Stack

- **Next.js 16** (App Router) con server components, server actions y route handlers.
- **React 19**, TypeScript (estricto), Tailwind CSS v4 (sistema de diseño **"Pop Minimal Elegante & Vibrant"**).
- **Supabase** (Postgres) como única fuente de verdad: catálogo + órdenes + pagos + logs de webhook, con RLS activado.
- **Mercado Pago** para pagos (preferences → Payment Brick → API v1 → webhooks firmados).
- **Anthropic Claude** para el veredicto de voz con IA, **Resend** para el correo transaccional, **lucide-react** para los iconos.

#### Estructura del proyecto

```
app/            Rutas, páginas y API routes (App Router)
  api/veredicto/            POST — prueba de voz IA (Anthropic)
  api/webhooks/mercadopago/ POST — webhook de pagos (firmado, idempotente)
  checkout/                  Páginas de pago (orden, éxito, fallo)
  prueba-de-voz/             Prueba de voz IA gratis
  politica-*, terminos, etc. Páginas legales
components/     Componentes React (formulario de checkout, promos, secciones, trackers)
data/           Capa de catálogo tipada que habla con Supabase
lib/            Clientes Supabase, pagos, órdenes, email, schemas, meta
scripts/        Harness de pruebas (crear orden, PSE, correos, webhook)
supabase/       schema.sql, migraciones, cron (expirar órdenes pendientes)
docs/           PRD (spec.md), sistema de diseño (design.md), specs de pagos
```

#### Páginas y rutas

| Ruta | Propósito |
|---|---|
| `/` | Inicio: hero → cifras → método → servicios → B2B → testimonios |
| `/checkout?service=&variant=` | Pagar un servicio (el precio se resuelve en el servidor) |
| `/checkout/success` / `/checkout/failure` | Resultados del pago (solo lectura) |
| `/prueba-de-voz` | Prueba de voz IA gratis |
| `/preguntas-frecuentes` | FAQ |
| `/politica-de-pagos`, `/politica-de-privacidad`, `/terminos-y-condiciones`, `/tratamiento-de-datos` | Páginas legales |
| `POST /api/veredicto` | Prueba de voz IA |
| `POST /api/webhooks/mercadopago` | Webhook de pagos |

#### Primeros pasos

```bash
npm install
cp .env.example .env.local   # luego completa tus valores — ver variables abajo
npm run dev                  # http://localhost:3000
```

Otros scripts: `npm run build`, `npm run start`, `npm run lint`.

> `next.config.ts` permite dev en red local (`192.168.x.x`) y un origen de túnel Cloudflare (`*.trycloudflare.com`) para probar pagos en móvil.

#### Variables de entorno

Hay un `.env.example` commiteado en la raíz del repo — cópialo a `.env.local` y completa los valores. Las claves opcionales pueden dejarse vacías.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_MP_PUBLIC_KEY=
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_NOTIFICATION_EMAIL=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

| Variable | Alcance |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | público |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | público |
| `SUPABASE_SERVICE_ROLE_KEY` | servidor |
| `NEXT_PUBLIC_APP_URL` | público (debe ser HTTPS) |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | público |
| `MP_ACCESS_TOKEN` | servidor |
| `MP_WEBHOOK_SECRET` | servidor |
| `ANTHROPIC_API_KEY` | servidor (opcional — cae a veredicto local) |
| `RESEND_API_KEY` | servidor (opcional — los correos se omiten con gracia) |
| `RESEND_FROM_EMAIL` | servidor |
| `CONTACT_NOTIFICATION_EMAIL` | servidor |
| `NEXT_PUBLIC_META_PIXEL_ID` | público (opcional) |
| `NEXT_PUBLIC_GTM_ID` | público (opcional) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | público (opcional) |

> Para arrancar rápido: `cp .env.example .env.local` y completa los valores.

#### Aspectos destacados de la arquitectura

- **El servidor es la autoridad del precio.** El checkout envía solo `service_id` y `variant_id`; los precios siempre vienen de Supabase. Los montos nunca se confían del cliente.
- **Checkout seguro.** Formulario validado con zod (consentimiento Habeas Data obligatorio), honeypot antispam, TTL de la orden (30 min) y un guard que previene el doble cobro mientras hay un pago pendiente.
- **Webhook firmado e idempotente.** La `X-Signature` de Mercado Pago se verifica con HMAC-SHA256 + `timingSafeEqual`; los eventos se deduplican vía `webhook_logs`; los montos se concilian contra la base de datos (si hay diferencia en un pago "aprobado" → revisión manual, sin cambio de estado). Siempre responde 200 y nunca provoca una experiencia de reintento dolorosa.
- **Tracking con consentimiento.** Meta Pixel, GTM y Clarity solo arrancan después de que el aviso de cookies sea aceptado; si se rechaza, no se carga ninguno.
- **Degradación elegante.** Sin `ANTHROPIC_API_KEY` → la ruta IA devuelve un fallback y el cliente renderiza un veredicto local con la voz de Yanetsis. Sin `RESEND_API_KEY` → los envíos hacen no-op con un aviso. Los pagos, por diseño, **fallan cerrado**.
- **Correos asíncronos.** Los correos de confirmación son fire-and-forget y se envían como máximo una vez por orden (reclamo atómico).
- **Privacidad por diseño.** La prueba de voz procesa el audio íntegramente en el navegador — nada sale del dispositivo. Los pedidos de IA envían solo identificadores con hash, sin datos personales.

---

## Contributing / Contribuciones

- Run `npm run lint` and `npm run build` before opening a PR — both must pass. / Corre `npm run lint` y `npm run build` antes de abrir un PR — ambos deben pasar.
- Design language lives in `docs/design.md`; keep the pop-minimal aesthetic. / El lenguaje visual vive en `docs/design.md`; conserva la estética pop minimal.

## Credits / Créditos

Design & development by **WannaDev Studios** — Jesus Pupo. Built for Yanetsis and La Magia de Cantar.
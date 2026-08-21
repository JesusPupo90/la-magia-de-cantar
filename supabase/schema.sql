-- ============================================================================
-- LA MAGIA DE CANTAR — Esquema de Base de Datos (Supabase / PostgreSQL)
-- Pasarela de pagos: Mercado Pago Checkout API (Orders) + Next.js
-- Fuente canónica del modelado documentado en docs/paymentSpecs.md §8
-- ============================================================================

-- ⚠️ CONVENCIONES
--  - Precios SIEMPRE como enteros COP (integer). Nunca floats.
--  - El frontend NUNCA envía montos: solo service_id + variant_id.
--  - external_reference de MP = orders.id (uuid ≤ 150 chars, OK).
--  - order_status NO retrocede desde 'paid'.

-- ============================================================================
-- 1. ENUM
-- ============================================================================

create type public.order_status as enum (
  'draft',             -- Formulario completado, Order creada en MP (intención de pago)
  'pending_payment',   -- Redirigido a la pasarela (esperando aprobación / PSE / Efecty)
  'paid',              -- Transacción aprobada y confirmada por Webhook + reconciliación
  'rejected',          -- Rechazado por el banco o fondos insuficientes
  'expired',           -- Expiró el tiempo límite para completar el pago
  'refunded',          -- Dinero devuelto al cliente (reembolso o contracargo)
  'partially_refunded' -- Reembolso parcial (MP lo soporta)
);

-- ============================================================================
-- 2. CATÁLOGO (fuente de verdad para la UI y para los precios)
-- ============================================================================

create table public.categories (
  id        text primary key,                  -- 'canto-ninos'
  label     text not null unique,              -- Label EXACTO del filtro: 'Canto para niños'
  position  integer not null default 0,
  is_active boolean not null default true
);

create table public.services (
  id                    text primary key,      -- 'kids-grupales'
  category_id           text not null references public.categories(id),
  position              integer not null default 0,  -- Orden de tarjeta dentro de su categoría
  micro_title           text not null,         -- 'Para los más pequeños'
  title                 text not null,         -- 'Clases Grupales Kids'
  description           text not null,
  modality              text not null,         -- 'Presencial' | 'Virtual' | 'Híbrido'
  mode                  text,                  -- Display: 'Presencial o virtual'
  age                   text,                  -- 'Niños de 5 a 10 años'
  schedule              text,                  -- 'Sábados 8:00 a. m. a 10:00 a. m.'
  intensity_or_duration text,                  -- '2 horas semanales' | '1 hora por sesión'
  learn_list            text[] not null default '{}',
  is_special            boolean not null default false,
  is_custom_quote       boolean not null default false,  -- true => NUNCA crear Order (coaching-yanetsis)
  note                  text,                  -- 'Valor desde. Puede variar...'
  mp_category_id        text,                  -- items[].category_id (Mercado Pago)
  is_active             boolean not null default true
);

create table public.service_variants (
  id             text primary key,             -- 'kids-grupales__mensual'
  service_id     text not null references public.services(id),
  label          text not null,                -- 'Mensual', 'Paquete 5', 'Clase única'
  price          integer not null check (price >= 0),  -- COP ENTERO (único origen de precio)
  unit           text not null default 'sesion',        -- 'sesion' | 'mes' | 'paquete' | 'proceso'
  quantity       integer,                      -- 5 / 10 (paquetes de N clases)
  is_recommended boolean not null default false,
  tag            text,                         -- 'Más elegido para ver progreso real.'
  is_active      boolean not null default true,
  unique (service_id, id)
);

-- ============================================================================
-- 3. ÓRDENES (núcleo transaccional)
-- ============================================================================

create table public.orders (
  id                   uuid primary key default gen_random_uuid(),
  external_reference   text unique,            -- = orders.id::text (para MP, ≤150 chars)

  -- 🛒 PRODUCTO (snapshot inmutable para factura / operación)
  variant_id           text not null references public.service_variants(id),
  service_title        text not null,
  variant_label        text not null,
  amount_total         integer not null check (amount_total >= 0),  -- COP entero
  currency             text not null default 'COP',

  -- 🎓 ESTUDIANTE (operación de la academia)
  student_first_name   text not null,
  student_last_name    text not null,
  student_age          integer,                -- Vital para Kids (5-10) / Teens (11-16)
  student_notes        text,

  -- 💳 PAGADOR / FACTURACIÓN (Mercado Pago + DIAN)
  payer_email          text not null,
  payer_first_name     text not null,
  payer_last_name      text not null,
  payer_doc_type       text not null,          -- CC | NIT | CE | PASAPORTE
  payer_doc_number     text not null,
  payer_phone          text not null,
  payer_ip_address     text,                   -- additional_info.payer.ip_address

  -- ⚖️ HABEAS DATA (Ley 1581 de 2012)
  habeas_data_accepted boolean not null default false,
  habeas_data_accepted_at timestamptz,

  -- 🔄 ESTADOS Y CICLO DE VIDA
  status               order_status not null default 'draft',  -- draft → (redirect) → pending_payment
  expires_at           timestamptz,            -- TTL: reserva de cupo / expiración de la Order
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  paid_at              timestamptz,
  rejected_at          timestamptz,
  refunded_at          timestamptz,

  -- 💳 MERCADO PAGO (Checkout Pro — preferencias + Payment Brick)
  idempotency_key      uuid,                   -- header X-Idempotency-Key por intento
  preference_id        text,                   -- id de la Preferencia en MP (creada por intento)
  mp_order_id          text,                   -- merchant_order_id de MP (si aplica)
  mp_status            text,                   -- status crudo MP (approved / pending / rejected / ...)
  mp_status_detail     text,                   -- status_detail MP (accredited / pending_waiting_payment / ...)
  mp_payment_method    text,
  mp_raw               jsonb                   -- respuesta cruda de MP (auditoría)
);

-- Índice: búsquedas por estado/expiración (cron de expiración y reconciliación)
create index orders_status_idx on public.orders (status);
create index orders_expires_at_idx on public.orders (expires_at);
create index orders_mp_order_id_idx on public.orders (mp_order_id);
create index orders_external_reference_idx on public.orders (external_reference);
create index orders_preference_id_idx on public.orders (preference_id);

-- ============================================================================
-- 4. PAGOS INDIVIDUALES (una Order puede tener varias transacciones)
-- ============================================================================

create table public.order_payments (
  id               bigserial primary key,
  order_id         uuid not null references public.orders(id),
  mp_payment_id    text unique,               -- id del Payment en MP (PAY...)
  amount           integer not null,
  paid_amount      integer,
  status           text,
  status_detail    text,
  payment_method   text,                      -- 'master', 'pse', 'debvisa', ...
  type             text,                      -- 'credit_card' | 'bank_transfer' | 'debit_card'
  refunded_amount  integer not null default 0,
  created_at       timestamptz not null default now()
);

create index order_payments_order_id_idx on public.order_payments (order_id);

-- ============================================================================
-- 5. LOGS DE WEBHOOK (idempotencia — §2)
-- ============================================================================

create table public.webhook_logs (
  id          bigserial primary key,
  event_id    text unique,                    -- id del evento/notificación recibida
  topic       text,                           -- 'order' | 'payment' | ...
  resource_id text,                           -- id de la Order/Payment en MP
  payload     jsonb,
  processed   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index webhook_logs_processed_idx on public.webhook_logs (processed);

-- ============================================================================
-- 6. SEED DEL CATÁLOGO
-- (Fuente: requerimientos de la clienta + data/services.ts — precios verificados)
-- ============================================================================

insert into public.categories (id, label, position) values
  ('canto-ninos',    'Canto para niños',         1),
  ('canto-jovenes',  'Canto para jóvenes',       2),
  ('canto-adultos',  'Canto para adultos',       3),
  ('tecnica-vocal',  'Técnica vocal',            4),
  ('escena',         'Escena',                   5),
  ('bienestar',      'Bienestar',                6),
  ('instrumentos',   'Instrumentos',             7),
  ('yanetsis',       'Trabajar con Yanetsis',    8);

insert into public.services
  (id, category_id, position, micro_title, title, description, modality, mode, age, schedule, intensity_or_duration, learn_list, is_special, is_custom_quote, note, mp_category_id, is_active)
values
  ('kids-grupales', 'canto-ninos', 1, 'Para los más pequeños', 'Clases Grupales Kids',
   'El primer escenario para que los niños descubran su voz cantando, jugando y compartiendo. Un proceso seguro y creativo para desarrollar respiración, afinación, ritmo, confianza y amor por la música.',
   'Presencial', 'Presencial', 'Niños de 5 a 10 años', 'Sábados 8:00 a. m. a 10:00 a. m.', '2 horas semanales',
   array['Fundamentos del canto','Seguridad y expresión','Escucha musical','Trabajo en grupo'], false, false, null, null, true),
  ('teens-grupales', 'canto-jovenes', 1, 'Voz e identidad joven', 'Clases Grupales Teens',
   'Un espacio para que los adolescentes desarrollen su voz, ganen seguridad y empiecen a construir identidad artística en comunidad con otros jóvenes.',
   'Presencial', 'Presencial', 'Adolescentes de 11 a 16 años', 'Sábados 10:00 a. m. a 12:00 m.', '2 horas semanales',
   array['Técnica vocal','Interpretación y proyección','Estilo propio','Presencia escénica y confianza'], false, false, null, null, true),
  ('adultos-grupales', 'canto-adultos', 1, 'Un programa por módulos', 'Clases Grupales Adultos',
   'Un programa estructurado para formarte a cualquier edad, desde cero o con experiencia. Avanzas módulo a módulo mientras trabajas técnica, interpretación, repertorio y seguridad al cantar.',
   'Presencial', 'Presencial', '17 años en adelante', 'Miércoles 6:00 p. m. a 7:00 p. m.', '18 módulos progresivos',
   array['Respiración y afinación','Técnica base e interpretación','Estilo y repertorio','Presencia escénica'], false, false, null, null, true),
  ('tecnica-vocal-ind', 'tecnica-vocal', 1, 'Tu voz, uno a uno', 'Canto · Técnica Vocal',
   'Clase individual enfocada por completo en tu voz. El maestro trabaja tu técnica e interpretación desde tu punto de partida, tus metas y el repertorio que quieres dominar.',
   'Híbrido', 'Presencial o virtual', null, null, '1 hora por sesión',
   array['Respiración, apoyo y afinación','Resonancia y rango vocal','Cuidado de la voz','Interpretación'], false, false, null, null, true),
  ('teatro', 'escena', 1, 'Presencia y actuación', 'Teatro',
   'Formación en actuación y expresión escénica para artistas que quieren potenciar su presencia, su interpretación y su conexión con el público.',
   'Híbrido', 'Presencial o virtual', null, null, '1 hora por sesión',
   array['Actuación y manejo corporal','Expresión emocional','Interpretación','Conexión con la audiencia'], false, false, null, null, true),
  ('produccion-musical', 'instrumentos', 1, 'Crea tu propia música', 'Producción Musical',
   'Un proceso para transformar tus ideas musicales en canciones. Aprende a estructurar, grabar, editar y dar forma a un proyecto sonoro propio.',
   'Híbrido', 'Presencial o virtual', null, null, '1 hora por sesión',
   array['Fundamentos de producción','Herramientas digitales','Estructura de canción','Grabación, edición y mezcla'], false, false, null, null, true),
  ('expresion-corporal', 'escena', 2, 'Tu cuerpo también canta', 'Expresión Corporal',
   'Entrenamiento para integrar cuerpo, movimiento y presencia escénica. Ideal para artistas que quieren comunicar mejor y sentirse más naturales en escena.',
   'Híbrido', 'Presencial o virtual', null, null, '1 hora por sesión',
   array['Conciencia corporal y movimiento','Presencia en escena','Manejo de tensiones','Expresión y seguridad'], false, false, null, null, true),
  ('yoga-voz', 'bienestar', 1, 'Bienestar como base', 'Yoga para voz y cuerpo',
   'El bienestar también sostiene la voz. Este proceso trabaja respiración, postura, relajación y manejo del estrés para cuidar el cuerpo como herramienta artística.',
   'Híbrido', 'Presencial o virtual', null, null, '1 hora por sesión',
   array['Respiración y control corporal','Relajación y postura','Manejo de ansiedad escénica','Cuidado del instrumento'], false, false, null, null, true),
  ('piano', 'instrumentos', 2, 'Domina un instrumento', 'Piano',
   'Aprende piano y comprende la música desde otra dimensión. Dominar un instrumento amplía tu musicalidad, fortalece tu oído y te da herramientas para cantar, componer y acompañarte.',
   'Híbrido', 'Presencial o virtual', null, null, '1 hora por sesión',
   array['Notas, acordes y ritmo','Lectura musical y coordinación','Acompañamiento vocal','Interpretación'], false, false, null, null, true),
  ('guitarra', 'instrumentos', 3, 'Acompaña tu voz', 'Guitarra',
   'Aprende a tocar guitarra y acompaña tu voz. Un instrumento versátil para interpretar tus canciones favoritas, crear música y fortalecer tu camino artístico.',
   'Híbrido', 'Presencial o virtual', null, null, '1 hora por sesión',
   array['Acordes y ritmos','Técnica de acompañamiento','Lectura aplicada','Interpretación vocal'], false, false, null, null, true),
  ('asesoria-yanetsis', 'yanetsis', 1, 'Tu punto de partida', 'Asesoría con Yanetsis',
   'Una sesión inicial directamente con Yanetsis Alfonso para diagnosticar tu punto de partida como artista, conocer tu voz, resolver dudas y definir los siguientes pasos de tu proceso.',
   'Virtual', 'Virtual', null, null, '30 minutos',
   array['Diagnóstico vocal personalizado','Orientación artística','Respuestas de técnica e industria','Experiencia directa con Yanetsis'], true, false, null, null, true),
  ('tecnica-yanetsis', 'yanetsis', 2, 'Formación al más alto nivel', 'Técnica Vocal con Yanetsis',
   'La experiencia de formarte directamente con Yanetsis Alfonso, la coach que ha preparado artistas para televisión, escenarios y producciones de alto nivel.',
   'Híbrido', 'Presencial o virtual', null, null, '1 hora por sesión',
   array['Técnica vocal avanzada','Interpretación y estilo propio','Cuidado vocal','Estándares profesionales de TV'], true, false, null, null, true),
  ('coaching-yanetsis', 'yanetsis', 3, 'Construye tu carrera', 'Coaching Artístico',
   'Un acompañamiento estratégico para artistas que quieren profesionalizar su carrera. Define tu identidad, ordena tus ideas y traza una ruta para proyectar tu propuesta musical.',
   'Híbrido', 'Presencial o virtual', null, null, '4 sesiones mensuales',
   array['Nombre artístico e identidad','Propósito musical y sello personal','Repertorio y proyecto artístico','Estrategia de proyección'], true, true,
   'Valor desde. Puede variar según el artista y los servicios integrados.', null, true);

insert into public.service_variants
  (id, service_id, label, price, unit, quantity, is_recommended, tag)
values
  -- Clases Grupales Kids
  ('kids-grupales__mensual',   'kids-grupales', 'Mensual', 809000, 'mes', 1, false, null),
  ('kids-grupales__trimestral','kids-grupales', 'Trimestral', 2299000, 'proceso', 3, true, 'Más elegido para ver progreso real.'),
  ('kids-grupales__anual',     'kids-grupales', 'Anual', 8699000, 'proceso', 12, false, null),
  -- Clases Grupales Teens
  ('teens-grupales__mensual',   'teens-grupales', 'Mensual', 809000, 'mes', 1, false, null),
  ('teens-grupales__trimestral','teens-grupales', 'Trimestral', 2299000, 'proceso', 3, true, 'Más elegido para crear hábito vocal.'),
  ('teens-grupales__anual',     'teens-grupales', 'Anual', 8699000, 'proceso', 12, false, null),
  -- Clases Grupales Adultos
  ('adultos-grupales__mensual',   'adultos-grupales', 'Mensual', 569000, 'mes', 1, false, null),
  ('adultos-grupales__trimestral','adultos-grupales', 'Trimestral', 1609000, 'proceso', 3, true, 'Más elegido para avanzar con continuidad.'),
  ('adultos-grupales__anual',     'adultos-grupales', 'Anual', 6069000, 'proceso', 12, false, null),
  -- Canto · Técnica Vocal
  ('tecnica-vocal-ind__clase-unica', 'tecnica-vocal-ind', 'Clase única', 279000, 'sesion', 1, false, null),
  ('tecnica-vocal-ind__paquete-5',   'tecnica-vocal-ind', 'Paquete 5', 1329000, 'paquete', 5, true, 'Más elegido para notar avance.'),
  ('tecnica-vocal-ind__paquete-10',  'tecnica-vocal-ind', 'Paquete 10', 2509000, 'paquete', 10, false, null),
  -- Teatro
  ('teatro__clase-unica', 'teatro', 'Clase única', 279000, 'sesion', 1, false, null),
  ('teatro__paquete-5',   'teatro', 'Paquete 5', 1329000, 'paquete', 5, true, 'Más elegido para ganar seguridad escénica.'),
  ('teatro__paquete-10',  'teatro', 'Paquete 10', 2509000, 'paquete', 10, false, null),
  -- Producción Musical
  ('produccion-musical__clase-unica', 'produccion-musical', 'Clase única', 279000, 'sesion', 1, false, null),
  ('produccion-musical__paquete-5',   'produccion-musical', 'Paquete 5', 1329000, 'paquete', 5, true, 'Más elegido para empezar tu proyecto.'),
  ('produccion-musical__paquete-10',  'produccion-musical', 'Paquete 10', 2509000, 'paquete', 10, false, null),
  -- Expresión Corporal
  ('expresion-corporal__clase-unica', 'expresion-corporal', 'Clase única', 279000, 'sesion', 1, false, null),
  ('expresion-corporal__paquete-5',   'expresion-corporal', 'Paquete 5', 1329000, 'paquete', 5, true, 'Más elegido para soltar el cuerpo.'),
  ('expresion-corporal__paquete-10',  'expresion-corporal', 'Paquete 10', 2509000, 'paquete', 10, false, null),
  -- Yoga para voz y cuerpo
  ('yoga-voz__clase-unica', 'yoga-voz', 'Clase única', 279000, 'sesion', 1, false, null),
  ('yoga-voz__paquete-5',   'yoga-voz', 'Paquete 5', 1329000, 'paquete', 5, true, 'Más elegido para cuidar tu instrumento.'),
  ('yoga-voz__paquete-10',  'yoga-voz', 'Paquete 10', 2509000, 'paquete', 10, false, null),
  -- Piano
  ('piano__clase-unica', 'piano', 'Clase única', 219000, 'sesion', 1, false, null),
  ('piano__paquete-5',   'piano', 'Paquete 5', 1029000, 'paquete', 5, true, 'Más elegido para crear hábito musical.'),
  ('piano__paquete-10',  'piano', 'Paquete 10', 1939000, 'paquete', 10, false, null),
  -- Guitarra
  ('guitarra__clase-unica', 'guitarra', 'Clase única', 219000, 'sesion', 1, false, null),
  ('guitarra__paquete-5',   'guitarra', 'Paquete 5', 1029000, 'paquete', 5, true, 'Más elegido para acompañar tu voz.'),
  ('guitarra__paquete-10',  'guitarra', 'Paquete 10', 1939000, 'paquete', 10, false, null),
  -- Asesoría con Yanetsis
  ('asesoria-yanetsis__sesion-unica', 'asesoria-yanetsis', 'Sesión única', 179000, 'sesion', 1, true, 'Entrada al mundo Yanetsis.'),
  -- Técnica Vocal con Yanetsis
  ('tecnica-yanetsis__clase-unica', 'tecnica-yanetsis', 'Clase única', 419000, 'sesion', 1, false, null),
  ('tecnica-yanetsis__paquete-5',   'tecnica-yanetsis', 'Paquete 5', 1959000, 'paquete', 5, true, 'Más elegido para avanzar con Yanetsis.'),
  ('tecnica-yanetsis__paquete-10',  'tecnica-yanetsis', 'Paquete 10', 3709000, 'paquete', 10, false, null);
  -- Coaching Artístico (SOLO COTIZACIÓN — sin variantes de pago)
  -- Nota: service.is_custom_quote = true. NO se crean variantes vendibles.

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Mantiene orders.updated_at automáticamente en cada UPDATE.
-- Requerido por §4.5 (contención de capas) y por toda reconciliación.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- ============================================================================
-- 8. RLS — ROW LEVEL SECURITY (§8.7)
-- ============================================================================

-- Habilitar RLS en todas las tablas. Sin políticas → sin acceso.
alter table public.categories       enable row level security;
alter table public.services         enable row level security;
alter table public.service_variants enable row level security;
alter table public.orders           enable row level security;
alter table public.order_payments   enable row level security;
alter table public.webhook_logs     enable row level security;

-- Catálogo: lectura pública (anon / authenticated). Solo SELECT.
create policy "catalog_select" on public.categories
  for select to anon, authenticated using (true);
create policy "catalog_select" on public.services
  for select to anon, authenticated using (true);
create policy "catalog_select" on public.service_variants
  for select to anon, authenticated using (true);

-- orders / order_payments / webhook_logs: SIN políticas anónimas.
-- Contienen PII (§6). Única vía de acceso: role service_role, que omite RLS
-- (cliente admin en lib/supabase/admin.ts) usado por Server Actions y webhooks.

-- Grant explícito por seguridad (refuerza default privileges de Supabase).
grant select on public.categories, public.services, public.service_variants to anon, authenticated;

-- Grants para service_role (Server Actions / webhooks / scripts):
-- omiten RLS pero requieren privilege sobre las tablas.
grant select, insert, update, delete on public.orders, public.order_payments, public.webhook_logs to service_role;
grant select on public.categories, public.services, public.service_variants to service_role;

-- Las tablas order_payments y webhook_logs usan bigserial → secuencias.
-- El INSERT (nextval) con service_role falla con 42501 si no hay USAGE sobre la
-- secuencia (hallazgo 2026-08: "permission denied for sequence ..._id_seq").
grant usage, select on sequence public.order_payments_id_seq, public.webhook_logs_id_seq to service_role;

-- ============================================================================
-- 8b. VISTA: ESTUDIANTES QUE HAN PAGADO (operación de la academia)
-- ============================================================================

-- Lista de estudiantes con pago confirmado + detalle del servicio adquirido.
-- Los datos viven en orders (snapshot inmutable); la vista solo la presenta.
-- JOINs al catálogo para agrupar/reportar por tipo de servicio (Kids vs Teens)
-- sin parsear títulos. Acceso solo service_role (PII).
-- DROP + CREATE para permitir re-aplicación (CREATE OR REPLACE no reordena
-- columnas de una vista existente — error 42P16).
drop view if exists public.v_students_paid;

create view public.v_students_paid as
select
  o.id                      as order_id,
  o.variant_id              as variant_id,      -- kids-grupales__mensual / teens-grupales__...
  sv.service_id             as service_id,      -- kids-grupales / teens-grupales
  s.category_id             as category_id,
  c.label                   as category_label,  -- 'Canto para niños' / 'Canto para jóvenes'
  o.service_title           as service_title,
  o.variant_label           as variant_label,
  o.amount_total            as amount_total,
  o.currency                as currency,
  o.student_first_name      as student_first_name,
  o.student_last_name       as student_last_name,
  o.student_age             as student_age,
  o.student_notes           as student_notes,
  o.payer_email             as payer_email,
  o.payer_first_name        as payer_first_name,
  o.payer_last_name         as payer_last_name,
  o.payer_doc_type          as payer_doc_type,
  o.payer_doc_number        as payer_doc_number,
  o.payer_phone             as payer_phone,
  o.mp_order_id             as mp_order_id,
  o.mp_payment_method       as mp_payment_method,
  o.mp_status_detail        as mp_status_detail,
  o.paid_at                 as paid_at,
  o.created_at              as created_at
from public.orders o
left join public.service_variants sv on sv.id = o.variant_id
left join public.services s        on s.id = sv.service_id
left join public.categories c      on c.id = s.category_id
where o.status = 'paid';

-- Acceso a la vista: solo service_role / postgres (contiene PII). Sin anon.
grant select on public.v_students_paid to service_role;

-- ============================================================================
-- 9. NOTAS DE IMPLEMENTACIÓN
-- ============================================================================
--  - RLS implementado (sección 8). La UI lee el catálogo con anon key; la
--    escritura de orders/order_payments/webhook_logs SOLO vía service-role.
--  - Vista v_students_paid (sección 8b): estudiantes con pago confirmado +
--    detalle del servicio. Acceso solo service_role (PII).
--  - Implementado:
--      * Trigger orders_set_updated_at (sección 7).
--      * Jobs pg_cron → ver supabase/cron.sql:
--          - 'expire-pending-orders': pending_payment con expires_at < now() → 'expired'.
--          - 'purge-stale-drafts': drafts > 48h → DELETE físico (PII, Ley 1581).
--  - Pendiente (futuro, no bloquea): si algún día existiera inventario/cupos limitados,
--    extender 'expire-pending-orders' para liberar el cupo atómicamente (§3).
--  - Mapeo estados MP → order_status (ver docs/paymentSpecs.md §5):
--      processed + accredited                     → 'paid'
--      action_required + pending_waiting_payment  → 'pending_payment'
--      rejected                                   → 'rejected'
--      cancelled / expirada                       → 'expired'
--      reembolso parcial                          → 'partially_refunded'
--      reembolso total / contracargo              → 'refunded'

-- ============================================================================
-- LA MAGIA DE CANTAR — Migración incremental: vista v_students_paid
-- Estudiantes que han pagado + detalle del servicio adquirido.
-- Enriquecida con identificadores del catálogo (JOINs) para agrupar/reportar
-- por tipo de servicio (Kids vs Teens vs ...) sin parsear títulos.
-- SOLO para BDs donde schema.sql ya fue aplicado.
-- Para instalaciones nuevas: la vista ya viene en schema.sql (sección 8b).
--
-- ⚠️ DROP + CREATE (no CREATE OR REPLACE): CREATE OR REPLACE no puede
-- reordenar/renombrar columnas de una vista existente (error 42P16). El DROP
-- hace la migración re-ejecutable sobre BDs con la versión original.
-- ============================================================================

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

grant select on public.v_students_paid to service_role;

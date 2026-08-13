-- ============================================================================
-- LA MAGIA DE CANTAR — Migración incremental: vista v_students_paid
-- Muestra los estudiantes que han pagado + detalle del servicio adquirido.
-- SOLO para BDs donde schema.sql ya fue aplicado.
-- Para instalaciones nuevas: la vista ya viene en schema.sql (sección 8b).
-- ============================================================================

create or replace view public.v_students_paid as
select
  o.id                      as order_id,
  o.student_first_name      as student_first_name,
  o.student_last_name       as student_last_name,
  o.student_age             as student_age,
  o.student_notes           as student_notes,
  o.service_title           as service_title,
  o.variant_label           as variant_label,
  o.amount_total            as amount_total,
  o.currency                as currency,
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
where o.status = 'paid';

grant select on public.v_students_paid to service_role;

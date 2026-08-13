-- ============================================================================
-- LA MAGIA DE CANTAR — Jobs programados (pg_cron)
-- Expiración de intenciones de pago + limpieza TTL de drafts
-- Fuente canónica documentada en docs/paymentSpecs.md §3, §4.5 y §8.8
-- ============================================================================

-- ⚠️ REQUISITO OPERATIVO
--  - Habilitar la extensión pg_cron en Supabase:
--      Dashboard → Database → Extensions → pg_cron → Enable
--  - Este archivo es idempotente: puede re-ejecutarse sin duplicar jobs
--    (cada job se desprograma primero si ya existe por su jobname).

create extension if not exists pg_cron;

-- ============================================================================
-- 1. EXPIRACIÓN DE INTENCIONES DE PAGO (cupos 30 min — §3)
--    Cadencia: cada 5 minutos.
--    Marca 'expired' (conserva el registro para reconciliación/historial).
--    Nota: si en el futuro existiera inventario/cupos limitados, este job se
--    extiende para liberar el cupo de forma atómica (§3).
-- ============================================================================

select cron.unschedule('expire-pending-orders')
where exists (select 1 from cron.job where jobname = 'expire-pending-orders');

select cron.schedule('expire-pending-orders', '*/5 * * * *',
  $$update public.orders
     set status = 'expired'
   where status = 'pending_payment'
     and expires_at is not null
     and expires_at < now()$$);

-- ============================================================================
-- 2. LIMPIEZA TTL DE DRAFTS (PII — §4.5 / Ley 1581)
--    Cadencia: diario a las 03:00 (horario del servidor).
--    DELETE físico: la PII de facturación no debe permanecer en BD.
--    Regla: drafts (formulario completado, intención de pago creada) con más
--    de 48 horas que nunca llegaron a 'paid'.
-- ============================================================================

select cron.unschedule('purge-stale-drafts')
where exists (select 1 from cron.job where jobname = 'purge-stale-drafts');

select cron.schedule('purge-stale-drafts', '0 3 * * *',
  $$delete from public.orders
   where status = 'draft'
     and created_at < now() - interval '48 hours'$$);

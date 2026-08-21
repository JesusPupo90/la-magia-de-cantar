-- ============================================================================
-- LA MAGIA DE CANTAR — Jobs programados (pg_cron)
-- Expiración de intenciones de pago + limpieza TTL de órdenes sin actividad
-- Fuente canónica documentada en docs/paymentSpecs.md §3, §4.5 y §8.8
-- ============================================================================

-- ⚠️ REQUISITO OPERATIVO
--  - Habilitar la extensión pg_cron en Supabase:
--      Dashboard → Database → Extensions → pg_cron → Enable
--  - Este archivo es idempotente: puede re-ejecutarse sin duplicar jobs
--    (cada job se desprograma primero si ya existe por su jobname).

create extension if not exists pg_cron;

-- ============================================================================
-- 1. EXPIRACIÓN DE INTENCIONES DE PAGO VENCIDAS (TTL 30 min — §3)
--    Cadencia: cada 5 minutos.
--    Marca 'expired' las órdenes en 'draft' o 'pending_payment' cuyo
--    expires_at ya pasó (conserva el registro para reconciliación/historial).
--    Nota: si en el futuro existiera inventario/cupos limitados, este job se
--    extiende para liberar el cupo de forma atómica (§3).
-- ============================================================================

select cron.unschedule('expire-pending-orders')
where exists (select 1 from cron.job where jobname = 'expire-pending-orders');

select cron.schedule('expire-pending-orders', '*/5 * * * *',
  $$update public.orders
     set status = 'expired'
   where status in ('pending_payment', 'draft')
     and expires_at is not null
     and expires_at < now()$$);

-- ============================================================================
-- 2. LIMPIEZA TTL DE ÓRDENES SIN ACTIVIDAD DE PAGO (PII — §4.5 / Ley 1581)
--    Cadencia: diario a las 03:00 (horario del servidor).
--    Política de retención: se conserva TODO orden con actividad de pago
--    (pagos exitosos/rechazados y su historial en order_payments). Se elimina
--    físicamente solo lo que NUNCA tuvo un intento de pago (draft/expired con
--    más de 48 horas y sin filas en order_payments). El NOT EXISTS evita
--    violar la FK order_payments.order_id → orders.id.
-- ============================================================================

select cron.unschedule('purge-stale-drafts')
where exists (select 1 from cron.job where jobname = 'purge-stale-drafts');

select cron.schedule('purge-stale-drafts', '0 3 * * *',
  $$delete from public.orders o
   where o.status in ('draft', 'expired')
     and o.created_at < now() - interval '48 hours'
     and not exists (select 1 from public.order_payments p where p.order_id = o.id)$$);

-- ============================================================================
-- LA MAGIA DE CANTAR — Migración incremental: grants service_role
-- Corrige "permission denied for table ... service_role" (42501).
-- SOLO si las tablas ya fueron creadas sin grants para service_role.
-- Para instalaciones nuevas: ya vienen en schema.sql (sección 8).
-- ============================================================================

grant select, insert, update, delete on public.orders, public.order_payments, public.webhook_logs to service_role;
grant select on public.categories, public.services, public.service_variants to service_role;

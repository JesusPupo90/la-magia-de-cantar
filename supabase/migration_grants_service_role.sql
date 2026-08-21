-- ============================================================================
-- LA MAGIA DE CANTAR — Migración incremental: grants service_role
-- Corrige "permission denied for table ... service_role" (42501).
-- SOLO si las tablas ya fueron creadas sin grants para service_role.
-- Para instalaciones nuevas: ya vienen en schema.sql (sección 8).
-- ============================================================================

grant select, insert, update, delete on public.orders, public.order_payments, public.webhook_logs to service_role;
grant select on public.categories, public.services, public.service_variants to service_role;

-- Las tablas order_payments y webhook_logs usan bigserial → secuencias.
-- El INSERT (nextval) con service_role falla con 42501 si no hay USAGE sobre la
-- secuencia (hallazgo 2026-08: "permission denied for sequence ..._id_seq").
grant usage, select on sequence public.order_payments_id_seq, public.webhook_logs_id_seq to service_role;

-- ============================================================================
-- LA MAGIA DE CANTAR — Migración incremental: columna orders.preference_id
-- El flujo pasa de Checkout API Orders (client_token) a Checkout Pro embebido
-- (Payment Brick + preferenceId). Guardamos la preferencia por intento para
-- auditoría y para poder re-crearla/reutilizarla.
-- SOLO para BDs donde schema.sql ya fue aplicado.
-- Para instalaciones nuevas: ya viene en schema.sql (sección 3).
-- ============================================================================

alter table public.orders
  add column if not exists preference_id text;

create index if not exists orders_preference_id_idx on public.orders (preference_id);

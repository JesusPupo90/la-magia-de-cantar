-- ============================================================================
-- LA MAGIA DE CANTAR — Migración incremental
-- Agrega services.position (orden de tarjetas dentro de su categoría).
-- SOLO para BDs donde schema.sql ya fue aplicado (antes de existir la columna).
-- Para instalaciones nuevas: la columna ya viene en schema.sql.
-- ============================================================================

alter table public.services
  add column if not exists position integer not null default 0;

update public.services set position = 1 where id = 'kids-grupales';
update public.services set position = 1 where id = 'teens-grupales';
update public.services set position = 1 where id = 'adultos-grupales';
update public.services set position = 1 where id = 'tecnica-vocal-ind';
update public.services set position = 1 where id = 'teatro';
update public.services set position = 1 where id = 'produccion-musical';
update public.services set position = 2 where id = 'expresion-corporal';
update public.services set position = 1 where id = 'yoga-voz';
update public.services set position = 2 where id = 'piano';
update public.services set position = 3 where id = 'guitarra';
update public.services set position = 1 where id = 'asesoria-yanetsis';
update public.services set position = 2 where id = 'tecnica-yanetsis';
update public.services set position = 3 where id = 'coaching-yanetsis';

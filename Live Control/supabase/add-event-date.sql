-- ═══════════════════════════════════════════════════════════════
-- AGREGAR CAMPO event_date A SETLISTS
-- ═══════════════════════════════════════════════════════════════
-- Este script agrega el campo de fecha a los setlists existentes

-- Agregar columna event_date (permitir NULL temporalmente)
ALTER TABLE setlists ADD COLUMN IF NOT EXISTS event_date DATE;

-- Actualizar setlists existentes con fechas basadas en el nombre
-- (puedes ajustar estas fechas manualmente después)
UPDATE setlists SET event_date = '2025-01-19' WHERE name LIKE '%Domingo 18%';
UPDATE setlists SET event_date = '2025-01-15' WHERE name LIKE '%Miercoles 14%';
UPDATE setlists SET event_date = '2025-01-19' WHERE name LIKE '%Domingo - Alabanza%';

-- Hacer la columna NOT NULL después de actualizar
ALTER TABLE setlists ALTER COLUMN event_date SET NOT NULL;

-- Crear índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_setlists_event_date ON setlists(event_date DESC);

-- Eliminar la vista existente primero
DROP VIEW IF EXISTS setlists_with_songs;

-- Recrear la vista para incluir event_date
CREATE OR REPLACE VIEW setlists_with_songs AS
SELECT
  sl.id,
  sl.name,
  sl.event_date,
  sl.created_at,
  sl.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', s.id,
        'name', s.name,
        'program_change', s.program_change,
        'artist', s.artist,
        'key', s.key,
        'bpm', s.bpm,
        'duration', s.duration,
        'youtube_url', s.youtube_url,
        'album_art', s.album_art,
        'notes', s.notes,
        'position', ss.position
      ) ORDER BY ss.position
    ) FILTER (WHERE s.id IS NOT NULL),
    '[]'::json
  ) as songs
FROM setlists sl
LEFT JOIN setlist_songs ss ON sl.id = ss.setlist_id
LEFT JOIN songs s ON ss.song_id = s.id
GROUP BY sl.id;


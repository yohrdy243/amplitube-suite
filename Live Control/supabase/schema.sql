-- ═══════════════════════════════════════════════════════════════
-- LIVE CONTROL - SUPABASE DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- TABLE: songs
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  program_change INTEGER NOT NULL CHECK (program_change >= 0 AND program_change <= 128),
  
  -- Metadata
  artist TEXT DEFAULT '',
  key TEXT DEFAULT '',
  bpm INTEGER,
  duration TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  album_art TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: scenes
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  song_id TEXT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  name TEXT DEFAULT '',
  cc INTEGER NOT NULL CHECK (cc >= 0 AND cc <= 127),
  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 3),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique position per song
  UNIQUE(song_id, position)
);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: setlists
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS setlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: setlist_songs (junction table)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS setlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setlist_id TEXT NOT NULL REFERENCES setlists(id) ON DELETE CASCADE,
  song_id TEXT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique position per setlist
  UNIQUE(setlist_id, position),
  -- Ensure song appears only once per setlist
  UNIQUE(setlist_id, song_id)
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_scenes_song_id ON scenes(song_id);
CREATE INDEX IF NOT EXISTS idx_setlist_songs_setlist_id ON setlist_songs(setlist_id);
CREATE INDEX IF NOT EXISTS idx_setlist_songs_song_id ON setlist_songs(song_id);
CREATE INDEX IF NOT EXISTS idx_setlists_event_date ON setlists(event_date DESC);

-- ═══════════════════════════════════════════════════════════════
-- FUNCTIONS: Auto-update updated_at timestamp
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS: Auto-update updated_at
-- ═══════════════════════════════════════════════════════════════

DROP TRIGGER IF EXISTS update_songs_updated_at ON songs;
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scenes_updated_at ON scenes;
CREATE TRIGGER update_scenes_updated_at
  BEFORE UPDATE ON scenes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_setlists_updated_at ON setlists;
CREATE TRIGGER update_setlists_updated_at
  BEFORE UPDATE ON setlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlist_songs ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for now - adjust based on your needs)
CREATE POLICY "Allow public read access on songs" ON songs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on scenes" ON scenes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on setlists" ON setlists FOR SELECT USING (true);
CREATE POLICY "Allow public read access on setlist_songs" ON setlist_songs FOR SELECT USING (true);

-- Allow public write access (for now - adjust based on your needs)
CREATE POLICY "Allow public insert on songs" ON songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on songs" ON songs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on songs" ON songs FOR DELETE USING (true);

CREATE POLICY "Allow public insert on scenes" ON scenes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on scenes" ON scenes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on scenes" ON scenes FOR DELETE USING (true);

CREATE POLICY "Allow public insert on setlists" ON setlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on setlists" ON setlists FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on setlists" ON setlists FOR DELETE USING (true);

CREATE POLICY "Allow public insert on setlist_songs" ON setlist_songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on setlist_songs" ON setlist_songs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on setlist_songs" ON setlist_songs FOR DELETE USING (true);

-- ═══════════════════════════════════════════════════════════════
-- VIEWS: Simplified queries
-- ═══════════════════════════════════════════════════════════════

-- View: songs_with_scenes (songs with their scenes in order)
CREATE OR REPLACE VIEW songs_with_scenes AS
SELECT
  s.id,
  s.name,
  s.program_change,
  s.artist,
  s.key,
  s.bpm,
  s.duration,
  s.youtube_url,
  s.album_art,
  s.notes,
  s.created_at,
  s.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', sc.id,
        'name', sc.name,
        'cc', sc.cc,
        'position', sc.position
      ) ORDER BY sc.position
    ) FILTER (WHERE sc.id IS NOT NULL),
    '[]'::json
  ) as scenes
FROM songs s
LEFT JOIN scenes sc ON s.id = sc.song_id
GROUP BY s.id;

-- View: setlists_with_songs (setlists with their songs in order)
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

-- ═══════════════════════════════════════════════════════════════
-- COMMENTS
-- ═══════════════════════════════════════════════════════════════

COMMENT ON TABLE songs IS 'Canciones con configuración MIDI';
COMMENT ON TABLE scenes IS 'Escenas (4 por canción) con Control Change';
COMMENT ON TABLE setlists IS 'Setlists para organizar canciones';
COMMENT ON TABLE setlist_songs IS 'Relación muchos-a-muchos entre setlists y canciones';

COMMENT ON COLUMN songs.program_change IS 'Número de Program Change MIDI (0-128)';
COMMENT ON COLUMN scenes.cc IS 'Número de Control Change MIDI (0-127)';
COMMENT ON COLUMN scenes.position IS 'Posición de la escena (0-3)';
COMMENT ON COLUMN setlists.event_date IS 'Fecha del evento/show (para ordenar y filtrar)';
COMMENT ON COLUMN setlist_songs.position IS 'Orden de la canción en el setlist';


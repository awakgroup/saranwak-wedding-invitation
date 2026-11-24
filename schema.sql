-- Cloudflare D1 Database Schema: Ucapan & RSVP
-- Database Name: saranwak_wedding_db

CREATE TABLE IF NOT EXISTS ucapan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL DEFAULT 'budi-santi',  -- ID/slug pasangan (misal: 'budi-santi', 'dimas-rini')
  tema TEXT NOT NULL,                        -- 'art-minang-3', 'velvet-overture', 'bataknese'
  nama TEXT NOT NULL,
  hadir TEXT DEFAULT 'Doa',                  -- 'Hadir · 2 Orang', 'Tidak Hadir', 'Doa'
  isi TEXT DEFAULT '',
  waktu DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ucapan_event_tema ON ucapan(event, tema);
CREATE INDEX IF NOT EXISTS idx_ucapan_waktu ON ucapan(waktu DESC);

-- Registrasi Acara / Pasangan
CREATE TABLE IF NOT EXISTS acara_pasangan (
  slug TEXT PRIMARY KEY,
  tema TEXT NOT NULL DEFAULT 'art-minang-3',
  pria TEXT DEFAULT 'Budi',
  wanita TEXT DEFAULT 'Santi',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO acara_pasangan (slug, tema, pria, wanita) VALUES ('budi-santi', 'art-minang-3', 'Budi', 'Santi');

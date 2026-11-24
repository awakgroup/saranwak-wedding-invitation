-- Cloudflare D1 Database Schema: Ucapan & RSVP
-- Database Name: saranwak_wedding_db

CREATE TABLE IF NOT EXISTS ucapan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tema TEXT NOT NULL,          -- 'art-minang-3', 'velvet-overture', 'bataknese'
  nama TEXT NOT NULL,
  hadir TEXT DEFAULT 'Doa',    -- 'Hadir · 2 Orang', 'Tidak Hadir', 'Doa'
  isi TEXT DEFAULT '',
  waktu DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ucapan_tema ON ucapan(tema);
CREATE INDEX IF NOT EXISTS idx_ucapan_waktu ON ucapan(waktu DESC);

/**
 * Cloudflare Worker with Static Assets + D1 Database
 * Saranwak Digital Wedding Invitation
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

let tableInitialized = false;
async function ensureTable(db) {
  if (tableInitialized || !db) return;
  try {
    // Buat tabel jika belum ada
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ucapan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event TEXT NOT NULL DEFAULT 'budi-santi',
        tema TEXT NOT NULL,
        nama TEXT NOT NULL,
        hadir TEXT DEFAULT 'Doa',
        isi TEXT DEFAULT '',
        waktu DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_ucapan_event_tema ON ucapan(event, tema);
    `);

    // Migrasi jika tabel lama belum memiliki kolom event
    try {
      await db.exec("ALTER TABLE ucapan ADD COLUMN event TEXT DEFAULT 'budi-santi';");
    } catch (e) {
      // Kolom sudah ada, abaikan
    }

    tableInitialized = true;
  } catch (e) {
    // Abaikan jika sudah terinisialisasi
  }
}

async function handleUcapanApi(request, env, url) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Fallback if D1 is not bound yet
  if (!env.DB) {
    return new Response(
      JSON.stringify({
        success: false,
        fallback: true,
        message: "Cloudflare D1 binding (DB) is not configured yet."
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Otomatis pastikan tabel ucapan sudah ada di D1
  await ensureTable(env.DB);

  // GET: Fetch ucapan untuk event dan tema spesifik
  if (request.method === "GET") {
    try {
      const event = url.searchParams.get("event") || "budi-santi";
      const tema = url.searchParams.get("tema") || "art-minang-3";
      const limit = Math.min(Math.max(1, parseInt(url.searchParams.get("limit") || "100", 10)), 200);

      const query = `
        SELECT id, event, tema, nama, hadir, isi,
               strftime('%d %b %Y %H:%M', waktu, '+7 hours') as waktu
        FROM ucapan
        WHERE event = ? AND tema = ?
        ORDER BY id DESC
        LIMIT ?
      `;

      const { results } = await env.DB.prepare(query).bind(event, tema, limit).all();

      return new Response(
        JSON.stringify({
          success: true,
          event,
          tema,
          data: results || []
        }),
        { status: 200, headers: corsHeaders }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: err.message
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  }

  // POST: Insert ucapan baru per event dan tema
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const event = String(body.event || "budi-santi").trim().slice(0, 80);
      const tema = String(body.tema || "art-minang-3").trim().slice(0, 40);
      const nama = String(body.nama || "").trim().slice(0, 80);
      const hadir = String(body.hadir || "Doa").trim().slice(0, 50);
      const isi = String(body.isi || "").trim().slice(0, 600);

      if (!nama) {
        return new Response(
          JSON.stringify({ success: false, error: "Nama pengirim wajib diisi." }),
          { status: 400, headers: corsHeaders }
        );
      }

      const stmt = env.DB.prepare(
        "INSERT INTO ucapan (event, tema, nama, hadir, isi) VALUES (?, ?, ?, ?, ?)"
      );
      const result = await stmt.bind(event, tema, nama, hadir, isi).run();

      return new Response(
        JSON.stringify({
          success: true,
          id: result.meta ? result.meta.last_row_id : null,
          data: {
            event,
            tema,
            nama,
            hadir,
            isi,
            waktu: "Baru saja"
          }
        }),
        { status: 201, headers: corsHeaders }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: err.message
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: corsHeaders }
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API Routes for Ucapan & RSVP
    if (url.pathname === "/api/ucapan" || url.pathname.startsWith("/api/ucapan")) {
      return handleUcapanApi(request, env, url);
    }

    // Default: Serve static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  }
};

/**
 * Cloudflare Worker with Static Assets + D1 Database
 * Saranwak Digital Wedding Invitation
 * Clean URL Routing: /:pasangan/:tujuan
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

const RESERVED_ROUTES = new Set([
  "api",
  "assets",
  "css",
  "js",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  ".well-known"
]);

const KNOWN_TEMPLATES = new Set([
  "art-minang-3",
  "velvet-overture",
  "bataknese"
]);

const STATIC_EXT_RE = /\.(css|js|jpg|jpeg|png|webp|svg|gif|mp3|wav|ogg|ico|woff|woff2|ttf|eot|map|json|txt|xml)$/i;

let tableInitialized = false;
async function ensureTable(db) {
  if (tableInitialized || !db) return;
  try {
    // 1. Buat tabel ucapan jika belum ada
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
    `);

    // 2. Migrasi: tambah kolom event jika tabel lama belum memiliki kolom event
    try {
      await db.exec("ALTER TABLE ucapan ADD COLUMN event TEXT DEFAULT 'budi-santi';");
    } catch (e) {}

    // 3. Buat index
    try {
      await db.exec("CREATE INDEX IF NOT EXISTS idx_ucapan_event_tema ON ucapan(event, tema);");
      await db.exec("CREATE INDEX IF NOT EXISTS idx_ucapan_waktu ON ucapan(waktu DESC);");
    } catch (e) {}

    // 4. Buat tabel acara_pasangan
    try {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS acara_pasangan (
          slug TEXT PRIMARY KEY,
          tema TEXT NOT NULL DEFAULT 'art-minang-3',
          pria TEXT DEFAULT 'Budi',
          wanita TEXT DEFAULT 'Santi',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        INSERT OR IGNORE INTO acara_pasangan (slug, tema, pria, wanita) VALUES ('budi-santi', 'art-minang-3', 'Budi', 'Santi');
      `);
    } catch (e) {}

    tableInitialized = true;
  } catch (e) {
    // ignore
  }
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatSlugNama(slug) {
  if (!slug) return "Tamu Undangan";
  try {
    slug = decodeURIComponent(slug);
  } catch (e) {}

  const words = slug.replace(/[-_+]+/g, " ").trim().split(/\s+/);
  if (!words.length || (words.length === 1 && !words[0])) return "Tamu Undangan";

  const lowerWords = new Set(["dan", "di", "ke", "dari", "bin", "binti", "the", "of", "and"]);
  const formatted = words.map((w, index) => {
    const lower = w.toLowerCase();
    if (lower === "dr") return "Dr.";
    if (lower === "drs") return "Drs.";
    if (lower === "ir") return "Ir.";
    if (lower === "bpk") return "Bpk.";
    if (lower === "prof") return "Prof.";
    if (lower === "h") return "H.";
    if (lower === "hj") return "Hj.";
    if (lower === "st") return "S.T.";
    if (lower === "se") return "S.E.";
    if (lower === "kom") return "Kom.";
    if (lower === "spd") return "S.Pd.";
    if (lower === "sked") return "S.Ked.";

    if (index > 0 && lowerWords.has(lower)) {
      return lower;
    }
    return w.charAt(0).toUpperCase() + w.slice(1);
  });

  return formatted.join(" ");
}

async function handleUcapanApi(request, env, url) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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

  await ensureTable(env.DB);

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

      let results = [];
      try {
        const res = await env.DB.prepare(query).bind(event, tema, limit).all();
        results = res.results || [];
      } catch (dbErr) {
        try {
          await env.DB.exec("ALTER TABLE ucapan ADD COLUMN event TEXT DEFAULT 'budi-santi';");
          const retry = await env.DB.prepare(query).bind(event, tema, limit).all();
          results = retry.results || [];
        } catch (e2) {
          const fallbackRes = await env.DB.prepare(`
            SELECT id, 'budi-santi' as event, tema, nama, hadir, isi,
                   strftime('%d %b %Y %H:%M', waktu, '+7 hours') as waktu
            FROM ucapan
            WHERE tema = ?
            ORDER BY id DESC
            LIMIT ?
          `).bind(tema, limit).all();
          results = fallbackRes.results || [];
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          event,
          tema,
          data: results
        }),
        { status: 200, headers: corsHeaders }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }

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
        JSON.stringify({ success: false, error: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: corsHeaders }
  );
}

async function handleAcaraApi(request, env, url) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ success: false, message: "D1 not bound" }),
      { status: 200, headers: corsHeaders }
    );
  }

  await ensureTable(env.DB);

  if (request.method === "GET") {
    const slug = (url.searchParams.get("slug") || "budi-santi").toLowerCase();
    const row = await env.DB.prepare("SELECT * FROM acara_pasangan WHERE slug = ?").bind(slug).first();
    return new Response(
      JSON.stringify({ success: true, data: row || { slug, tema: "art-minang-3", pria: "Budi", wanita: "Santi" } }),
      { headers: corsHeaders }
    );
  }

  if (request.method === "POST") {
    try {
      const body = await request.json();
      const slug = String(body.slug || "").trim().toLowerCase().replace(/[^a-z0-9\-]+/g, "-");
      const tema = String(body.tema || "art-minang-3").trim();
      const pria = String(body.pria || "").trim();
      const wanita = String(body.wanita || "").trim();

      if (!slug) {
        return new Response(
          JSON.stringify({ success: false, error: "Slug wajib diisi" }),
          { status: 400, headers: corsHeaders }
        );
      }

      await env.DB.prepare(`
        INSERT INTO acara_pasangan (slug, tema, pria, wanita)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET tema = excluded.tema, pria = excluded.pria, wanita = excluded.wanita
      `).bind(slug, tema, pria, wanita).run();

      return new Response(
        JSON.stringify({ success: true, data: { slug, tema, pria, wanita } }),
        { status: 200, headers: corsHeaders }
      );
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: e.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. API Routes
    if (pathname === "/api/ucapan" || pathname.startsWith("/api/ucapan/")) {
      return handleUcapanApi(request, env, url);
    }
    if (pathname === "/api/acara" || pathname.startsWith("/api/acara/")) {
      return handleAcaraApi(request, env, url);
    }

    // 2. Redirect /art-minang-3/ langsung ke nama pasangan: /budi-santi/
    if (
      pathname === "/art-minang-3" ||
      pathname === "/art-minang-3/" ||
      pathname === "/art-minang-3/index.html"
    ) {
      const to = url.searchParams.get("to");
      let target = "/budi-santi/";
      if (to && to.trim()) {
        const slugTamu = encodeURIComponent(to.trim().toLowerCase().replace(/[\s+]+/g, "-"));
        target = `/budi-santi/${slugTamu}`;
      }
      return Response.redirect(new URL(target, url.origin), 302);
    }

    // 3. Root landing page / catalog
    if (pathname === "/" || pathname === "/index.html") {
      if (env.ASSETS) return env.ASSETS.fetch(request);
      return new Response("Not Found", { status: 404 });
    }

    // 4. Asset langsung dari folder template asli
    // Contoh: /art-minang-3/css/style.css, /art-minang-3/assets/...
    const isDirectTemplateAsset = Array.from(KNOWN_TEMPLATES).some(t => pathname.startsWith(`/${t}/`));
    if (isDirectTemplateAsset) {
      if (env.ASSETS) return env.ASSETS.fetch(request);
      return new Response("Not Found", { status: 404 });
    }

    // 5. Asset yang diminta via URL pasangan (misal: /budi-santi/css/style.css atau /budi-santi/keluarga-joko/assets/...)
    // Jika path mengandung /assets/, /css/, /js/ atau berakhiran ekstensi static
    const assetMarkers = ["/assets/", "/css/", "/js/"];
    const hasMarker = assetMarkers.some(m => pathname.includes(m));
    const isStaticFile = STATIC_EXT_RE.test(pathname);

    if (hasMarker || isStaticFile) {
      const segs = pathname.split("/").filter(Boolean);
      const pasanganSlug = segs[0] ? segs[0].toLowerCase() : "budi-santi";

      // Cari tema pasangan
      let tema = "art-minang-3";
      if (env.DB) {
        try {
          const row = await env.DB.prepare("SELECT tema FROM acara_pasangan WHERE slug = ?").bind(pasanganSlug).first();
          if (row && row.tema && KNOWN_TEMPLATES.has(row.tema)) {
            tema = row.tema;
          }
        } catch (e) {}
      }

      // Ambil subpath asset
      let subPath = "";
      for (const m of assetMarkers) {
        const idx = pathname.indexOf(m);
        if (idx !== -1) {
          subPath = pathname.slice(idx + 1); // e.g. "assets/hero.jpg"
          break;
        }
      }
      if (!subPath) {
        subPath = segs[segs.length - 1];
      }

      if (env.ASSETS) {
        const assetUrl = new URL(`/${tema}/${subPath}`, request.url);
        return env.ASSETS.fetch(new Request(assetUrl, request));
      }
    }

    // 6. Route Pasangan & Tujuan: /:pasangan/:tujuan
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length >= 1) {
      const pasanganSlug = segments[0].toLowerCase();

      // Hindari reserved routes
      if (!RESERVED_ROUTES.has(pasanganSlug) && !STATIC_EXT_RE.test(pasanganSlug)) {
        const tujuanSlug = segments[1] || "";
        const toParam = url.searchParams.get("to");

        let namaTamu = "Tamu Undangan";
        if (toParam && toParam.trim()) {
          namaTamu = toParam.trim();
        } else if (tujuanSlug) {
          namaTamu = formatSlugNama(tujuanSlug);
        }

        // Tentukan tema pasangan
        let tema = "art-minang-3";
        const queryTema = url.searchParams.get("tema");
        if (queryTema && KNOWN_TEMPLATES.has(queryTema)) {
          tema = queryTema;
        } else if (env.DB) {
          try {
            const row = await env.DB.prepare("SELECT tema FROM acara_pasangan WHERE slug = ?").bind(pasanganSlug).first();
            if (row && row.tema && KNOWN_TEMPLATES.has(row.tema)) {
              tema = row.tema;
            }
          } catch (e) {}
        }

        if (env.ASSETS) {
          // Ambil file template HTML
          const tplReq = new Request(new URL(`/${tema}/index.html`, request.url));
          const tplRes = await env.ASSETS.fetch(tplReq);
          if (!tplRes.ok) return tplRes;

          let html = await tplRes.text();

          // A. Ubah semua relative asset links menjadi absolute ke tema
          html = html.replace(/\b(href|src)=["'](css\/|js\/|assets\/)([^"']+)["']/g, `$1="/${tema}/$2$3"`);

          // B. Render nama tamu langsung di server HTML
          html = html.replace(/<b id="namaTamu">[^<]*<\/b>/g, `<b id="namaTamu">${escapeHtml(namaTamu)}</b>`);

          // C. Inject metadata runtime ke dalam <head>
          const runtimeScript = `
<script>
  window.PASANGAN_SLUG = ${JSON.stringify(pasanganSlug)};
  window.NAMA_TAMU = ${JSON.stringify(namaTamu)};
  window.TEMA_SLUG = ${JSON.stringify(tema)};
</script>
`;
          html = html.replace("</head>", `${runtimeScript}\n</head>`);

          return new Response(html, {
            status: 200,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "public, max-age=60, s-maxage=300"
            }
          });
        }
      }
    }

    // Default static assets fallback
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  }
};

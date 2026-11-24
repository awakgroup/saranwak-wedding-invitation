/* ============================================================
   LOGIKA UNDANGAN — VELVET OVERTURE · BUDI & SANTI
   Jangan edit file ini untuk mengganti isi undangan — semua
   data ada di js/data.js (variabel UNDANGAN).
   ============================================================ */
(function () {
  "use strict";

  var data = window.UNDANGAN || {};

  /* ---------- Bantuan ---------- */
  function $(id) { return document.getElementById(id); }

  function toast(pesan) {
    var el = $("toast");
    el.textContent = pesan;
    el.classList.remove("hidden");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.add("hidden"); }, 3200);
  }

  function salinTeks(teks, tombol, pesanSukses) {
    function berhasil() {
      if (tombol) {
        if (!tombol._labelAwal) { tombol._labelAwal = tombol.textContent; }
        tombol.textContent = "Tersalin ✓";
        clearTimeout(tombol._t);
        tombol._t = setTimeout(function () { tombol.textContent = tombol._labelAwal; }, 2500);
      }
      toast(pesanSukses || "Tersalin!");
    }
    function gagal() {
      toast("Gagal menyalin otomatis — salin manual: " + teks);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(teks).then(berhasil, gagal);
    } else {
      var tmp = document.createElement("textarea");
      tmp.value = teks;
      document.body.appendChild(tmp);
      tmp.select();
      try { document.execCommand("copy"); berhasil(); }
      catch (e) { gagal(); }
      document.body.removeChild(tmp);
    }
  }

  /* ---------- Loader ---------- */
  function sembunyikanLoader() {
    var l = $("loader");
    if (l) { l.classList.add("hilang"); }
  }
  window.addEventListener("load", function () {
    setTimeout(sembunyikanLoader, 600);
  });
  setTimeout(sembunyikanLoader, 2500); // pengaman bila load tertahan

  /* ---------- Nama tamu dari ?to= ---------- */
  var params = new URLSearchParams(window.location.search);
  var to = params.get("to");
  if (to) {
    $("namaTamu").textContent = to;
    var un = $("ucapanNama");
    if (un) { un.value = to; }
  }

  /* ---------- Nama & tanggal di seluruh halaman ---------- */
  document.querySelectorAll('[data-nama="pria"]').forEach(function (el) {
    el.textContent = data.pria.nama;
  });
  document.querySelectorAll('[data-nama="wanita"]').forEach(function (el) {
    el.textContent = data.wanita.nama;
  });
  document.querySelectorAll("[data-tanggal-singkat]").forEach(function (el) {
    el.textContent = data.tanggalSingkat;
  });
  document.title = data.pria.nama + " & " + data.wanita.nama + " — Velvet Overture · Undangan Pernikahan";

  /* ---------- Gambar dari data.js ---------- */
  var g = data.gambar || {};
  if (g.cover) { $("coverBg").src = g.cover; $("imgPenutup").src = g.cover; }
  if (g.gramofon) { $("imgGramofon").src = g.gramofon; }
  if (g.jewelBox) { $("imgJewel").src = g.jewelBox; }
  if (g.pintuHijau) { $("imgPintu").src = g.pintuHijau; }
  if (g.drapeHijau) { $("imgDrape").src = g.drapeHijau; }
  if (g.mawar) { $("imgMawar").src = g.mawar; }
  if (g.buket) { $("imgBuket").src = g.buket; }

  /* ---------- Kartu mempelai (pria kiri, wanita kanan, tumpang tindih) ---------- */
  function kartuMempelai(orang, kelas) {
    var foto = orang.foto
      ? '<img src="' + orang.foto + '" alt="Foto ' + orang.nama + '" data-inisial="' + orang.inisial + '">'
      : '<span class="inisial">' + orang.inisial + "</span>";
    var ig = orang.instagram
      ? '<a class="ig-link" href="https://instagram.com/' + orang.instagram + '" target="_blank" rel="noopener">Instagram @' + orang.instagram + "</a>"
      : "";
    var label = kelas === "pria" ? "MEMPELAI PRIA" : "MEMPELAI WANITA";
    return '<div class="person ' + kelas + '">'
      + '<p class="kicker" style="color:var(--burgundy)">' + label + "</p>"
      + '<div class="oval-frame">' + foto + "</div>"
      + '<p class="nama-panggilan">' + orang.nama + "</p>"
      + "<h3>" + orang.namaLengkap + "</h3>"
      + '<p class="ortu">' + orang.orangTua + "<br>" + orang.kota + "</p>"
      + ig
      + "</div>";
  }
  $("kartuMempelai").innerHTML =
    kartuMempelai(data.pria, "pria")
    + '<div class="dan-besar" aria-hidden="true">&amp;</div>'
    + kartuMempelai(data.wanita, "wanita");
  document.querySelectorAll(".person .oval-frame img").forEach(function (img) {
    img.addEventListener("error", function () {
      var frame = img.closest(".oval-frame");
      frame.innerHTML = '<span class="inisial">' + (img.getAttribute("data-inisial") || "?") + "</span>";
    });
  });

  /* ---------- Kalender bulan acara ---------- */
  (function bangunKalender() {
    var target = new Date(data.targetHitungMundur);
    var tahun = target.getFullYear();
    var bulan = target.getMonth(); // 0-based
    var hariTarget = target.getDate();
    var namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var hariAwal = (new Date(tahun, bulan, 1).getDay() + 6) % 7; // Senin = 0
    var jumlahHari = new Date(tahun, bulan + 1, 0).getDate();
    var html = '<div class="kalender-bulan">' + namaBulan[bulan] + " " + tahun + "</div>"
      + '<div class="kalender-grid">';
    ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"].forEach(function (h) {
      html += '<span class="hari">' + h + "</span>";
    });
    var i;
    for (i = 0; i < hariAwal; i++) { html += '<span class="tgl lain"></span>'; }
    for (i = 1; i <= jumlahHari; i++) {
      var kelas = i === hariTarget ? "tgl pilih" : "tgl";
      html += '<span class="' + kelas + '">' + i + "</span>";
    }
    var terisi = hariAwal + jumlahHari;
    var sisa = (7 - (terisi % 7)) % 7;
    for (i = 1; i <= sisa; i++) { html += '<span class="tgl lain">' + i + "</span>"; }
    html += "</div>";
    $("kalender").innerHTML = html;
    if (data.jamAkad) { $("jamAkad").textContent = data.jamAkad; }
  })();

  /* ---------- Countdown ---------- */
  var target = new Date(data.targetHitungMundur).getTime();
  function tick() {
    var diff = Math.max(0, target - Date.now());
    $("d").textContent = Math.floor(diff / 864e5);
    $("h").textContent = Math.floor(diff / 36e5) % 24;
    $("m").textContent = Math.floor(diff / 6e4) % 60;
    $("s").textContent = Math.floor(diff / 1e3) % 60;
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Save The Date (Google Calendar) ---------- */
  (function () {
    function fmtUTC(ms) {
      var d = new Date(ms);
      function p(n) { return String(n).padStart(2, "0"); }
      return d.getUTCFullYear() + p(d.getUTCMonth() + 1) + p(d.getUTCDate())
        + "T" + p(d.getUTCHours()) + p(d.getUTCMinutes()) + "00Z";
    }
    var mulai = target;
    var selesai = target + 6 * 36e5; // sampai 14.00 WIB
    var url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
      + "&text=" + encodeURIComponent("Pernikahan " + data.pria.nama + " & " + data.wanita.nama)
      + "&dates=" + fmtUTC(mulai) + "/" + fmtUTC(selesai)
      + "&details=" + encodeURIComponent("Baralek Gadang — " + data.pria.nama + " & " + data.wanita.nama)
      + "&location=" + encodeURIComponent(data.acara[0].tempat + ", " + data.acara[0].alamat);
    $("btnKalender").href = url;
  })();

  /* ---------- Lokasi ---------- */
  $("lokasiTempat").textContent = data.lokasi.tempat;
  $("lokasiAlamat").textContent = data.lokasi.alamat;
  $("btnMap").href = data.lokasi.maps;

  /* ---------- Rundown ---------- */
  $("daftarRundown").innerHTML = data.rundown.map(function (r) {
    return '<div class="rundown-item">'
      + '<span class="ikon" aria-hidden="true">' + r.ikon + "</span>"
      + '<div><div class="jam">' + r.jam + "</div>"
      + '<div class="judul">' + r.judul + "</div></div></div>";
  }).join("");

  /* ---------- Galeri scrapbook + lightbox ---------- */
  var fotoAda = data.galeri
    .map(function (item, i) { return { src: item.src, judul: item.judul, index: i }; })
    .filter(function (item) { return item.src; });

  $("daftarGaleri").innerHTML = data.galeri.map(function (item, i) {
    var lebar = i === 2 ? " lebar" : "";
    if (item.src) {
      return '<div class="tile' + lebar + '" data-galeri="' + i + '">'
        + '<img src="' + item.src + '" alt="' + item.judul + '" loading="lazy">'
        + '<span class="judul">' + item.judul + "</span></div>";
    }
    return '<div class="tile' + lebar + '" data-galeri="' + i + '">'
      + '<span class="judul">' + item.judul + "</span>"
      + '<span class="ganti">Tambahkan assets/galeri-' + String(i + 1).padStart(2, "0") + ".jpg<br>lalu isi src di js/data.js</span></div>";
  }).join("");

  document.querySelectorAll(".tile img").forEach(function (img) {
    img.addEventListener("error", function () {
      var tile = img.closest(".tile");
      tile.setAttribute("data-rusak", "1");
      tile.innerHTML = '<span class="judul">Foto</span>'
        + '<span class="ganti">File tidak ditemukan — periksa src di js/data.js</span>';
    });
  });

  var lbIndex = 0;
  function tampilLightbox() {
    var f = fotoAda[lbIndex];
    $("lbGambar").src = f.src;
    $("lbGambar").alt = f.judul;
    $("lbCaption").textContent = f.judul;
    $("lbCounter").textContent = (lbIndex + 1) + " / " + fotoAda.length;
  }
  function bukaLightbox(i) {
    var item = data.galeri[i];
    var tiles = document.querySelectorAll('[data-galeri="' + i + '"]');
    var rusak = false;
    tiles.forEach(function (t) { if (t.getAttribute("data-rusak")) { rusak = true; } });
    if (rusak) { toast("File foto ini tidak ditemukan — periksa src di js/data.js"); return; }
    if (!item.src) {
      toast("Slot foto ini masih kosong — tambahkan assets/galeri-" + String(i + 1).padStart(2, "0") + ".jpg");
      return;
    }
    lbIndex = fotoAda.findIndex(function (f) { return f.index === i; });
    tampilLightbox();
    $("lightbox").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  function tutupLightbox() {
    $("lightbox").classList.add("hidden");
    document.body.style.overflow = "";
  }
  document.addEventListener("click", function (e) {
    var tile = e.target.closest("[data-galeri]");
    if (tile) { bukaLightbox(Number(tile.getAttribute("data-galeri"))); }
  });
  $("lbTutup").addEventListener("click", tutupLightbox);
  $("lightbox").addEventListener("click", function (e) {
    if (e.target === this) { tutupLightbox(); }
  });
  $("lbPrev").addEventListener("click", function () {
    lbIndex = (lbIndex - 1 + fotoAda.length) % fotoAda.length;
    tampilLightbox();
  });
  $("lbNext").addEventListener("click", function () {
    lbIndex = (lbIndex + 1) % fotoAda.length;
    tampilLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if ($("lightbox").classList.contains("hidden")) { return; }
    if (e.key === "Escape") { tutupLightbox(); }
    if (e.key === "ArrowLeft") { $("lbPrev").click(); }
    if (e.key === "ArrowRight") { $("lbNext").click(); }
  });

  /* ---------- Amplop digital + tab gift ---------- */
  function itemAmplop(label, nomor, nama) {
    var qrText = label + " " + nomor + " a.n. " + nama;
    return '<div class="amplop-item"><div>'
      + '<div class="label">' + label + "</div>"
      + '<div class="nomor">' + nomor + "</div>"
      + '<div class="nama">a.n. ' + nama + "</div></div>"
      + '<div class="aksi">'
      + '<button class="btn kecil" data-salin="' + nomor + '">Copy</button>'
      + '<button class="btn kecil ghost" data-qr="' + qrText + '" data-qr-label="' + label + '">SHOW QR</button>'
      + "</div></div>";
  }
  var amplopHtml = "";
  data.amplop.bank.forEach(function (b) {
    amplopHtml += itemAmplop(b.bank, b.nomor, b.atasNama);
  });
  data.amplop.ewallet.forEach(function (w) {
    amplopHtml += itemAmplop(w.layanan, w.nomor, w.atasNama);
  });
  $("daftarAmplop").innerHTML = amplopHtml;
  $("alamatKado").textContent = data.amplop.alamatKado;

  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("aktif"); });
      btn.classList.add("aktif");
      var tab = btn.getAttribute("data-tab");
      $("tabTransfer").classList.toggle("hidden", tab !== "transfer");
      $("tabKado").classList.toggle("hidden", tab !== "kado");
    });
  });

  /* ---------- Modal QR ---------- */
  function bukaQr(teks, label) {
    $("qrJudul").textContent = "QR " + label;
    $("qrDetail").textContent = teks;
    $("qrBox").innerHTML = "";
    $("qrFallback").classList.add("hidden");
    if (window.QRCode) {
      try {
        new window.QRCode($("qrBox"), { text: teks, width: 180, height: 180 });
      } catch (e) {
        $("qrFallback").classList.remove("hidden");
      }
    } else {
      $("qrFallback").classList.remove("hidden");
    }
    $("qrModal").classList.remove("hidden");
  }
  function tutupQr() { $("qrModal").classList.add("hidden"); }
  $("qrTutup").addEventListener("click", tutupQr);
  $("qrModal").addEventListener("click", function (e) {
    if (e.target === this) { tutupQr(); }
  });

  /* ---------- Tombol salin & QR (delegasi) ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-salin]");
    if (btn) {
      salinTeks(btn.getAttribute("data-salin"), btn, "Nomor tersalin!");
      return;
    }
    var btnTarget = e.target.closest("[data-salin-target]");
    if (btnTarget) {
      var targetEl = $(btnTarget.getAttribute("data-salin-target"));
      if (targetEl) { salinTeks(targetEl.textContent.trim(), btnTarget, "Alamat tersalin!"); }
      return;
    }
    var btnQr = e.target.closest("[data-qr]");
    if (btnQr) {
      bukaQr(btnQr.getAttribute("data-qr"), btnQr.getAttribute("data-qr-label"));
    }
  });

  /* ---------- Buku tamu ---------- */
  function buatUcapan(nama, hadir, isi) {
    var wrap = document.createElement("div");
    wrap.className = "ucapan";
    var kepala = document.createElement("div");
    kepala.className = "kepala";
    var namaEl = document.createElement("span");
    namaEl.className = "nama";
    namaEl.textContent = nama;
    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = hadir;
    kepala.appendChild(namaEl);
    kepala.appendChild(badge);
    wrap.appendChild(kepala);
    if (isi) {
      var p = document.createElement("p");
      p.textContent = isi;
      wrap.appendChild(p);
    }
    if (waktu) {
      var waktuEl = document.createElement("span");
      waktuEl.className = "waktu";
      waktuEl.textContent = waktu;
      kepala.appendChild(waktuEl);
    }
    return wrap;
  }

  /* ---------- Buku Tamu & RSVP (Cloudflare D1 + LocalStorage) ---------- */
  var urlParams = new URLSearchParams(window.location.search);
  var EVENT_SLUG = urlParams.get("event") || data.slug || (
    (data.pria && data.pria.nama ? data.pria.nama : "pria") + "-" +
    (data.wanita && data.wanita.nama ? data.wanita.nama : "wanita")
  ).toLowerCase().replace(/[^a-z0-9]+/g, "-");

  var TEMA_SLUG = "velvet-overture";
  var STORAGE_KEY = "saranwak_" + EVENT_SLUG + "_" + TEMA_SLUG + "_ucapan";

  function ambilLokal() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function simpanLokal(item) {
    try {
      var arr = ambilLokal();
      arr.unshift(item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, 50)));
    } catch (e) {}
  }

  function kirimUcapanKeD1(item) {
    try {
      fetch("/api/ucapan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: EVENT_SLUG,
          tema: TEMA_SLUG,
          nama: item.nama,
          hadir: item.hadir,
          isi: item.isi
        })
      }).catch(function () {});
    } catch (e) {}
  }

  var daftarUcapan = $("daftarUcapan");
  function perbaruiStatBadge() {
    var badge = $("rsvpStatBadge");
    if (!badge) return;
    var semua = ambilLokal().concat(data.ucapanContoh);
    var hadir = semua.filter(function (u) {
      var h = (u.hadir || "").toLowerCase();
      return h.includes("hadir") && !h.includes("tidak");
    }).length;
    badge.textContent = "✓ " + hadir + " Tamu Mengonfirmasi Hadir";
  }

  function muatSemuaUcapan() {
    daftarUcapan.innerHTML = "";
    var lokal = ambilLokal();
    var gabungan = lokal.concat(data.ucapanContoh);
    gabungan.forEach(function (u) {
      daftarUcapan.appendChild(buatUcapan(u.nama, u.hadir, u.isi, u.waktu));
    });
    perbaruiStatBadge();
  }
  muatSemuaUcapan();

  // Fetch live wishes from Cloudflare D1
  function muatUcapanD1() {
    fetch("/api/ucapan?event=" + encodeURIComponent(EVENT_SLUG) + "&tema=" + encodeURIComponent(TEMA_SLUG))
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          daftarUcapan.innerHTML = "";
          var gabungan = res.data.concat(data.ucapanContoh);
          gabungan.forEach(function (u) {
            daftarUcapan.appendChild(buatUcapan(u.nama, u.hadir, u.isi, u.waktu));
          });
          perbaruiStatBadge();
        }
      })
      .catch(function () {});
  }
  muatUcapanD1();

  /* ---------- Form RSVP ---------- */
  $("formRsvp").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = $("rsvpNama").value.trim();
    if (!nama) { return; }
    var hadir = "Hadir";
    var radio = document.querySelector('input[name="rsvpHadir"]:checked');
    if (radio) { hadir = radio.value; }
    var jumlah = $("rsvpJumlah").value;
    var ucapan = $("rsvpUcapan").value.trim();
    var label = hadir === "Hadir" ? "HADIR · " + jumlah.toUpperCase() : "TIDAK HADIR";
    var waktuStr = "Baru saja";
    var item = { nama: nama, hadir: label, isi: ucapan, waktu: waktuStr };
    simpanLokal(item);
    kirimUcapanKeD1(item);
    daftarUcapan.prepend(buatUcapan(nama, label, ucapan, waktuStr));
    perbaruiStatBadge();
    $("rsvpOk").classList.remove("hidden");

    var waWrap = $("rsvpWaWrap");
    if (waWrap) {
      var waPhone = data.whatsapp || "6281234567890";
      var waMsg = "Halo " + data.pria.nama + " & " + data.wanita.nama + ",\n"
        + "Saya *" + nama + "* mengonfirmasi kehadiran untuk acara pernikahan kalian:\n"
        + "Status: *" + label + "*\n"
        + (ucapan ? "Ucapan: \"" + ucapan + "\"\n" : "")
        + "\nTerima kasih!";
      var waUrl = "https://api.whatsapp.com/send?phone=" + waPhone + "&text=" + encodeURIComponent(waMsg);
      waWrap.innerHTML = '<a class="btn-wa-konfirmasi" href="' + waUrl + '" target="_blank" rel="noopener">💬 Kirim Konfirmasi ke WhatsApp Mempelai</a>';
      waWrap.classList.remove("hidden");
    }

    this.reset();
    toast("Terima kasih, " + nama + "! Konfirmasi Anda tercatat di buku tamu.");
  });

  /* ---------- Form Ucapan ---------- */
  $("formUcapan").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = $("ucapanNama").value.trim() || "Tamu Undangan";
    var isi = $("ucapanIsi").value.trim();
    if (!isi) { return; }
    var waktuStr = "Baru saja";
    var item = { nama: nama, hadir: "Doa", isi: isi, waktu: waktuStr };
    simpanLokal(item);
    kirimUcapanKeD1(item);
    daftarUcapan.prepend(buatUcapan(nama, "Doa", isi, waktuStr));
    $("ucapanIsi").value = "";
    toast("Terima kasih, " + nama + "! Ucapanmu sudah tampil di buku tamu.");
  });

  /* ---------- Music player (melodi sintesis WebAudio) ---------- */
  var LAGU = [
    { judul: "Melodi 1 — Langgam Cinta", nada: [[72, 1], [76, 1], [79, 1], [81, 2], [79, 1], [76, 1], [74, 1], [76, 2], [72, 2], [67, 1], [72, 2]] },
    { judul: "Melodi 2 — Senja di Padang", nada: [[69, 1], [72, 1], [76, 1], [74, 1], [72, 2], [69, 1], [67, 1], [69, 2], [64, 1], [67, 2]] },
    { judul: "Melodi 3 — Baralek", nada: [[67, 1], [71, 1], [74, 1], [76, 1], [74, 1], [71, 1], [69, 1], [67, 2], [62, 1], [67, 2]] }
  ];
  var KETUK = 0.55; // detik per ketuk
  var laguIndex = 0;
  var sedangMain = false;
  var ctxAudio = null;
  var timerJadwal = null;
  var timerProgress = null;
  var indeksNada = 0;
  var waktuNadaBerikut = 0;
  var waktuMulaiLoop = 0;
  var durasiLoop = 0;

  function midiKeFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function totalKetuk(lagu) {
    var total = 0;
    lagu.nada.forEach(function (n) { total += n[1]; });
    return total;
  }
  function bunyikan(midi, waktu, durasi) {
    var osc = ctxAudio.createOscillator();
    var osc2 = ctxAudio.createOscillator();
    var gain = ctxAudio.createGain();
    var gain2 = ctxAudio.createGain();
    osc.type = "sine";
    osc.frequency.value = midiKeFreq(midi);
    osc2.type = "triangle";
    osc2.frequency.value = midiKeFreq(midi) * 2;
    gain.gain.setValueAtTime(0.0001, waktu);
    gain.gain.exponentialRampToValueAtTime(0.22, waktu + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, waktu + durasi * 1.8);
    gain2.gain.setValueAtTime(0.0001, waktu);
    gain2.gain.exponentialRampToValueAtTime(0.05, waktu + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, waktu + durasi * 1.5);
    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctxAudio.destination);
    gain2.connect(ctxAudio.destination);
    osc.start(waktu);
    osc2.start(waktu);
    osc.stop(waktu + durasi * 2);
    osc2.stop(waktu + durasi * 2);
  }
  function jadwalkan() {
    if (!ctxAudio || !sedangMain) { return; }
    var lagu = LAGU[laguIndex];
    while (waktuNadaBerikut < ctxAudio.currentTime + 0.6) {
      var n = lagu.nada[indeksNada % lagu.nada.length];
      bunyikan(n[0], Math.max(waktuNadaBerikut, ctxAudio.currentTime + 0.02), n[1] * KETUK);
      waktuNadaBerikut += n[1] * KETUK;
      indeksNada++;
      if (indeksNada % lagu.nada.length === 0) { waktuMulaiLoop = waktuNadaBerikut - durasiLoop; }
    }
  }
  function perbaruiProgress() {
    if (!ctxAudio || !sedangMain) { return; }
    var jalan = (ctxAudio.currentTime - waktuMulaiLoop) % durasiLoop;
    if (jalan < 0) { jalan += durasiLoop; }
    var persen = Math.min(100, Math.max(0, (jalan / durasiLoop) * 100));
    $("progressBar").style.width = persen + "%";
    $("progressDot").style.left = persen + "%";
  }
  function mulaiLagu(index) {
    laguIndex = (index + LAGU.length) % LAGU.length;
    $("judulLagu").textContent = LAGU[laguIndex].judul;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      toast("Peramban ini tidak mendukung audio WebAudio.");
      return;
    }
    if (!ctxAudio) { ctxAudio = new AC(); }
    if (ctxAudio.resume) { ctxAudio.resume(); }
    durasiLoop = totalKetuk(LAGU[laguIndex]) * KETUK;
    indeksNada = 0;
    waktuNadaBerikut = ctxAudio.currentTime + 0.1;
    waktuMulaiLoop = waktuNadaBerikut;
    sedangMain = true;
    $("btnPlay").textContent = "❚❚";
    perbaruiStatusFloatingMusik(true);
    clearInterval(timerJadwal);
    clearInterval(timerProgress);
    timerJadwal = setInterval(jadwalkan, 200);
    timerProgress = setInterval(perbaruiProgress, 400);
    jadwalkan();
  }
  function jedaLagu() {
    sedangMain = false;
    clearInterval(timerJadwal);
    clearInterval(timerProgress);
    if (ctxAudio && ctxAudio.suspend) { ctxAudio.suspend(); }
    $("btnPlay").textContent = "▶";
    perbaruiStatusFloatingMusik(false);
  }

  function perbaruiStatusFloatingMusik(aktif) {
    var btn = $("musicFloatingBtn");
    var icon = $("musicIcon");
    if (!btn || !icon) return;
    if (aktif) {
      icon.classList.add("spin");
      icon.textContent = "♫";
      btn.setAttribute("aria-label", "Jeda Musik");
    } else {
      icon.classList.remove("spin");
      icon.textContent = "▶";
      btn.setAttribute("aria-label", "Putar Musik");
    }
  }

  var btnFloat = $("musicFloatingBtn");
  if (btnFloat) {
    btnFloat.addEventListener("click", function () {
      if (sedangMain) {
        jedaLagu();
        toast("Musik dijeda");
      } else {
        mulaiLagu(laguIndex);
        toast("Memutar musik latar ♫");
      }
    });
  }

  $("btnPlay").addEventListener("click", function () {
    if (sedangMain) { jedaLagu(); }
    else { mulaiLagu(laguIndex); }
  });
  $("btnNext").addEventListener("click", function () {
    if (sedangMain) { mulaiLagu(laguIndex + 1); }
    else {
      laguIndex = (laguIndex + 1) % LAGU.length;
      $("judulLagu").textContent = LAGU[laguIndex].judul;
    }
  });
  $("btnPrev").addEventListener("click", function () {
    if (sedangMain) { mulaiLagu(laguIndex - 1); }
    else {
      laguIndex = (laguIndex - 1 + LAGU.length) % LAGU.length;
      $("judulLagu").textContent = LAGU[laguIndex].judul;
    }
  });

  /* ---------- Bottom Dock Active Tracking ---------- */
  var dockItems = document.querySelectorAll(".dock-item");
  var sections = document.querySelectorAll("main section[id], header.cover");
  if ("IntersectionObserver" in window) {
    var dockObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          dockItems.forEach(function (di) {
            di.classList.toggle("active", di.getAttribute("data-nav") === id || di.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(function (s) { dockObs.observe(s); });
  }

  /* ---------- Animasi muncul saat scroll (fadeInUp) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("tampil");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("tampil"); });
  }
})();

/* ============================================================
   LOGIKA UNDANGAN — BATAKNESE · BUDI & SANTI
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

  /* ---------- Nama tamu dari ?to= ---------- */
  var params = new URLSearchParams(window.location.search);
  var namaTamu = params.get("to") || "Tamu Undangan";
  $("namaTamu").textContent = namaTamu;
  $("qrNamaTamu").textContent = namaTamu;
  var un = $("ucapanNama");
  if (un) { un.value = params.get("to") || ""; }

  /* ---------- Nama & tanggal di seluruh halaman ---------- */
  document.querySelectorAll('[data-nama="pria"]').forEach(function (el) {
    el.textContent = data.pria.nama;
  });
  document.querySelectorAll('[data-nama="wanita"]').forEach(function (el) {
    el.textContent = data.wanita.nama;
  });
  document.querySelectorAll("[data-tanggal]").forEach(function (el) {
    el.textContent = data.tanggalTampil;
  });
  document.querySelectorAll("[data-tanggal-singkat]").forEach(function (el) {
    el.textContent = data.tanggalSingkat;
  });
  document.title = data.pria.nama + " & " + data.wanita.nama + " — Bataknese · Undangan Pernikahan";

  /* ---------- Gambar dari data.js ---------- */
  var g = data.gambar || {};
  if (g.cover) { $("coverBg").src = g.cover; }
  if (g.fotoKiri) { $("fotoKiri").src = g.fotoKiri; }
  if (g.heroPerkamen) { $("imgPerkamen").src = g.heroPerkamen; }
  if (g.pasanganJendela) { $("imgJendela").src = g.pasanganJendela; $("fotoPenutup").src = g.pasanganJendela; }

  /* ---------- Kartu mempelai ---------- */
  function kartuMempelai(orang) {
    var foto = orang.foto
      ? '<img src="' + orang.foto + '" alt="Foto ' + orang.nama + '" data-inisial="' + orang.inisial + '">'
      : '<span class="inisial">' + orang.inisial + "</span>";
    var ig = orang.instagram
      ? '<a class="ig-link" href="https://instagram.com/' + orang.instagram + '" target="_blank" rel="noopener">Instagram @' + orang.instagram + "</a>"
      : "";
    return '<div class="person">'
      + '<div class="arch-frame">' + foto + "</div>"
      + '<p class="nama-panggilan">' + orang.nama + "</p>"
      + "<h3>" + orang.namaLengkap + "</h3>"
      + '<p class="ortu">' + orang.orangTua + "<br>" + orang.kota + "</p>"
      + ig
      + "</div>";
  }
  $("kartuMempelai").innerHTML =
    kartuMempelai(data.pria)
    + '<div class="dan-besar" aria-hidden="true">&amp;</div>'
    + kartuMempelai(data.wanita);
  document.querySelectorAll(".person .arch-frame img").forEach(function (img) {
    img.addEventListener("error", function () {
      var frame = img.closest(".arch-frame");
      frame.innerHTML = '<span class="inisial">' + (img.getAttribute("data-inisial") || "?") + "</span>";
    });
  });

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

  /* ---------- Acara ---------- */
  $("daftarAcara").innerHTML = data.acara.map(function (a) {
    var hari = a.tanggal.split(",")[0];
    return '<div class="kartu-acara">'
      + '<p class="hari">' + hari + "</p>"
      + "<h3>" + a.nama + "</h3>"
      + '<p class="jam">' + a.jam + "</p>"
      + "<p>" + a.tanggal + "</p>"
      + '<p class="tempat">' + a.tempat + "</p>"
      + '<p class="alamat">' + a.alamat + "</p>"
      + '<p><a class="btn kecil" href="' + a.maps + '" target="_blank" rel="noopener">Petunjuk arah</a></p>'
      + "</div>";
  }).join("");

  /* ---------- Live streaming ---------- */
  $("liveKet").textContent = data.live.keterangan;
  $("btnJoinLive").addEventListener("click", function () {
    if (data.live.tautan) {
      window.open(data.live.tautan, "_blank", "noopener");
    } else {
      $("livePesan").classList.remove("hidden");
      toast("Tautan live streaming akan dibagikan menjelang hari-H.");
    }
  });

  /* ---------- Kisah Kita ---------- */
  $("daftarKisah").innerHTML = data.kisah.map(function (k) {
    return '<div class="kisah-item">'
      + '<span class="tahun">' + k.tahun + "</span>"
      + "<h3>" + k.judul + "</h3><p>" + k.isi + "</p></div>";
  }).join("");

  /* ---------- Galeri + lightbox ---------- */
  var fotoAda = data.galeri
    .map(function (item, i) { return { src: item.src, judul: item.judul, index: i }; })
    .filter(function (item) { return item.src; });

  $("daftarGaleri").innerHTML = data.galeri.map(function (item, i) {
    if (item.src) {
      return '<div class="tile" data-galeri="' + i + '">'
        + '<img src="' + item.src + '" alt="' + item.judul + '" loading="lazy">'
        + '<span class="judul">' + item.judul + "</span></div>";
    }
    return '<div class="tile" data-galeri="' + i + '">'
      + '<span class="ganti">' + item.judul + "<br>Tambahkan assets/galeri-" + String(i + 1).padStart(2, "0") + ".jpg</span></div>";
  }).join("");

  document.querySelectorAll(".tile img").forEach(function (img) {
    img.addEventListener("error", function () {
      var tile = img.closest(".tile");
      tile.setAttribute("data-rusak", "1");
      tile.innerHTML = '<span class="ganti">File tidak ditemukan — periksa src di js/data.js</span>';
    });
  });

  var lbIndex = 0;
  function tampilLightbox() {
    var f = fotoAda[lbIndex];
    var img = $("lbGambar");
    img.src = f.src;
    img.alt = f.judul;
    img.classList.remove("zoom");
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
  $("lbZoom").addEventListener("click", function () {
    $("lbGambar").classList.toggle("zoom");
  });
  $("lbFull").addEventListener("click", function () {
    var el = document.documentElement;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) { document.exitFullscreen(); }
    } else if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  });
  $("lbShare").addEventListener("click", function () {
    salinTeks(window.location.href, null, "Tautan undangan tersalin!");
  });
  document.addEventListener("keydown", function (e) {
    if ($("lightbox").classList.contains("hidden")) { return; }
    if (e.key === "Escape") { tutupLightbox(); }
    if (e.key === "ArrowLeft") { $("lbPrev").click(); }
    if (e.key === "ArrowRight") { $("lbNext").click(); }
  });

  /* ---------- Drawer (Gift & QR) ---------- */
  function bukaDrawer(id, backdropId) {
    $(id).classList.add("buka");
    $(backdropId).classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  function tutupDrawer(id, backdropId) {
    $(id).classList.remove("buka");
    $(backdropId).classList.add("hidden");
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-tutup]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-tutup");
      tutupDrawer(id, id === "drawerGift" ? "backdropGift" : "backdropQr");
    });
  });
  $("backdropGift").addEventListener("click", function () { tutupDrawer("drawerGift", "backdropGift"); });
  $("backdropQr").addEventListener("click", function () { tutupDrawer("drawerQr", "backdropQr"); });

  /* ---------- Amplop digital (drawer Gift) ---------- */
  function itemAmplop(label, nomor, nama) {
    return '<div class="amplop-item"><div>'
      + '<div class="label">' + label + "</div>"
      + '<div class="nomor">' + nomor + "</div>"
      + '<div class="nama">a.n. ' + nama + "</div></div>"
      + '<button class="btn kecil" data-salin="' + nomor + '">Salin</button></div>';
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

  $("btnBukaGift").addEventListener("click", function () {
    bukaDrawer("drawerGift", "backdropGift");
  });

  /* ---------- Gift Confirm ---------- */
  $("formGift").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = $("giftNama").value.trim();
    if (!nama) {
      toast("Mohon isi Nama Pengirim dulu.");
      return;
    }
    $("giftOk").classList.remove("hidden");
    this.reset();
    toast("Terima kasih, " + nama + "! Konfirmasi pengiriman Anda tercatat.");
  });

  /* ---------- Tombol salin (delegasi) ---------- */
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
    }
  });

  /* ---------- QR Check-in (drawer) ---------- */
  function urlUndangan() {
    try {
      var u = new URL(window.location.href);
      u.searchParams.set("to", namaTamu);
      return u.toString();
    } catch (err) {
      return window.location.href;
    }
  }
  function renderQr() {
    $("qrBox").innerHTML = "";
    $("qrFallback").classList.add("hidden");
    if (window.QRCode) {
      try {
        new window.QRCode($("qrBox"), { text: urlUndangan(), width: 164, height: 164 });
      } catch (e) {
        $("qrFallback").classList.remove("hidden");
      }
    } else {
      $("qrFallback").classList.remove("hidden");
    }
  }
  $("btnBukaQr").addEventListener("click", function () {
    renderQr();
    bukaDrawer("drawerQr", "backdropQr");
  });
  $("btnDownloadQr").addEventListener("click", function () {
    try {
      var canvas = $("qrBox").querySelector("canvas");
      var img = $("qrBox").querySelector("img");
      var href = "";
      if (canvas && canvas.toDataURL) { href = canvas.toDataURL("image/png"); }
      else if (img) { href = img.src; }
      if (!href) {
        toast("QR belum tergambar — coba buka drawer QR sekali lagi.");
        return;
      }
      var a = document.createElement("a");
      a.href = href;
      a.download = "qr-checkin-" + data.pria.nama + "-" + data.wanita.nama + ".png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast("QR check-in berhasil diunduh.");
    } catch (e) {
      toast("Unduhan gagal di peramban ini — silakan screenshot QR-nya.");
    }
  });

  /* ---------- Upload Foto (Sharing Memories) ---------- */
  $("btnUploadFoto").addEventListener("click", function () {
    $("inputFoto").click();
  });
  $("inputFoto").addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
      $("uploadOk").classList.remove("hidden");
      toast("Terima kasih! Foto \"" + this.files[0].name + "\" sudah dipilih.");
    }
  });

  /* ---------- Buku tamu + paginasi (Cloudflare D1 + LocalStorage) ---------- */
  var urlParams = new URLSearchParams(window.location.search);
  var EVENT_SLUG = urlParams.get("event") || data.slug || (
    (data.pria && data.pria.nama ? data.pria.nama : "pria") + "-" +
    (data.wanita && data.wanita.nama ? data.wanita.nama : "wanita")
  ).toLowerCase().replace(/[^a-z0-9]+/g, "-");

  var TEMA_SLUG = "bataknese";
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

  var PER_HALAMAN = 5;
  var semuaUcapan = ambilLokal().concat(data.ucapanContoh);
  var halamanAktif = 1;

  // Live sync from Cloudflare D1
  function muatUcapanD1() {
    fetch("/api/ucapan?event=" + encodeURIComponent(EVENT_SLUG) + "&tema=" + encodeURIComponent(TEMA_SLUG))
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          semuaUcapan = res.data.concat(data.ucapanContoh);
          tampilkanHalaman(1);
        }
      })
      .catch(function () {});
  }
  muatUcapanD1();

  function buatUcapan(nama, hadir, isi, waktu) {
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
    if (waktu) {
      var waktuEl = document.createElement("span");
      waktuEl.className = "waktu";
      waktuEl.textContent = waktu;
      kepala.appendChild(waktuEl);
    }
    wrap.appendChild(kepala);
    if (isi) {
      var p = document.createElement("p");
      p.textContent = isi;
      wrap.appendChild(p);
    }
    return wrap;
  }
  function totalHalaman() {
    return Math.max(1, Math.ceil(semuaUcapan.length / PER_HALAMAN));
  }
  function perbaruiStatBadge() {
    var badge = $("rsvpStatBadge");
    if (!badge) return;
    var hadir = semuaUcapan.filter(function (u) {
      var h = (u.hadir || "").toLowerCase();
      return h.includes("hadir") && !h.includes("tidak");
    }).length;
    badge.textContent = "✓ " + hadir + " Tamu Mengonfirmasi Hadir";
  }

  function tampilkanHalaman(halaman) {
    halamanAktif = Math.min(Math.max(1, halaman), totalHalaman());
    var daftar = $("daftarUcapan");
    daftar.innerHTML = "";
    var mulai = (halamanAktif - 1) * PER_HALAMAN;
    semuaUcapan.slice(mulai, mulai + PER_HALAMAN).forEach(function (u) {
      daftar.appendChild(buatUcapan(u.nama, u.hadir, u.isi, u.waktu));
    });
    $("pageInfo").textContent = halamanAktif + " / " + totalHalaman();
    $("pagePrev").disabled = halamanAktif <= 1;
    $("pageNext").disabled = halamanAktif >= totalHalaman();
    perbaruiStatBadge();
  }
  $("pagePrev").addEventListener("click", function () { tampilkanHalaman(halamanAktif - 1); });
  $("pageNext").addEventListener("click", function () { tampilkanHalaman(halamanAktif + 1); });
  tampilkanHalaman(1);

  /* ---------- Form RSVP ---------- */
  $("formRsvp").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = $("rsvpNama").value.trim();
    if (!nama) { return; }
    var hadir = $("rsvpHadir").value;
    var jumlah = $("rsvpJumlah").value;
    var label = hadir === "Hadir" ? "HADIR · " + jumlah.toUpperCase() : "TIDAK HADIR";
    var waktuStr = "Baru saja";
    var item = { nama: nama, hadir: label, isi: "", waktu: waktuStr };
    simpanLokal(item);
    kirimUcapanKeD1(item);
    semuaUcapan.unshift(item);
    tampilkanHalaman(1);
    $("rsvpOk").classList.remove("hidden");

    var waWrap = $("rsvpWaWrap");
    if (waWrap) {
      var waPhone = data.whatsapp || "6281234567890";
      var waMsg = "Halo " + data.pria.nama + " & " + data.wanita.nama + ",\n"
        + "Saya *" + nama + "* mengonfirmasi kehadiran untuk acara pernikahan kalian:\n"
        + "Status: *" + label + "*\n\n"
        + "Horas & Terima kasih!";
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
    semuaUcapan.unshift(item);
    tampilkanHalaman(1);
    $("ucapanIsi").value = "";
    toast("Terima kasih, " + nama + "! Ucapanmu sudah tampil di buku tamu.");
  });

  /* ---------- Musik (melodi sintesis WebAudio) ---------- */
  var MELODI = [[69, 1], [72, 1], [76, 1], [74, 1], [72, 2], [69, 1], [67, 1], [69, 2], [64, 1], [67, 2]];
  var KETUK = 0.55;
  var ctxAudio = null;
  var sedangMain = false;
  var timerJadwal = null;
  var indeksNada = 0;
  var waktuNadaBerikut = 0;

  function midiKeFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function bunyikan(midi, waktu, durasi) {
    var osc = ctxAudio.createOscillator();
    var gain = ctxAudio.createGain();
    osc.type = "sine";
    osc.frequency.value = midiKeFreq(midi);
    gain.gain.setValueAtTime(0.0001, waktu);
    gain.gain.exponentialRampToValueAtTime(0.2, waktu + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, waktu + durasi * 1.8);
    osc.connect(gain);
    gain.connect(ctxAudio.destination);
    osc.start(waktu);
    osc.stop(waktu + durasi * 2);
  }
  function jadwalkan() {
    if (!ctxAudio || !sedangMain) { return; }
    while (waktuNadaBerikut < ctxAudio.currentTime + 0.6) {
      var n = MELODI[indeksNada % MELODI.length];
      bunyikan(n[0], Math.max(waktuNadaBerikut, ctxAudio.currentTime + 0.02), n[1] * KETUK);
      waktuNadaBerikut += n[1] * KETUK;
      indeksNada++;
    }
  }
  function mulaiMusik() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      toast("Peramban ini tidak mendukung audio WebAudio.");
      return;
    }
    if (!ctxAudio) { ctxAudio = new AC(); }
    if (ctxAudio.resume) { ctxAudio.resume(); }
    indeksNada = 0;
    waktuNadaBerikut = ctxAudio.currentTime + 0.1;
    sedangMain = true;
    var icon = $("musicIcon");
    if (icon) { icon.classList.add("spin"); icon.textContent = "♫"; }
    $("btnMusik").setAttribute("aria-label", "Jeda Musik");
    clearInterval(timerJadwal);
    timerJadwal = setInterval(jadwalkan, 200);
    jadwalkan();
  }
  function jedaMusik() {
    sedangMain = false;
    clearInterval(timerJadwal);
    if (ctxAudio && ctxAudio.suspend) { ctxAudio.suspend(); }
    var icon = $("musicIcon");
    if (icon) { icon.classList.remove("spin"); icon.textContent = "▶"; }
    $("btnMusik").setAttribute("aria-label", "Putar Musik");
  }
  $("btnMusik").addEventListener("click", function () {
    if (sedangMain) { jedaMusik(); toast("Musik dijeda"); }
    else { mulaiMusik(); toast("Memutar musik latar ♫"); }
  });

  /* ---------- Buka undangan ---------- */
  $("btnBuka").addEventListener("click", function () {
    var cover = $("cover");
    cover.classList.add("hilang");
    setTimeout(function () { cover.style.display = "none"; }, 900);
    var dock = $("bottomDock");
    if (dock) { dock.classList.remove("hidden"); }
    var target = $("saveTheDate");
    if (target && target.scrollIntoView) { target.scrollIntoView({ behavior: "smooth" }); }
    mulaiMusik();
  });

  /* ---------- Bottom Dock Active Tracking ---------- */
  var dockItems = document.querySelectorAll(".dock-item");
  var sections = document.querySelectorAll("main section[id], #saveTheDate, #hero");
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
    }, { threshold: 0.25 });
    sections.forEach(function (s) { dockObs.observe(s); });
  }

  /* ---------- Animasi muncul saat scroll ---------- */
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

/* ============================================================
   LOGIKA UNDANGAN — ART MINANG 3 · BUDI & SANTI
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
  var un = $("ucapanNama");
  if (un) { un.value = namaTamu; }
  var qrn = $("qrNamaTamu");
  if (qrn) { qrn.textContent = namaTamu; }

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
  document.querySelectorAll("[data-kota]").forEach(function (el) {
    el.textContent = data.kotaAcara;
  });
  document.title = data.pria.nama + " & " + data.wanita.nama + " — Art Minang 3 · Undangan Pernikahan";

  /* ---------- Gambar latar dari data.js ---------- */
  var g = data.gambar || {};
  if (g.hero) { $("heroCover").src = g.hero; $("heroUtama").src = g.hero; }
  if (g.suntiang) { $("bgSuntiang").src = g.suntiang; }
  if (g.dedaunan) { $("bgDedaunan").src = g.dedaunan; }
  if (g.liveStreaming) { $("bgLive").src = g.liveStreaming; }
  if (g.fasad) { $("bgFasad").src = g.fasad; }
  if (g.kainMarun) { $("bgKain").src = g.kainMarun; }
  if (g.ikonRumahGadang) {
    document.querySelectorAll(".gonjong-icon").forEach(function (img) { img.src = g.ikonRumahGadang; });
  }

  /* ---------- Kartu mempelai (wanita dulu, seperti aslinya) ---------- */
  function kartuMempelai(orang) {
    var foto = orang.foto
      ? '<img src="' + orang.foto + '" alt="Foto ' + orang.nama + '" data-inisial="' + orang.inisial + '">'
      : '<span class="inisial">' + orang.inisial + "</span>"
        + '<span class="ganti">Foto mempelai — tambahkan ke folder assets/ lalu isi di js/data.js</span>';
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
  $("kartuMempelai").innerHTML = kartuMempelai(data.wanita) + kartuMempelai(data.pria);
  // Kalau file foto mempelai tidak ditemukan, kembali ke inisial (bukan gambar rusak).
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
    var mulai = target;                 // 08.00 WIB
    var selesai = target + 6 * 36e5;    // sampai 14.00 WIB
    var url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
      + "&text=" + encodeURIComponent("Pernikahan " + data.pria.nama + " & " + data.wanita.nama)
      + "&dates=" + fmtUTC(mulai) + "/" + fmtUTC(selesai)
      + "&details=" + encodeURIComponent("Baralek Gadang — " + data.pria.nama + " & " + data.wanita.nama)
      + "&location=" + encodeURIComponent(data.acara[0].tempat + ", " + data.acara[0].alamat);
    $("btnKalender").href = url;
  })();

  /* ---------- Acara ---------- */
  $("daftarAcara").innerHTML = data.acara.map(function (a) {
    return '<div class="arch-card">'
      + '<span class="pin">⌖</span>'
      + "<h3>" + a.nama + "</h3>"
      + '<p class="jam">' + a.jam + "</p>"
      + "<p>" + a.tanggal + "<br>" + a.tempat + "<br>" + a.alamat + "</p>"
      + '<p style="margin-top:14px"><a class="btn kecil" href="' + a.maps + '" target="_blank" rel="noopener">Google Map</a></p>'
      + '<img class="gonjong-icon" src="' + (g.ikonRumahGadang || "assets/rumah-gadang-icon.png") + '" alt="Ikon Rumah Gadang">'
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

  /* ---------- Kisah ---------- */
  $("daftarKisah").innerHTML = data.kisah.map(function (k) {
    var foto = k.foto ? '<img src="' + k.foto + '" alt="' + k.judul + '" loading="lazy">' : "";
    return '<div class="tahap"><div class="kartu-kisah">' + foto
      + '<div class="isi-kisah"><span class="tahun">' + k.tahun + "</span>"
      + "<h3>" + k.judul + "</h3><p>" + k.isi + "</p></div></div></div>";
  }).join("");

  /* ---------- Galeri: carousel + grid + lightbox ---------- */
  var fotoAda = data.galeri
    .map(function (item, i) { return { src: item.src, judul: item.judul, index: i }; })
    .filter(function (item) { return item.src; });

  function tileGaleri(item, i) {
    if (item.src) {
      return '<div class="tile" data-galeri="' + i + '">'
        + '<img src="' + item.src + '" alt="' + item.judul + '" loading="lazy">'
        + '<span class="judul">' + item.judul + "</span></div>";
    }
    return '<div class="tile" data-galeri="' + i + '">'
      + '<span class="gonjong-kecil">▲</span>'
      + '<span class="judul">' + item.judul + "</span>"
      + '<span class="ganti">Tambahkan assets/galeri-' + String(i + 1).padStart(2, "0") + '.jpg<br>lalu isi src di js/data.js</span></div>';
  }
  $("carouselGaleri").innerHTML = data.galeri.map(tileGaleri).join("");
  $("daftarGaleri").innerHTML = data.galeri.map(tileGaleri).join("");

  // Kalau file foto galeri tidak ditemukan, ubah tile jadi penanda (bukan gambar rusak).
  document.querySelectorAll(".tile img").forEach(function (img) {
    img.addEventListener("error", function () {
      var tile = img.closest(".tile");
      var i = Number(tile.getAttribute("data-galeri"));
      tile.setAttribute("data-rusak", "1");
      tile.innerHTML = '<span class="gonjong-kecil">▲</span>'
        + '<span class="judul">Foto ' + (i + 1) + "</span>"
        + '<span class="ganti">File tidak ditemukan — periksa src di js/data.js</span>';
    });
  });

  // Navigasi carousel
  function geserCarousel(arah) {
    var car = $("carouselGaleri");
    var tile = car.querySelector(".tile");
    var lebar = tile ? tile.offsetWidth + 8 : 120;
    if (car.scrollBy) { car.scrollBy({ left: arah * lebar * 3, behavior: "smooth" }); }
    else { car.scrollLeft += arah * lebar * 3; }
  }
  $("carPrev").addEventListener("click", function () { geserCarousel(-1); });
  $("carNext").addEventListener("click", function () { geserCarousel(1); });

  // Lightbox
  var lbIndex = 0; // posisi di dalam fotoAda
  function tampilLightbox() {
    var f = fotoAda[lbIndex];
    var img = $("lbGambar");
    img.src = f.src;
    img.alt = f.judul;
    img.classList.remove("zoom");
    $("lbCaption").textContent = f.judul;
    $("lbCounter").textContent = (lbIndex + 1) + " / " + fotoAda.length;
    document.querySelectorAll("#lbThumbs img").forEach(function (t, i) {
      t.classList.toggle("aktif", i === lbIndex);
    });
  }
  function bukaLightbox(i) {
    var item = data.galeri[i];
    var tiles = document.querySelectorAll('[data-galeri="' + i + '"]');
    var rusak = false;
    tiles.forEach(function (t) { if (t.getAttribute("data-rusak")) { rusak = true; } });
    if (rusak) {
      toast("File foto ini tidak ditemukan — periksa src di js/data.js");
      return;
    }
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
  $("lbThumbs").innerHTML = fotoAda.map(function (f) {
    return '<img src="' + f.src + '" alt="' + f.judul + '" data-thumb="' + f.index + '">';
  }).join("");
  document.addEventListener("click", function (e) {
    var tile = e.target.closest("[data-galeri]");
    if (tile) { bukaLightbox(Number(tile.getAttribute("data-galeri"))); return; }
    var thumb = e.target.closest("[data-thumb]");
    if (thumb) {
      lbIndex = fotoAda.findIndex(function (f) { return f.index === Number(thumb.getAttribute("data-thumb")); });
      tampilLightbox();
    }
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
  document.addEventListener("keydown", function (e) {
    if ($("lightbox").classList.contains("hidden")) { return; }
    if (e.key === "Escape") { tutupLightbox(); }
    if (e.key === "ArrowLeft") { $("lbPrev").click(); }
    if (e.key === "ArrowRight") { $("lbNext").click(); }
  });

  /* ---------- Amplop digital ---------- */
  function itemAmplop(label, nomor, nama) {
    return '<div class="amplop-item"><div>'
      + '<div class="label">' + label + "</div>"
      + '<div class="nomor">' + nomor + "</div>"
      + '<div class="nama">a.n. ' + nama + "</div></div>"
      + '<button class="btn kecil" data-salin="' + nomor + '">Copy Rekening</button></div>';
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

  /* ---------- Gift Confirm ---------- */
  $("formGift").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = $("giftNama").value.trim();
    var bank = $("giftBank").value.trim();
    var nominal = $("giftNominal").value.trim();
    if (!nama || !bank || !nominal) {
      toast("Mohon isi Nama, Nama Bank, dan Nominal dulu.");
      return;
    }
    $("giftOk").classList.remove("hidden");
    this.reset();
    toast("Terima kasih, " + nama + "! Konfirmasi gift Anda tercatat.");
  });

  /* ---------- Buku tamu & RSVP (Cloudflare D1 + LocalStorage) ---------- */
  var STORAGE_KEY = "saranwak_minang_ucapan";
  var TEMA_SLUG = "art-minang-3";

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
          tema: TEMA_SLUG,
          nama: item.nama,
          hadir: item.hadir,
          isi: item.isi
        })
      }).catch(function () {});
    } catch (e) {}
  }

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
    fetch("/api/ucapan?tema=" + TEMA_SLUG)
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
    var hadir = $("rsvpHadir").value;
    var jumlah = $("rsvpJumlah").value;
    if (!nama || !hadir || !jumlah) { return; }
    var label = hadir === "Hadir" ? "Hadir · " + jumlah : hadir;
    var waktuStr = "Baru saja";
    var item = { nama: nama, hadir: label, isi: "", waktu: waktuStr };
    simpanLokal(item);
    kirimUcapanKeD1(item);
    daftarUcapan.prepend(buatUcapan(nama, label, "", waktuStr));
    perbaruiStatBadge();
    $("rsvpOk").classList.remove("hidden");

    // Tombol WhatsApp Konfirmasi Langsung
    var waWrap = $("rsvpWaWrap");
    if (waWrap) {
      var waPhone = data.whatsapp || "6281234567890";
      var waMsg = "Halo " + data.pria.nama + " & " + data.wanita.nama + ",\n"
        + "Saya *" + nama + "* mengonfirmasi kehadiran untuk acara pernikahan kalian:\n"
        + "Status: *" + label + "*\n\n"
        + "Terima kasih!";
      var waUrl = "https://api.whatsapp.com/send?phone=" + waPhone + "&text=" + encodeURIComponent(waMsg);
      waWrap.innerHTML = '<a class="btn-wa-konfirmasi" href="' + waUrl + '" target="_blank" rel="noopener">💬 Kirim Konfirmasi ke WhatsApp Mempelai</a>';
      waWrap.classList.remove("hidden");
    }

    this.reset();
    toast("Terima kasih, " + nama + "! Konfirmasi Anda tercatat di buku tamu.");
  });

  /* ---------- Form Ucapan Doa ---------- */
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

  /* ---------- Digital QR Check-in Pass ---------- */
  function renderQrPass() {
    var box = $("qrBox");
    if (!box) { return; }
    box.innerHTML = "";
    if (window.QRCode) {
      try {
        new window.QRCode(box, { text: window.location.href, width: 160, height: 160 });
      } catch (err) {}
    }
  }
  renderQrPass();
  var btnDlQr = $("btnDownloadQr");
  if (btnDlQr) {
    btnDlQr.addEventListener("click", function () {
      try {
        var canvas = $("qrBox").querySelector("canvas");
        if (canvas) {
          var a = document.createElement("a");
          a.href = canvas.toDataURL("image/png");
          a.download = "qr-pass-" + data.pria.nama + "-" + data.wanita.nama + ".png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast("QR check-in pass berhasil diunduh!");
        }
      } catch (e) { toast("Gagal mengunduh QR."); }
    });
  }

  /* ---------- Musik Latar (Synthesized Minang Chimes / Audio) ---------- */
  var audioEl = null;
  var ctxAudio = null;
  var musikMain = false;
  var timerMusik = null;
  var nadaMinang = [
    [67, 1.5], [70, 1], [72, 1], [74, 2], [72, 1],
    [70, 1.5], [67, 2], [65, 1], [67, 3], [72, 1.5],
    [74, 1], [77, 2], [74, 1.5], [72, 2], [70, 1], [67, 3]
  ];
  var KETUK = 0.58;
  var idxNada = 0;
  var waktuBerikut = 0;

  function midiFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function bunyikanMinang(m, waktu, durasi) {
    if (!ctxAudio) return;
    var osc = ctxAudio.createOscillator();
    var osc2 = ctxAudio.createOscillator();
    var gain = ctxAudio.createGain();
    var gain2 = ctxAudio.createGain();
    osc.type = "sine";
    osc.frequency.value = midiFreq(m);
    osc2.type = "triangle";
    osc2.frequency.value = midiFreq(m) * 2;
    gain.gain.setValueAtTime(0.0001, waktu);
    gain.gain.exponentialRampToValueAtTime(0.18, waktu + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, waktu + durasi * 1.6);
    gain2.gain.setValueAtTime(0.0001, waktu);
    gain2.gain.exponentialRampToValueAtTime(0.04, waktu + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, waktu + durasi * 1.2);
    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(ctxAudio.destination);
    gain2.connect(ctxAudio.destination);
    osc.start(waktu);
    osc2.start(waktu);
    osc.stop(waktu + durasi * 1.8);
    osc2.stop(waktu + durasi * 1.8);
  }
  function jadwalkanMinang() {
    if (!ctxAudio || !musikMain) return;
    while (waktuBerikut < ctxAudio.currentTime + 0.6) {
      var n = nadaMinang[idxNada % nadaMinang.length];
      bunyikanMinang(n[0], Math.max(waktuBerikut, ctxAudio.currentTime + 0.02), n[1] * KETUK);
      waktuBerikut += n[1] * KETUK;
      idxNada++;
    }
  }

  function mulaiMusik() {
    if (data.musik) {
      if (!audioEl) {
        audioEl = new Audio(data.musik);
        audioEl.loop = true;
      }
      audioEl.play().then(function () {
        musikMain = true;
        updateStatusMusik(true);
      }).catch(function () {
        mulaiSintesis();
      });
      return;
    }
    mulaiSintesis();
  }

  function mulaiSintesis() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ctxAudio) { ctxAudio = new AC(); }
    if (ctxAudio.resume) { ctxAudio.resume(); }
    musikMain = true;
    idxNada = 0;
    waktuBerikut = ctxAudio.currentTime + 0.1;
    clearInterval(timerMusik);
    timerMusik = setInterval(jadwalkanMinang, 200);
    jadwalkanMinang();
    updateStatusMusik(true);
  }

  function jedaMusik() {
    musikMain = false;
    clearInterval(timerMusik);
    if (ctxAudio && ctxAudio.suspend) { ctxAudio.suspend(); }
    if (audioEl) { audioEl.pause(); }
    updateStatusMusik(false);
  }

  function updateStatusMusik(aktif) {
    var btn = $("musicFloatingBtn");
    var icon = $("musicIcon");
    if (!btn || !icon) return;
    if (aktif) {
      icon.classList.add("spin");
      icon.textContent = "♫";
      btn.setAttribute("aria-label", "Jeda Musik");
    } else {
      icon.classList.remove("spin");
      icon.textContent = "❚❚";
      btn.setAttribute("aria-label", "Putar Musik");
    }
  }

  var btnMusic = $("musicFloatingBtn");
  if (btnMusic) {
    btnMusic.addEventListener("click", function () {
      if (musikMain) {
        jedaMusik();
        toast("Musik dijeda");
      } else {
        mulaiMusik();
        toast("Memutar musik latar ♫");
      }
    });
  }

  /* ---------- Buka undangan ---------- */
  $("btnBuka").addEventListener("click", function () {
    $("isi").classList.remove("hidden");
    var dock = $("bottomDock");
    if (dock) { dock.classList.remove("hidden"); }
    mulaiMusik();
    var hero = $("hero");
    if (hero && hero.scrollIntoView) { hero.scrollIntoView({ behavior: "smooth" }); }
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

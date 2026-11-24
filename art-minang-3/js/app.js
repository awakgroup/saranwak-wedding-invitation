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
  var to = params.get("to");
  if (to) {
    $("namaTamu").textContent = to;
    $("ucapanNama").value = to;
  }

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
    return wrap;
  }
  var daftarUcapan = $("daftarUcapan");
  data.ucapanContoh.forEach(function (u) {
    daftarUcapan.appendChild(buatUcapan(u.nama, u.hadir, u.isi));
  });

  /* ---------- Form RSVP ---------- */
  $("formRsvp").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = $("rsvpNama").value.trim();
    var hadir = $("rsvpHadir").value;
    var jumlah = $("rsvpJumlah").value;
    if (!nama || !hadir || !jumlah) { return; }
    var label = hadir === "Hadir" ? "Hadir · " + jumlah : hadir;
    daftarUcapan.prepend(buatUcapan(nama, label, ""));
    $("rsvpOk").classList.remove("hidden");
    this.reset();
    toast("Terima kasih, " + nama + "! Konfirmasi Anda tercatat di buku tamu.");
  });

  /* ---------- Form Ucapan Doa ---------- */
  $("formUcapan").addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = $("ucapanNama").value.trim() || "Tamu Undangan";
    var isi = $("ucapanIsi").value.trim();
    if (!isi) { return; }
    daftarUcapan.prepend(buatUcapan(nama, "Doa", isi));
    $("ucapanIsi").value = "";
    toast("Terima kasih, " + nama + "! Ucapanmu sudah tampil di buku tamu.");
  });

  /* ---------- Buka undangan ---------- */
  $("btnBuka").addEventListener("click", function () {
    $("isi").classList.remove("hidden");
    var hero = $("hero");
    if (hero && hero.scrollIntoView) { hero.scrollIntoView({ behavior: "smooth" }); }
  });

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

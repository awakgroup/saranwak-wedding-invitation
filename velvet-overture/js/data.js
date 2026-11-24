/* ============================================================
   DATA UNDANGAN — VELVET OVERTURE · BUDI & SANTI
   ------------------------------------------------------------
   INI SATU-SATUNYA FILE YANG PERLU DIEDIT untuk mengganti isi
   undangan. Semua teks bertanda [ ... ] adalah CONTOH dan wajib
   diganti dengan data asli sebelum undangan dibagikan.

   Cara edit: ubah teks di antara tanda petik, simpan, lalu
   refresh halaman (index.html). Tidak perlu mengubah file lain.
   ============================================================ */

var UNDANGAN = {

  /* ---------- Mempelai ---------- */
  pria: {
    nama: "Budi",                 // nama panggilan — tampil besar di cover
    namaLengkap: "Budi",          // lengkapi, mis. "Budi Ramadhan, S.T."
    orangTua: "Putra dari Bapak [Nama Ayah Budi] & Ibu [Nama Ibu Budi]",
    kota: "Kota Padang",
    instagram: "budi.contoh",    // CONTOH — isi username tanpa @
                                  // kosong = tombol Instagram disembunyikan
    foto: "assets/mempelai-pria.jpg",
    inisial: "B"                  // tampil di bingkai foto selama foto belum ada
  },

  wanita: {
    nama: "Santi",
    namaLengkap: "Santi",          // lengkapi, mis. "Santi Maharani, S.E."
    orangTua: "Putri dari Bapak [Nama Ayah Santi] & Ibu [Nama Ibu Santi]",
    kota: "Kota Padang",
    instagram: "santi.contoh",    // CONTOH — isi username tanpa @
    foto: "assets/mempelai-wanita.jpg",
    inisial: "S"
  },

  /* ---------- Tanggal & countdown ---------- */
  // CONTOH: Minggu, 14 Februari 2027. Ganti tanggalTampil dan
  // targetHitungMundur bersamaan (format ISO: YYYY-MM-DDTHH:MM:SS+07:00).
  tanggalTampil: "Minggu, 14 Februari 2027",
  tanggalSingkat: "14 · 02 · 2027",
  kotaAcara: "Padang, Sumatera Barat",
  targetHitungMundur: "2027-02-14T08:00:00+07:00",
  jamAkad: "08:00",               // tampil di bawah kalender ("At 08:00 WIB")

  /* ---------- Acara ---------- */
  acara: [
    {
      nama: "Akad Nikah",
      jam: "08.00 – 10.00 WIB",
      tanggal: "Minggu, 14 Februari 2027",
      tempat: "Masjid Raya Sumatera Barat",
      alamat: "Jl. Khatib Sulaiman, Padang Utara, Kota Padang",
      maps: "https://www.google.com/maps/search/?api=1&query=Masjid+Raya+Sumatera+Barat+Padang"
    },
    {
      nama: "Baralek Gadang",
      jam: "11.00 – 14.00 WIB",
      tanggal: "Minggu, 14 Februari 2027",
      tempat: "Gedung Serbaguna (Contoh)",
      alamat: "Jl. Khatib Sulaiman, Kota Padang",
      maps: "https://www.google.com/maps/search/?api=1&query=Gedung+Serbaguna+Jalan+Khatib+Sulaiman+Padang"
    }
  ],

  /* ---------- Lokasi utama (section Location) ---------- */
  lokasi: {
    tempat: "Gedung Serbaguna (Contoh)",
    alamat: "Jl. Khatib Sulaiman, Kota Padang",
    maps: "https://www.google.com/maps/search/?api=1&query=Gedung+Serbaguna+Jalan+Khatib+Sulaiman+Padang"
  },

  /* ---------- Rundown (Rangkaian acara) ---------- */
  rundown: [
    { jam: "07.30", judul: "Kedatangan tamu", ikon: "⌛" },
    { jam: "08.00", judul: "Akad Nikah", ikon: "♫" },
    { jam: "11.00", judul: "Baralek Gadang", ikon: "✦" },
    { jam: "14.00", judul: "Penutupan acara", ikon: "❀" }
  ],

  /* ---------- Galeri (6 foto) ----------
     Foto diganti dengan menaruh file baru di folder assets/
     memakai nama yang sama, atau mengubah src di bawah ini.
     Slot yang src-nya kosong tampil sebagai bingkai penanda
     (bukan gambar rusak). */
  galeri: [
    { src: "assets/galeri-01.jpg", judul: "Foto 1" },
    { src: "assets/galeri-02.jpg", judul: "Foto 2" },
    { src: "assets/galeri-03.jpg", judul: "Foto 3" },
    { src: "assets/galeri-04.jpg", judul: "Foto 4" },
    { src: "assets/galeri-05.jpg", judul: "Foto 5" },
    { src: "assets/galeri-06.jpg", judul: "Foto 6" }
  ],

  /* ---------- Amplop digital (CONTOH — ganti nomor asli) ---------- */
  amplop: {
    bank: [
      { bank: "Bank Nagari", nomor: "0000 0000 0000", atasNama: "Budi" },
      { bank: "BSI", nomor: "0000 0000 0000", atasNama: "Santi" }
    ],
    ewallet: [
      { layanan: "DANA", nomor: "0812-0000-0000", atasNama: "Budi" },
      { layanan: "GoPay", nomor: "0812-0000-0000", atasNama: "Santi" }
    ],
    alamatKado: "[Nama penerima] — [Alamat lengkap kirim kado]"
  },

  /* ---------- Gambar latar & ilustrasi ----------
     Ganti file di folder assets/ memakai nama yang sama, atau
     ubah path di bawah ini. */
  gambar: {
    cover: "assets/cover-tirai.jpg",
    gramofon: "assets/gramofon.jpg",
    sheetMusic: "assets/sheet-music.jpg",
    jewelBox: "assets/jewel-box.jpg",
    pintuHijau: "assets/pintu-hijau.jpg",
    drapeHijau: "assets/drape-hijau.jpg",
    mawar: "assets/mawar-burgundy.jpg",
    buket: "assets/buket-bunga.jpg"
  },

  /* ---------- Kontak WhatsApp (Opsional) ---------- */
  whatsapp: "6281234567890",      // nomor WA untuk tombol konfirmasi RSVP tamu (format: 628...)

  /* ---------- Ucapan contoh (tampil di buku tamu) ---------- */
  ucapanContoh: [
    { nama: "Mak Tuo & Dunsanak Bukittinggi", hadir: "Hadir", isi: "Salamaik baralek, Budi & Santi! Samoga rumah tangga kalian sakinah, mawaddah, warahmah." },
    { nama: "Geng Rantau Jakarta", hadir: "Hadir", isi: "Akhirnya pulang kampung baralek! Selamat ya, semoga langgeng sampai kakek-nenek." },
    { nama: "Keluarga Besar", hadir: "Hadir", isi: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir." }
  ]
};

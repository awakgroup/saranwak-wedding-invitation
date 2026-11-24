/* ============================================================
   DATA UNDANGAN — BATAKNESE · BUDI & SANTI
   ------------------------------------------------------------
   INI SATU-SATUNYA FILE YANG PERLU DIEDIT untuk mengganti isi
   undangan. Semua teks bertanda [ ... ] adalah CONTOH dan wajib
   diganti dengan data asli sebelum undangan dibagikan.

   Cara edit: ubah teks di antara tanda petik, simpan, lalu
   refresh halaman (index.html). Tidak perlu mengubah file lain.
   ============================================================ */

var UNDANGAN = {

  /* ---------- ID Pasangan (Pemisah Database Ucapan & RSVP) ---------- */
  slug: "budi-santi",             // Ganti dengan nama unik pasangan, mis. "dimas-rini" agar ucapan terpisah per user

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
      maps: "https://www.google.com/maps/search/?api=1&query=Jalan+Khatib+Sulaiman+Padang"
    }
  ],

  /* ---------- Live streaming ----------
     Tautan live belum ada (belum disediakan mempelai), jadi
     tombol menampilkan pesan jujur. Isi `tautan` dengan URL
     live (mis. Instagram/YouTube) bila sudah ada. */
  live: {
    judul: "Live Streaming",
    keterangan: "Kami mengajak Anda yang tidak bisa hadir langsung untuk bergabung pada momen spesial kami melalui siaran langsung secara virtual.",
    tautan: ""
  },

  /* ---------- Kisah kami (CONTOH — ganti dengan kisah asli) ---------- */
  kisah: [
    {
      tahun: "2023",
      judul: "Pertemuan Pertama",
      isi: "Dari sebuah pertemuan sederhana, dua orang yang sama-sama merantau mulai saling mengenal."
    },
    {
      tahun: "2025",
      judul: "Memantapkan Hati",
      isi: "Setelah keluarga saling bertemu, kami sepakat melangkah ke babak baru bersama."
    },
    {
      tahun: "2027",
      judul: "Baralek Gadang",
      isi: "Dengan restu keluarga dan doa dunsanak, kami pulang ke kampung halaman untuk baralek."
    }
  ],

  /* ---------- Galeri (7 foto) ----------
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
    { src: "assets/galeri-06.jpg", judul: "Foto 6" },
    { src: "assets/galeri-07.jpg", judul: "Foto 7" }
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
    cover: "assets/cover-batak.jpg",
    fotoKiri: "assets/foto-fixed-kiri.jpg",
    heroPerkamen: "assets/hero-perkamen.jpg",
    pasanganJendela: "assets/pasangan-jendela.jpg"
  },

  /* ---------- Kontak WhatsApp (Opsional) ---------- */
  whatsapp: "6281234567890",      // nomor WA untuk tombol konfirmasi RSVP tamu (format: 628...)

  /* ---------- Ucapan contoh (tampil di buku tamu) ---------- */
  ucapanContoh: [
    { nama: "Mak Tuo & Dunsanak Bukittinggi", hadir: "Hadir", isi: "Salamaik baralek, Budi & Santi! Samoga rumah tangga kalian sakinah, mawaddah, warahmah." },
    { nama: "Geng Rantau Jakarta", hadir: "Hadir", isi: "Akhirnya pulang kampung baralek! Selamat ya, semoga langgeng sampai kakek-nenek." },
    { nama: "Keluarga Besar", hadir: "Hadir", isi: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir." },
    { nama: "Dunsanak Piaman", hadir: "Hadir", isi: "Selamat baralek! Semoga menjadi keluarga yang sakinah dan diberkahi." },
    { nama: "Sahabat Kampus", hadir: "Hadir", isi: "Dari teman sekelas sampai ke pelaminan — selamat Budi & Santi!" },
    { nama: "Tetangga Perumahan", hadir: "Hadir", isi: "Turut berbahagia! Semoga lancar sampai hari-H dan seterusnya." }
  ]
};

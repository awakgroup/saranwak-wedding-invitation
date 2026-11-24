# Undangan Pernikahan Bataknese — Budi & Santi

Klon desain "BATAKNESE THEME" (Tibra Invitation) dengan data Budi &
Santi — nuansa Batak: pola ulos, gorga, Rumah Bolon, palet
marun/krem/emas. Layout khas dipertahankan: desktop split (foto
fixed kiri + kolom scroll kanan 480 px), mobile kolom tunggal.
Visual Batak dipertahankan, isi disesuaikan ke pasangan Islami
(QS. Ar-Rum: 21, Akad + Baralek). Semua artwork dibuat baru (bukan
file vendor) dan semua cacat demo aslinya sudah diperbaiki:
countdown benar ke 14 Feb 2027, Save The Date benar (bukan sisa
template pasangan lain), tombol live streaming jujur (bukan ke IG
vendor), rekening a.n. Budi/Santi, alamat tidak meluber, Upload
Foto berfungsi, QR personal per nama tamu, kontras script
diperbaiki, tanpa branding vendor.

## Cara membuka

Klik ganda `index.html` — cover tampil, klik "Buka Undangan"
(musik mulai otomatis). Tidak perlu server. Font Google dan
pustaka QR dimuat dari internet; tanpa internet, tampilan memakai
font cadangan dan QR menampilkan pesan fallback.

Coba nama tamu personal: buka `index.html?to=Nama+Tamu` — nama
tampil di cover dan di kartu QR check-in.

## Cara mengedit — cukup 1 file: `js/data.js`

Semua isi undangan ada di `js/data.js` (nama, tanggal, venue,
kisah, galeri, rekening, ucapan, gambar). Ubah teks di antara
tanda petik, simpan, refresh halaman.

Yang wajib diganti sebelum dibagikan (bertanda `[ ... ]` /
bernomor nol): nama lengkap, nama orang tua, tanggal, jam & venue,
nomor rekening & e-wallet, alamat kirim kado, Instagram, dan foto
(lihat `assets/README.txt`).

## Isi folder

```
bataknese/
├── index.html          Struktur & 14 section undangan
├── css/
│   └── style.css       Tema Marun-Krem-Emas Bataknese (split desktop)
├── js/
│   ├── data.js         ★ SATU-SATUNYA FILE YANG PERLU DIEDIT
│   └── app.js          Logika (countdown, drawer, QR, galeri, RSVP, paginasi, dll.)
├── assets/
│   ├── cover-batak.jpg         Foto cover (pasangan busana Batak)
│   ├── foto-fixed-kiri.jpg     Foto fixed panel kiri desktop
│   ├── hero-perkamen.jpg       Ilustrasi hero (desa Batak)
│   ├── mempelai-pria.jpg       Foto mempelai pria (frame arch)
│   ├── mempelai-wanita.jpg     Foto mempelai wanita (frame arch)
│   ├── pasangan-jendela.jpg    Foto mempelai + penutup
│   ├── galeri-01.jpg … galeri-07.jpg
│   └── README.txt      Panduan mengganti foto
└── README.md           File ini
```

## Fitur

- Cover + Buka Undangan (lompat ke Save The Date, musik mulai)
- Hero ilustrasi perkamen (hutan pinus, danau, Rumah Bolon)
- Save The Date + QS. Ar-Rum: 21 + countdown live + link Google
  Calendar yang benar
- Mempelai (frame arch emas, orang tua, link Instagram)
- Acara: 2 kartu marun border ulos + Petunjuk arah
- Wedding Gift: drawer (bank + e-wallet + salin + Kirim Kado +
  form Konfirmasi Pengiriman)
- Live Streaming: pesan jujur bila tautan belum diisi
- Momen Bersama: slot video prewedding (penanda jujur) + galeri
  7 foto + lightbox lengkap (counter, zoom, layar penuh, bagikan)
- RSVP (nama, alamat, Hadir/Tidak Hadir, jumlah tamu)
- Kisah Kita 3 babak ber-tanggal
- Sharing Memories: Upload Foto (file picker + konfirmasi lokal)
- QR Check-in: drawer QR personal per nama tamu + Download
  E-Invitation (unduh gambar QR)
- Ucapan & Doa berpaginasi (5 per halaman) + penutup + footer
  Saranwak
- Musik melodi sintesis WebAudio + tombol fixed kanan bawah

## Catatan

- RSVP, ucapan, dan konfirmasi gift hanya tampil di halaman
  (in-memory) — belum tersimpan ke server (perlu backend bila mau
  disimpan permanen).
- QR mengodekan URL undangan + nama tamu (`?to=`), digambar oleh
  pustaka qrcodejs dari CDN — butuh internet saat dibuka.
- Foto-foto di folder ini adalah hasil generate AI (bukan foto asli
  mempelai) — ganti dengan foto asli sebelum dibagikan ke tamu.

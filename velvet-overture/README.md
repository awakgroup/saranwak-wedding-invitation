# Undangan Pernikahan Velvet Overture — Budi & Santi

Klon desain "Velvet Overture" (Our Wedding Link) dengan data Budi &
Santi — tema teater beludru: tirai burgundy, chandelier emas,
gramofon, kotak perhiasan, pintu arch hijau. Kolom sempit ±390 px,
palet burgundy #6A1424 / krem / olive / emas, animasi fadeInUp saat
scroll (satu-satunya animasi, seperti aslinya). Semua artwork dibuat
baru (bukan file vendor) dan semua cacat demo aslinya sudah
diperbaiki: nama tamu tampil dari `?to=`, rekening a.n. Budi/Santi,
alamat kado asli, grid galeri 6 tile penuh, OPEN MAP ke query yang
benar, tanpa field jabatan di RSVP, bahasa Indonesia konsisten,
tanpa branding vendor.

Tanpa gerbang buka undangan dan tanpa navigasi bawah — sesuai
desain aslinya.

## Cara membuka

Klik ganda `index.html` — undangan langsung terbuka di browser
(setelah loading singkat). Tidak perlu server. Font Google dan
pustaka QR dimuat dari internet; tanpa internet, tampilan memakai
font cadangan dan QR menampilkan pesan fallback.

Coba nama tamu personal: buka `index.html?to=Nama+Tamu`.

## Cara mengedit — cukup 1 file: `js/data.js`

Semua isi undangan ada di `js/data.js` (nama, tanggal, venue,
rundown, rekening, kisah, galeri, ucapan, gambar). Ubah teks di
antara tanda petik, simpan, refresh halaman.

Yang wajib diganti sebelum dibagikan (bertanda `[ ... ]` /
bernomor nol): nama lengkap, nama orang tua, tanggal, jam & venue,
nomor rekening & e-wallet, alamat kirim kado, Instagram, dan foto
(lihat `assets/README.txt`).

## Isi folder

```
velvet-overture/
├── index.html          Struktur & 13 section undangan
├── css/
│   └── style.css       Tema Burgundy-Krem-Olive-Emas
├── js/
│   ├── data.js         ★ SATU-SATUNYA FILE YANG PERLU DIEDIT
│   └── app.js          Logika (countdown, kalender, player, galeri, RSVP, gift, dll.)
├── assets/
│   ├── cover-tirai.jpg         Foto cover & penutup (tirai + chandelier)
│   ├── gramofon.jpg            Foto player musik
│   ├── sheet-music.jpg         Tekstur sheet music
│   ├── mempelai-pria.jpg       Foto mempelai pria (frame oval)
│   ├── mempelai-wanita.jpg     Foto mempelai wanita (frame oval)
│   ├── drape-hijau.jpg         Latar section The Couple
│   ├── jewel-box.jpg           Foto greeting card
│   ├── pintu-hijau.jpg         Foto section Location
│   ├── buket-bunga.jpg         Foto rundown
│   ├── mawar-burgundy.jpg      Strip bunga penutup
│   ├── galeri-01.jpg … galeri-06.jpg
│   └── README.txt      Panduan mengganti foto
└── README.md           File ini
```

## Fitur

- Cover tirai beludru + chandelier, DEAR + nama tamu dari `?to=`
- Player musik gramofon: 3 melodi sintesis WebAudio (prev/play/next
  + progress bar) — bukan rekaman lagu
- The Couple (frame oval emas barok, tumpang tindih)
- Greeting card kotak perhiasan beludru
- Kalender Februari 2027 (tanggal 14 dilingkari) + "At 08:00 WIB"
- Countdown live + Save The Date (Google Calendar, tanggal benar)
- Location (pintu arch hijau + OPEN MAP ke query benar)
- Rundown 4 acara berikon (07.30–14.00)
- Galeri scrapbook 6 foto + lightbox (counter, panah, tutup)
- RSVP (nama, WA opsional, Hadir/Tidak Hadir, 1–5 tamu, ucapan)
- Wedding gift: tab Direct Transfer / Send Gift, tombol salin,
  modal QR per rekening
- Buku tamu (Doa & ucapan) + penutup + footer Saranwak

## Catatan

- RSVP dan ucapan hanya tampil di halaman (in-memory) — belum
  tersimpan ke server (perlu backend bila mau disimpan permanen).
- Foto-foto di folder ini adalah hasil generate AI (bukan foto asli
  mempelai) — ganti dengan foto asli sebelum dibagikan ke tamu.

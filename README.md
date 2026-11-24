# Undangan Pernikahan Budi & Santi — 3 Tema

Satu project berisi 3 tema undangan digital dengan data yang sama
(Budi & Santi, Minggu, 14 Februari 2027, Padang):

| Tema | Folder | Gaya |
|---|---|---|
| **Art Minang 3** | `art-minang-3/` | Klasik Minangkabau: frame arch, ilustrasi Rumah Gadang, suntiang emas, 13 section |
| **Velvet Overture** | `velvet-overture/` | Teater beludru burgundy: chandelier, gramofon, kalender, rundown, galeri scrapbook, 13 section |
| **Bataknese** | `bataknese/` | Nuansa Batak: ulos, gorga, Rumah Bolon, layout split desktop, drawer gift & QR check-in, 14 section |

Semua artwork dibuat baru (bukan file vendor) dan semua cacat demo
asli sudah diperbaiki: tanggal konsisten, nama konsisten, Save The
Date membuka Google Calendar yang benar, tombol salin ada konfirmasi,
dan tanpa branding vendor. Footer tiap tema: **Saranwak — Undangan
Digital**.

## Cara membuka

Klik ganda `index.html` di folder ini — landing page pemilih tema
terbuka, lalu klik "Lihat Undangan" pada tema yang mau dilihat.
Atau buka langsung `art-minang-3/index.html`,
`velvet-overture/index.html`, atau `bataknese/index.html`.

Tidak perlu server, tidak perlu install apa pun. Font Google, pustaka
QR, dan tautan Google Maps dimuat dari internet; tanpa internet,
tampilan memakai font cadangan dan QR menampilkan pesan fallback.

Coba nama tamu personal: buka `index.html?to=Nama+Tamu` — nama
diteruskan ke tema yang dipilih dan tampil di cover (serta di kartu
QR check-in Bataknese dan form ucapan).

## Cara mengedit — 1 file per tema: `js/data.js`

Tiap tema punya `js/data.js` SENDIRI dan bersifat standalone — folder
tema bisa dicopy terpisah dan tetap jalan sendiri. Semua isi undangan
(nama, tanggal, venue, rekening, kisah, galeri, ucapan, gambar) ada
di file itu. Ubah teks di antara tanda petik, simpan, refresh halaman.
Tidak perlu menyentuh file lain.

> Perhatian: karena datanya terpisah per tema, perubahan data (mis.
> nama lengkap atau nomor rekening asli) harus dilakukan di ketiga
> file `js/data.js` bila ketiga tema mau dipakai bersamaan.

Yang wajib diganti sebelum dibagikan (bertanda `[ ... ]` / bernomor
nol) — sama di ketiga tema:

| Data | Lokasi di tiap `js/data.js` |
|---|---|
| Nama lengkap Budi & Santi | `pria.namaLengkap`, `wanita.namaLengkap` |
| Nama orang tua (berbeda per mempelai) | `pria.orangTua`, `wanita.orangTua` |
| Tanggal acara | `tanggalTampil`, `tanggalSingkat`, `targetHitungMundur` |
| Jam & venue akad/baralek | `acara[0]` (akad), `acara[1]` (baralek) |
| Tautan live streaming | `live.tautan` (kosong = tombol menampilkan pesan jujur) |
| Kisah kami (3 babak contoh) | `kisah` |
| Nomor rekening & e-wallet | `amplop.bank`, `amplop.ewallet` |
| Alamat kirim kado | `amplop.alamatKado` |
| Instagram mempelai | `pria.instagram`, `wanita.instagram` |
| Foto & gambar latar | `pria.foto`, `wanita.foto`, `galeri`, `gambar` |

Data contoh saat ini: Minggu, 14 Februari 2027; akad di Masjid Raya
Sumatera Barat, baralek di Gedung Serbaguna (contoh), Jl. Khatib
Sulaiman, Padang.

## Foto & gambar

Lihat `assets/README.txt` di tiap tema. Singkatnya: ganti file di
folder `assets/` memakai nama yang sama (mis. `mempelai-wanita.jpg`,
`galeri-01.jpg`), atau ubah path-nya di `js/data.js`. Slot foto yang
kosong tampil sebagai bingkai penanda (bukan gambar rusak).

Foto-foto di project ini adalah hasil generate AI (bukan foto asli
mempelai) — ganti dengan foto asli sebelum dibagikan ke tamu.
Gambar sudah dikompres (maks. lebar ±1280 px, JPEG kualitas ±80)
agar ukuran project tetap ringan.

## Isi folder

```
undangan-budi-santi-3-tema/
├── index.html              Landing page pemilih tema (3 kartu)
├── README.md               File ini
├── art-minang-3/           Tema 1 — lihat README.md di dalamnya
│   ├── index.html
│   ├── css/style.css
│   ├── js/data.js          ★ File edit tema ini
│   ├── js/app.js
│   └── assets/             21 gambar (20 foto + ikon Rumah Gadang)
├── velvet-overture/        Tema 2 — lihat README.md di dalamnya
│   ├── index.html
│   ├── css/style.css
│   ├── js/data.js          ★ File edit tema ini
│   ├── js/app.js
│   └── assets/             16 gambar
└── bataknese/              Tema 3 — lihat README.md di dalamnya
    ├── index.html
    ├── css/style.css
    ├── js/data.js          ★ File edit tema ini
    ├── js/app.js
    └── assets/             13 gambar
```

## Fitur (per tema)

Semua tema: nama tamu dari `?to=`, countdown live + Save The Date
(Google Calendar, tanggal benar), galeri + lightbox lengkap, RSVP +
ucapan masuk buku tamu halaman, tombol salin (label berubah
"Tersalin ✓" + toast), animasi fade/slide-up saat scroll,
mobile-first tanpa overflow horizontal.

- **Art Minang 3:** cover + Buka Undangan, carousel + grid galeri
  12 foto, Love Story timeline, Gift Confirm, tanpa musik, tanpa nav
  bawah (sesuai aslinya).
- **Velvet Overture:** tanpa gerbang buka undangan, player musik
  gramofon (3 melodi sintesis WebAudio, prev/play/next + progress),
  kalender bulan acara, rundown 4 acara, galeri scrapbook 6 foto,
  gift tab + modal QR.
- **Bataknese:** cover + Buka Undangan (musik mulai otomatis),
  layout split desktop (foto fixed kiri + kolom scroll kanan),
  drawer Gift + drawer QR check-in personal, Upload Foto,
  ucapan berpaginasi, tombol musik fixed.

## Cara hosting

Upload SELURUH isi folder ini ke hosting statis apa pun (Netlify,
Vercel, GitHub Pages, cPanel, VPS/Nginx) — tidak ada proses build
dan tidak ada dependensi server. Struktur URL yang disarankan untuk
Saranwak: `undangan.saranwak.com/budi-santi/` (landing) atau satu
tema per path, mis. `undangan.saranwak.com/budi-santi/art-minang-3/`.

## Cara menambah tema baru

1. Duplikat salah satu folder tema (mis. `cp -r velvet-overture tema-baru/`).
2. Ganti isi `tema-baru/index.html`, `css/style.css`, `js/app.js`,
   dan gambar di `assets/` sesuai desain tema baru. `js/data.js`
   bisa dipakai apa adanya (struktur datanya sama).
3. Tambahkan satu kartu di `index.html` landing (salin salah satu
   `<article class="kartu">`, ubah gambar, nama, deskripsi, dan
   tautannya).
4. Tambahkan baris tema baru di tabel atas README ini.

## Catatan

- RSVP, ucapan, dan konfirmasi gift hanya tampil di halaman
  (in-memory). Bila undangan ini mau dipakai massal dengan data
  tersimpan, langkah berikutnya adalah backend/form service.
- Musik di Velvet Overture dan Bataknese adalah melodi lembut hasil
  sintesis WebAudio (bukan rekaman lagu) — tanpa file audio dan
  tanpa masalah lisensi. Bila mau memakai lagu asli, ganti logika
  player di `js/app.js` dengan elemen `<audio>` + file MP3.
- QR di Bataknese mengodekan URL undangan + nama tamu (`?to=`),
  digambar oleh pustaka qrcodejs dari CDN — butuh internet saat
  dibuka. Tanpa internet, drawer menampilkan pesan fallback.

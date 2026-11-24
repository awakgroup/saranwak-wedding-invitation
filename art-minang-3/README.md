# Undangan Pernikahan Art Minang 3 — Budi & Santi

Klon desain "ART MINANG 3" (Galeri Undangan Official) dengan data Budi &
Santi — gaya klasik Elementor: kolom sempit 430 px di tengah, palet
krem/marun/emas, judul script di atas serif, frame arch, ilustrasi
Rumah Gadang. Semua artwork dibuat baru (bukan file vendor) dan semua
cacat demo aslinya sudah diperbaiki: tanggal konsisten Minggu,
14 Februari 2027; label Putra/Putri benar dengan orang tua berbeda;
Save The Date membuka Google Calendar yang benar; tombol salin ada
konfirmasi; cerita Love Story asli dari data; tanpa video YouTube
pasangan lain; tanpa branding vendor.

Tanpa musik dan tanpa navigasi bawah — sesuai desain aslinya.

## Cara membuka

Klik ganda `index.html` — undangan langsung terbuka di browser. Tidak perlu
server, tidak perlu install apa pun. Font Google dimuat dari internet; tanpa
internet, tampilan memakai font cadangan (Georgia / sans sistem).

Coba nama tamu personal: buka `index.html?to=Nama+Tamu` — nama di cover
dan di form Ucapan Doa berubah mengikuti link.

## Cara mengedit — cukup 1 file: `js/data.js`

Semua isi undangan (nama, tanggal, venue, rekening, kisah, galeri, ucapan,
gambar latar) ada di `js/data.js`. Ubah teks di antara tanda petik, simpan,
refresh halaman. Tidak perlu menyentuh file lain.

Yang wajib diganti sebelum dibagikan (bertanda `[ ... ]` / bernomor nol):

| Data | Lokasi di `js/data.js` |
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

Data contoh saat ini: Minggu, 14 Februari 2027; akad di Masjid Raya Sumatera
Barat, baralek di Gedung Serbaguna (contoh), Jl. Khatib Sulaiman, Padang.

## Foto & gambar

Lihat `assets/README.txt`. Singkatnya: ganti file di folder `assets/`
memakai nama yang sama (mis. `mempelai-wanita.jpg`, `galeri-01.jpg`), atau
ubah path-nya di `js/data.js`. Slot foto yang kosong tampil sebagai bingkai
penanda (bukan gambar rusak).

## Isi folder

```
art-minang-3-budi-santi/
├── index.html          Struktur & 13 section undangan
├── css/
│   └── style.css       Tema Krem-Marun-Emas Art Minang 3
├── js/
│   ├── data.js         ★ SATU-SATUNYA FILE YANG PERLU DIEDIT
│   └── app.js          Logika (countdown, galeri, RSVP, gift, dll.)
├── assets/
│   ├── hero-rumah-gadang.jpg    Ilustrasi cover/hero
│   ├── mempelai-wanita.jpg      Foto mempelai wanita (suntiang emas)
│   ├── mempelai-pria.jpg        Foto mempelai pria (songket marun)
│   ├── suntiang-closeup.jpg     Latar countdown
│   ├── dedaunan.jpg             Latar Wedding Event
│   ├── live-streaming.jpg       Latar Live Streaming
│   ├── fasad-rumah-gadang.jpg   Latar Love Story
│   ├── kain-marun.jpg           Latar RSVP
│   ├── galeri-01.jpg … galeri-12.jpg
│   ├── rumah-gadang-icon.png    Ikon Rumah Gadang (vektor kiriman Bosku,
│   │                            latar putih dihilangkan jadi transparan)
│   └── README.txt      Panduan mengganti foto
└── README.md           File ini
```

## Fitur

- Cover + tombol Buka Undangan, nama tamu dari `?to=` (juga mengisi
  nama di form Ucapan Doa)
- Hero, Mempelai (foto frame arch, orang tua, link Instagram)
- Countdown live + Save The Date (Google Calendar, tanggal benar)
- QS. Ar-Rum: 21
- Wedding Event: 2 kartu arch + tombol Google Map per acara
- Live Streaming: tombol Join Live (menampilkan pesan jujur bila tautan
  belum diisi di `js/data.js`)
- Galeri: carousel 3-across + grid 12 foto + lightbox lengkap
  (counter 1/12, panah, zoom, layar penuh, strip thumbnail)
- Love Story: timeline 3 babak dengan foto
- Wedding Gift: 2 bank + 2 e-wallet + tombol Copy (label berubah
  "Tersalin ✓" + toast) + Kirim Kado + Gift Confirm (validasi +
  pesan sukses)
- RSVP (nama, Hadir/Tidak Hadir, 1/2 Orang) — jawaban tampil di
  buku tamu halaman ini; belum tersimpan ke server (perlu backend
  bila mau disimpan permanen)
- Ucapan Doa (nama read-only dari `?to=`) + buku tamu
- Terima Kasih + footer Saranwak — Undangan Digital

## Catatan

- RSVP, ucapan, dan konfirmasi gift hanya tampil di halaman
  (in-memory). Bila undangan ini mau dipakai massal dengan data
  tersimpan, langkah berikutnya adalah backend/form service.
- Ikon Rumah Gadang berasal dari vektor kiriman Bosku (file JPG
  berlatar putih) yang diolah jadi PNG transparan.
- Foto-foto di folder ini adalah hasil generate bergaya studio
  Minang (bukan foto asli mempelai) — ganti dengan foto asli
  sebelum dibagikan ke tamu.

# Orion Jaya - Sistem Booking Lapangan Olahraga

Sistem booking lapangan olahraga modern dengan antarmuka yang responsif dan mudah digunakan. Dibangun untuk memudahkan pengguna dalam melakukan reservasi lapangan secara online.

## 🚀 Fitur Utama

- **Booking Lapangan Online**: Sistem reservasi lapangan yang mudah dan cepat
- **Manajemen Admin**: Panel admin lengkap untuk mengelola lapangan, booking, artikel, galeri, dan lainnya
- **Desain Responsif**: Tampilan yang optimal di berbagai ukuran layar (desktop, tablet, mobile)
- **Animasi Halus**: Transisi dan animasi yang memberikan pengalaman pengguna yang menyenangkan
- **Galeri & Artikel**: Bagian untuk menampilkan foto-foto lapangan dan artikel berita terbaru

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 19**: Library JavaScript untuk membangun antarmuka pengguna
- **TypeScript**: Bahasa pemrograman dengan tipe statis untuk JavaScript
- **Vite**: Build tool yang cepat dan modern untuk proyek web
- **React Router DOM**: Library routing untuk navigasi dalam aplikasi React
- **Tailwind CSS 4**: Framework CSS utility-first untuk styling
- **Framer Motion**: Library animasi untuk React
- **Lucide React**: Library ikon yang ringan dan modern

### Backend & Database
- **Supabase**: Platform backend-as-a-service yang menyediakan database, autentikasi, dan storage

## 📋 Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:

- **Node.js** (versi 18 atau lebih baru) - [Download di sini](https://nodejs.org/)
- **npm** (biasanya terinstal bersama dengan Node.js)
- **Git** - [Download di sini](https://git-scm.com/)

## 📦 Cara Clone Repository

1. Buka terminal atau command prompt
2. Clone repository menggunakan perintah berikut:

```bash
git clone https://github.com/username/orion-booking.git
```

3. Masuk ke direktori proyek:

```bash
cd orion-booking
```

## 🔧 Cara Menjalankan Proyek

### 1. Install Dependencies

Setelah clone repository, install semua dependencies yang diperlukan:

```bash
npm install
```

### 2. Konfigurasi Environment Variables

Buat file `.env` di root direktori proyek dan tambahkan konfigurasi Supabase Anda:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Jalankan Mode Development

Untuk menjalankan proyek dalam mode development:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 4. Build untuk Production

Untuk membuat build production:

```bash
npm run build
```

### 5. Preview Production Build

Untuk melihat preview build production:

```bash
npm run preview
```

## 📁 Struktur Folder

```
orion-booking/
├── public/                 # File statis (gambar, favicon, dll.)
├── src/
│   ├── components/         # Komponen React yang dapat digunakan kembali
│   │   ├── admin/         # Komponen khusus halaman admin
│   │   ├── lapangan/      # Komponen terkait lapangan
│   │   ├── layout/        # Komponen layout (navbar, footer, dll.)
│   │   └── ui/            # Komponen UI yang dapat digunakan kembali
│   ├── data/              # Data statis atau konfigurasi
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Fungsi utilitas dan konfigurasi library
│   ├── pages/             # Halaman-halaman aplikasi
│   │   ├── admin/         # Halaman admin
│   │   ├── Artikel.tsx    # Halaman daftar artikel
│   │   ├── ArtikelDetail.tsx  # Halaman detail artikel
│   │   ├── Booking.tsx    # Halaman booking
│   │   ├── Galeri.tsx     # Halaman galeri
│   │   ├── Home.tsx       # Halaman beranda
│   │   ├── Kontak.tsx     # Halaman kontak
│   │   ├── Lapangan.tsx   # Halaman daftar lapangan
│   │   ├── LoginAdmin.tsx # Halaman login admin
│   │   └── Tentang.tsx    # Halaman tentang kami
│   ├── store/             # State management (Context API)
│   ├── types/             # Definisi tipe TypeScript
│   ├── App.tsx            # Komponen utama aplikasi
│   ├── main.tsx           # Entry point aplikasi
│   └── index.css          # Global styles
├── supabase/              # Konfigurasi Supabase
├── .env                   # Environment variables (tidak di-commit)
├── .gitignore             # File yang diabaikan oleh Git
├── index.html             # HTML utama
├── package.json           # Konfigurasi proyek dan dependencies
├── tsconfig.json          # Konfigurasi TypeScript
├── vite.config.ts         # Konfigurasi Vite
└── README.md              # Dokumentasi proyek
```

## 🎯 Cara Menggunakan

### Untuk Pengguna Biasa

1. Buka aplikasi di browser
2. Jelajahi lapangan yang tersedia di halaman "Lapangan"
3. Klik tombol "Booking" pada lapangan yang diinginkan
4. Isi formulir booking dengan data yang valid
5. Konfirmasi booking dan tunggu konfirmasi dari admin

### Untuk Admin

1. Login melalui halaman "Login Admin"
2. Akses dashboard admin untuk mengelola:
   - **Lapangan**: Tambah, edit, atau hapus data lapangan
   - **Booking**: Kelola booking yang masuk
   - **Artikel**: Kelola artikel dan berita
   - **Galeri**: Kelola foto-foto galeri
   - **Fasilitas**: Kelola fasilitas yang tersedia
   - **Slider**: Kelola banner/slider di halaman beranda
   - **User**: Kelola data pengguna
   - **Jadwal**: Kelola jadwal lapangan
   - **Pesan**: Kelola pesan yang masuk
   - **Laporan**: Lihat laporan booking dan statistik
   - **Pengaturan**: Konfigurasi pengaturan aplikasi

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi, silakan:

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini dilisensikan di bawah **Apache License 2.0**. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## 📧 Kontak

Jika Anda memiliki pertanyaan atau masalah, silakan hubungi:

- **Email**: info@orionjaya.com
- **Website**: www.orionjaya.com

---

Dibuat dengan ❤️ oleh Tim Orion Jaya

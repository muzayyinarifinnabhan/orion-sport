import type { Lapangan, Booking, User, Jadwal, Fasilitas, Galeri, Artikel, Pesan, Pengaturan } from '../types'

export const fasilitasData: Fasilitas[] = [
  { id: 'f1', nama: 'Musholla', icon: 'Mosque', deskripsi: 'Musholla bersih dan nyaman untuk ibadah' },
  { id: 'f2', nama: 'Parkir Mobil', icon: 'Car', deskripsi: 'Area parkir mobil luas dan aman' },
  { id: 'f3', nama: 'Parkir Motor', icon: 'Bike', deskripsi: 'Parkir motor gratis dengan keamanan 24 jam' },
  { id: 'f4', nama: 'Ruang Ganti', icon: 'DoorOpen', deskripsi: 'Ruang ganti bersih dengan loker' },
  { id: 'f5', nama: 'Jual Minuman', icon: 'CupSoda', deskripsi: 'Berbagai minuman segar tersedia' },
  { id: 'f6', nama: 'Jual Makanan Ringan', icon: 'CakeSlice', deskripsi: 'Camilan ringan untuk teman olahraga' },
]

export const lapanganData: Lapangan[] = [
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `badminton-${i + 1}`,
    nama: `Lapangan Badminton ${i + 1}`,
    jenis: 'Badminton Karpet Vinyl' as const,
    hargaPerJam: 50000,
    kapasitas: 4,
    deskripsi: 'Lapangan badminton standar internasional dengan lantai karpet vinyl premium, pencahayaan optimal, dan sistem sirkulasi udara yang baik. Cocok untuk latihan dan pertandingan.',
    fasilitasIds: ['f1', 'f4', 'f5'],
    gambar: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'],
    tersedia: true,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `futsal-rumput-${i + 1}`,
    nama: `Lapangan Futsal Rumput ${i + 1}`,
    jenis: 'Futsal Rumput Sintetis' as const,
    hargaPerJam: 120000,
    kapasitas: 12,
    deskripsi: 'Lapangan futsal dengan rumput sintetis berkualitas tinggi, nyaman dan aman untuk bermain. Dilengkapi dengan lampu penerangan untuk sesi malam.',
    fasilitasIds: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
    gambar: ['https://images.unsplash.com/photo-1577415124269-fc1140af69b8?w=800&q=80'],
    tersedia: true,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `futsal-interlock-${i + 1}`,
    nama: `Lapangan Futsal Interlock ${i + 1}`,
    jenis: 'Futsal Interlock' as const,
    hargaPerJam: 150000,
    kapasitas: 12,
    deskripsi: 'Lapangan futsal interlock premium dengan permukaan anti-slip, nyaman untuk permainan cepat. Standar turnamen dengan garis lapangan yang presisi.',
    fasilitasIds: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
    gambar: ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'],
    tersedia: true,
  })),
  {
    id: 'basket-1',
    nama: 'Lapangan Basketball',
    jenis: 'Basketball Parkit Vinyl' as const,
    hargaPerJam: 200000,
    kapasitas: 20,
    deskripsi: 'Lapangan basketball parkit vinyl standar internasional dengan lantai berkualitas, ring basket profesional, dan papan skor elektronik. Tersedia tribun penonton.',
    fasilitasIds: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
    gambar: ['https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80'],
    tersedia: true,
  },
]

export const jadwalData: Jadwal[] = [
  ...lapanganData.map((l, _i) => [
    { id: `${l.id}-senin`, lapanganId: l.id, hari: 'Senin' as const, jamBuka: '08:00', jamTutup: '22:00' },
    { id: `${l.id}-selasa`, lapanganId: l.id, hari: 'Selasa' as const, jamBuka: '08:00', jamTutup: '22:00' },
    { id: `${l.id}-rabu`, lapanganId: l.id, hari: 'Rabu' as const, jamBuka: '08:00', jamTutup: '22:00' },
    { id: `${l.id}-kamis`, lapanganId: l.id, hari: 'Kamis' as const, jamBuka: '08:00', jamTutup: '22:00' },
    { id: `${l.id}-jumat`, lapanganId: l.id, hari: 'Jumat' as const, jamBuka: '08:00', jamTutup: '22:00' },
    { id: `${l.id}-sabtu`, lapanganId: l.id, hari: 'Sabtu' as const, jamBuka: '08:00', jamTutup: '23:00' },
    { id: `${l.id}-minggu`, lapanganId: l.id, hari: 'Minggu' as const, jamBuka: '08:00', jamTutup: '23:00' },
  ]).flat(),
]

export const bookingData: Booking[] = [
  {
    id: 'b1',
    lapanganId: 'badminton-1',
    namaPemesan: 'Ahmad Rizki',
    email: 'ahmad@email.com',
    telepon: '081234567890',
    tanggal: '2026-06-01',
    jamMulai: '09:00',
    jamSelesai: '11:00',
    totalHarga: 100000,
    status: 'confirmed',
    createdAt: '2026-05-28T10:00:00Z',
  },
  {
    id: 'b2',
    lapanganId: 'futsal-rumput-1',
    namaPemesan: 'Budi Santoso',
    email: 'budi@email.com',
    telepon: '081234567891',
    tanggal: '2026-06-01',
    jamMulai: '14:00',
    jamSelesai: '16:00',
    totalHarga: 240000,
    status: 'pending',
    createdAt: '2026-05-29T08:00:00Z',
  },
  {
    id: 'b3',
    lapanganId: 'basket-1',
    namaPemesan: 'Dewi Lestari',
    email: 'dewi@email.com',
    telepon: '081234567892',
    tanggal: '2026-06-02',
    jamMulai: '10:00',
    jamSelesai: '12:00',
    totalHarga: 400000,
    status: 'completed',
    createdAt: '2026-05-27T15:00:00Z',
  },
]

export const userData: User[] = [
  {
    id: 'u1',
    nama: 'Admin Orion',
    email: 'admin@orionjaya.com',
    telepon: '081234567899',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'u2',
    nama: 'Ahmad Rizki',
    email: 'ahmad@email.com',
    telepon: '081234567890',
    password: 'user123',
    role: 'user',
  },
]

export const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'] as const

export const jenisLapanganList = [
  { jenis: 'Badminton Karpet Vinyl', count: 6, icon: 'Badminton' },
  { jenis: 'Futsal Rumput Sintetis', count: 4, icon: 'Futsal' },
  { jenis: 'Futsal Interlock', count: 2, icon: 'Futsal' },
  { jenis: 'Basketball Parkit Vinyl', count: 1, icon: 'Basket' },
] as const

export const jamTersedia = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
]

export const galeriData: Galeri[] = [
  { id: 'g1', gambar: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80', judul: 'Lapangan Badminton Premium', deskripsi: 'Lapangan badminton dengan lantai kayu standar internasional', kategori: 'Badminton', createdAt: '2026-05-01' },
  { id: 'g2', gambar: 'https://images.unsplash.com/photo-1577415124269-fc1140af69b8?w=600&q=80', judul: 'Lapangan Futsal Rumput', deskripsi: 'Lapangan futsal dengan rumput sintetis berkualitas', kategori: 'Futsal', createdAt: '2026-05-02' },
  { id: 'g3', gambar: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80', judul: 'Lapangan Futsal Vinyl', deskripsi: 'Lapangan futsal vinyl anti-slip', kategori: 'Futsal', createdAt: '2026-05-03' },
  { id: 'g4', gambar: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80', judul: 'Lapangan Basket Indoor', deskripsi: 'Lapangan basket indoor dengan tribun penonton', kategori: 'Basket', createdAt: '2026-05-04' },
  { id: 'g5', gambar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', judul: 'Suasana Pertandingan', deskripsi: 'Suasana pertandingan olahraga di Orion Jaya', kategori: 'Event', createdAt: '2026-05-05' },
  { id: 'g6', gambar: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&q=80', judul: 'Area Parkir Luas', deskripsi: 'Area parkir yang luas dan aman', kategori: 'Fasilitas', createdAt: '2026-05-06' },
  { id: 'g7', gambar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', judul: 'Musholla Nyaman', deskripsi: 'Musholla bersih untuk beribadah', kategori: 'Fasilitas', createdAt: '2026-05-07' },
  { id: 'g8', gambar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', judul: 'Ruang Ganti & Loker', deskripsi: 'Ruang ganti dengan loker pengaman', kategori: 'Fasilitas', createdAt: '2026-05-08' },
]

export const artikelData: Artikel[] = [
  { id: 'a1', gambar: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80', judul: 'Tips Memilih Raket Badminton untuk Pemula', konten: 'Ingin mulai main badminton? Simak tips memilih raket yang tepat sesuai kebutuhan dan budget Anda.', kategori: 'Tips', penulis: 'Admin Orion', tanggal: '25 Mei 2026', createdAt: '2026-05-25' },
  { id: 'a2', gambar: 'https://images.unsplash.com/photo-1577415124269-fc1140af69b8?w=600&q=80', judul: 'Jadwal Turnamen Futsal Orion Jaya 2026', konten: 'Turnamen futsal antar komunitas akan digelar bulan depan. Daftarkan tim Anda sekarang!', kategori: 'Event', penulis: 'Admin Orion', tanggal: '20 Mei 2026', createdAt: '2026-05-20' },
  { id: 'a3', gambar: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80', judul: '5 Manfaat Bermain Basket untuk Kesehatan', konten: 'Bukan hanya menyenangkan, bermain basket juga punya segudang manfaat bagi tubuh Anda.', kategori: 'Kesehatan', penulis: 'Admin Orion', tanggal: '15 Mei 2026', createdAt: '2026-05-15' },
  { id: 'a4', gambar: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80', judul: 'Promo Spesial: Diskon 20% Booking Weekday', konten: 'Nikmati diskon 20% untuk setiap booking lapangan di hari Senin sampai Kamis.', kategori: 'Promo', penulis: 'Admin Orion', tanggal: '10 Mei 2026', createdAt: '2026-05-10' },
  { id: 'a5', gambar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', judul: 'Cara Meningkatkan Stamina saat Bermain Futsal', konten: 'Ikuti tips-tips berikut agar stamina Anda tetap prima selama pertandingan futsal.', kategori: 'Tips', penulis: 'Admin Orion', tanggal: '5 Mei 2026', createdAt: '2026-05-05' },
  { id: 'a6', gambar: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&q=80', judul: 'Kompetisi Basket Antar SMA se-Jakarta', konten: 'Orion Jaya menjadi tuan rumah kompetisi basket antar SMA yang akan digelar bulan Juni.', kategori: 'Event', penulis: 'Admin Orion', tanggal: '28 April 2026', createdAt: '2026-04-28' },
  { id: 'a7', gambar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', judul: 'Program Latihan Badminton untuk Pemula', konten: 'Ikuti program latihan badminton 4 minggu yang dirancang khusus untuk pemula.', kategori: 'Latihan', penulis: 'Admin Orion', tanggal: '20 April 2026', createdAt: '2026-04-20' },
  { id: 'a8', gambar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', judul: 'Cara Merawat Sepatu Olahraga', konten: 'Tips merawat sepatu olahraga agar awet dan tetap nyaman digunakan.', kategori: 'Tips', penulis: 'Admin Orion', tanggal: '15 April 2026', createdAt: '2026-04-15' },
]

export const pesanData: Pesan[] = []

export const pengaturanData: Pengaturan = {
  nama: 'Orion Jaya',
  alamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
  telepon: '+62 812-3456-7890',
  email: 'info@orionjaya.com',
  jamBuka: '08:00',
  jamTutup: '22:00',
  jamBukaWeekend: '08:00',
  jamTutupWeekend: '23:00',
  googleMaps: '',
}

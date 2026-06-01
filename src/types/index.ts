export interface Lapangan {
  id: string
  nama: string
  jenis: 'Badminton Karpet Vinyl' | 'Futsal Rumput Sintetis' | 'Futsal Interlock' | 'Basketball Parkit Vinyl'
  hargaPerJam: number
  kapasitas: number
  deskripsi: string
  fasilitasIds: string[]
  gambar: string[]
  tersedia: boolean
}

export interface Booking {
  id: string
  lapanganId: string
  namaPemesan: string
  email: string
  telepon: string
  tanggal: string
  jamMulai: string
  jamSelesai: string
  totalHarga: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  catatan?: string
  metodePembayaran?: string
}

export interface User {
  id: string
  nama: string
  email: string
  telepon: string
  password: string
  role: 'user' | 'admin'
}

export interface Jadwal {
  id: string
  lapanganId: string
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu'
  jamBuka: string
  jamTutup: string
}

export interface Fasilitas {
  id: string
  nama: string
  icon: string
  deskripsi: string
}

export interface Galeri {
  id: string
  gambar: string
  judul: string
  deskripsi: string
  kategori: string
  createdAt: string
}

export interface Artikel {
  id: string
  gambar: string
  judul: string
  konten: string
  kategori: string
  penulis: string
  tanggal: string
  createdAt: string
}

export interface Slider {
  id: string
  image: string
  judul: string
  subjudul: string
  urutan: number
}

export interface Pesan {
  id: string
  nama: string
  email: string
  pesan: string
  createdAt: string
  dibaca: boolean
}

export interface PaymentMethod {
  id: string
  metode: string
  label: string
  deskripsi: string
  noRekening: string
  atasNama: string
  bankName: string
  noEwallet: string
  qrImage: string
  kodeGerai: string
  cardInfo: string
  isActive: boolean
  urutan: number
}

export interface Pengaturan {
  nama: string
  alamat: string
  telepon: string
  email: string
  jamBuka: string
  jamTutup: string
  jamBukaWeekend: string
  jamTutupWeekend: string
  googleMaps: string
}

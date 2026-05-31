-- =============================================================
-- Orion Jaya Booking - Full Database Schema for Supabase
-- =============================================================
-- Jalankan SQL ini di Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- 1. TABEL-TABEL
-- =============================================================

-- Fasilitas
create table if not exists public.fasilitas (
  id text primary key,
  nama text not null,
  icon text not null default 'Building2',
  deskripsi text not null default ''
);
alter table public.fasilitas enable row level security;

-- Lapangan
create table if not exists public.lapangan (
  id text primary key,
  nama text not null,
  jenis text not null,
  harga_per_jam numeric not null default 0,
  kapasitas integer not null default 0,
  deskripsi text not null default '',
  fasilitas_ids text[] not null default '{}',
  gambar text[] not null default '{}',
  tersedia boolean not null default true
);
alter table public.lapangan enable row level security;

-- Users
create table if not exists public.users (
  id text primary key,
  nama text not null,
  email text not null unique,
  telepon text not null default '',
  password text not null,
  role text not null default 'user' check (role in ('user', 'admin'))
);
alter table public.users enable row level security;

-- Booking
create table if not exists public.booking (
  id text primary key,
  lapangan_id text not null references public.lapangan(id) on delete cascade,
  nama_pemesan text not null,
  email text not null,
  telepon text not null,
  tanggal text not null,
  jam_mulai text not null,
  jam_selesai text not null,
  total_harga numeric not null default 0,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  created_at text not null,
  catatan text default ''
);
alter table public.booking enable row level security;

-- Jadwal
create table if not exists public.jadwal (
  id text primary key,
  lapangan_id text not null references public.lapangan(id) on delete cascade,
  hari text not null check (hari in ('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu')),
  jam_buka text not null,
  jam_tutup text not null
);
alter table public.jadwal enable row level security;

-- Galeri
create table if not exists public.galeri (
  id text primary key,
  gambar text not null,
  judul text not null,
  deskripsi text not null default '',
  kategori text not null default '',
  created_at text not null
);
alter table public.galeri enable row level security;

-- Artikel
create table if not exists public.artikel (
  id text primary key,
  gambar text not null,
  judul text not null,
  konten text not null default '',
  kategori text not null default '',
  penulis text not null default 'Admin Orion',
  tanggal text not null default '',
  created_at text not null
);
alter table public.artikel enable row level security;

-- Pengaturan (single row)
create table if not exists public.pengaturan (
  id text primary key default 'default',
  nama text not null default 'Orion Jaya',
  alamat text not null default '',
  telepon text not null default '',
  email text not null default '',
  jam_buka text not null default '08:00',
  jam_tutup text not null default '22:00',
  jam_buka_weekend text not null default '08:00',
  jam_tutup_weekend text not null default '23:00',
  google_maps text not null default ''
);
alter table public.pengaturan enable row level security;

-- Pesan (contact form submissions)
create table if not exists public.pesan (
  id text primary key,
  nama text not null,
  email text not null,
  pesan text not null,
  created_at text not null,
  dibaca boolean not null default false
);
alter table public.pesan enable row level security;

-- Slider (hero slides)
create table if not exists public.slider (
  id text primary key,
  image text not null,
  judul text not null,
  subjudul text not null default '',
  urutan integer not null default 0
);
alter table public.slider enable row level security;

-- 2. RLS POLICIES (allow all access for simplicity - sesuaikan sesuai kebutuhan)
-- =============================================================
-- Untuk production, ganti dengan policies yang lebih ketat
-- menggunakan Supabase Auth (auth.uid())

do $$
declare
  tbl text;
begin
  for tbl in select unnest(array['fasilitas','lapangan','users','booking','jadwal','galeri','artikel','pengaturan','pesan','slider'])
  loop
    execute format('drop policy if exists "Public access" on public.%I', tbl);
    execute format('create policy "Public access" on public.%I using (true) with check (true)', tbl);
  end loop;
end;
$$;

-- 3. SEED DATA
-- =============================================================

-- Fasilitas
insert into public.fasilitas (id, nama, icon, deskripsi) values
  ('f1', 'Musholla', 'Mosque', 'Musholla bersih dan nyaman untuk ibadah'),
  ('f2', 'Parkir Mobil', 'Car', 'Area parkir mobil luas dan aman'),
  ('f3', 'Parkir Motor', 'Bike', 'Parkir motor gratis dengan keamanan 24 jam'),
  ('f4', 'Ruang Ganti', 'DoorOpen', 'Ruang ganti bersih dengan loker'),
  ('f5', 'Jual Minuman', 'CupSoda', 'Berbagai minuman segar tersedia'),
  ('f6', 'Jual Makanan Ringan', 'CakeSlice', 'Camilan ringan untuk teman olahraga')
on conflict (id) do nothing;

-- Lapangan
insert into public.lapangan (id, nama, jenis, harga_per_jam, kapasitas, deskripsi, fasilitas_ids, gambar, tersedia)
select 'badminton-' || i, 'Lapangan Badminton ' || i, 'Badminton Karpet Vinyl', 50000, 4,
  'Lapangan badminton standar internasional dengan lantai karpet vinyl premium, pencahayaan optimal, dan sistem sirkulasi udara yang baik.',
  array['f1','f4','f5'], array['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'], true
from generate_series(1,6) as i
on conflict (id) do nothing;

insert into public.lapangan (id, nama, jenis, harga_per_jam, kapasitas, deskripsi, fasilitas_ids, gambar, tersedia)
select 'futsal-rumput-' || i, 'Lapangan Futsal Rumput ' || i, 'Futsal Rumput Sintetis', 120000, 12,
  'Lapangan futsal dengan rumput sintetis berkualitas tinggi, nyaman dan aman untuk bermain.',
  array['f1','f2','f3','f4','f5','f6'], array['https://images.unsplash.com/photo-1577415124269-fc1140af69b8?w=800&q=80'], true
from generate_series(1,4) as i
on conflict (id) do nothing;

insert into public.lapangan (id, nama, jenis, harga_per_jam, kapasitas, deskripsi, fasilitas_ids, gambar, tersedia)
select 'futsal-interlock-' || i, 'Lapangan Futsal Interlock ' || i, 'Futsal Interlock', 150000, 12,
  'Lapangan futsal interlock premium dengan permukaan anti-slip, nyaman untuk permainan cepat.',
  array['f1','f2','f3','f4','f5','f6'], array['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'], true
from generate_series(1,2) as i
on conflict (id) do nothing;

insert into public.lapangan (id, nama, jenis, harga_per_jam, kapasitas, deskripsi, fasilitas_ids, gambar, tersedia) values
  ('basket-1', 'Lapangan Basketball', 'Basketball Parkit Vinyl', 200000, 20,
   'Lapangan basketball parkit vinyl standar internasional dengan lantai berkualitas, ring basket profesional.',
   array['f1','f2','f3','f4','f5','f6'], array['https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80'], true)
on conflict (id) do nothing;

-- Users
insert into public.users (id, nama, email, telepon, password, role) values
  ('u1', 'Admin Orion', 'admin@orionjaya.com', '081234567899', 'admin123', 'admin'),
  ('u2', 'Ahmad Rizki', 'ahmad@email.com', '081234567890', 'user123', 'user')
on conflict (id) do nothing;

-- Jadwal
insert into public.jadwal (id, lapangan_id, hari, jam_buka, jam_tutup)
select l.id || '-senin', l.id, 'Senin', '08:00', '22:00' from public.lapangan l
union all
select l.id || '-selasa', l.id, 'Selasa', '08:00', '22:00' from public.lapangan l
union all
select l.id || '-rabu', l.id, 'Rabu', '08:00', '22:00' from public.lapangan l
union all
select l.id || '-kamis', l.id, 'Kamis', '08:00', '22:00' from public.lapangan l
union all
select l.id || '-jumat', l.id, 'Jumat', '08:00', '22:00' from public.lapangan l
union all
select l.id || '-sabtu', l.id, 'Sabtu', '08:00', '23:00' from public.lapangan l
union all
select l.id || '-minggu', l.id, 'Minggu', '08:00', '23:00' from public.lapangan l
on conflict (id) do nothing;

-- Booking
insert into public.booking (id, lapangan_id, nama_pemesan, email, telepon, tanggal, jam_mulai, jam_selesai, total_harga, status, created_at) values
  ('b1', 'badminton-1', 'Ahmad Rizki', 'ahmad@email.com', '081234567890', '2026-06-01', '09:00', '11:00', 100000, 'confirmed', '2026-05-28T10:00:00Z'),
  ('b2', 'futsal-rumput-1', 'Budi Santoso', 'budi@email.com', '081234567891', '2026-06-01', '14:00', '16:00', 240000, 'pending', '2026-05-29T08:00:00Z'),
  ('b3', 'basket-1', 'Dewi Lestari', 'dewi@email.com', '081234567892', '2026-06-02', '10:00', '12:00', 400000, 'completed', '2026-05-27T15:00:00Z')
on conflict (id) do nothing;

-- Galeri
insert into public.galeri (id, gambar, judul, deskripsi, kategori, created_at) values
  ('g1', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80', 'Lapangan Badminton Premium', 'Lapangan badminton dengan lantai kayu standar internasional', 'Badminton', '2026-05-01'),
  ('g2', 'https://images.unsplash.com/photo-1577415124269-fc1140af69b8?w=600&q=80', 'Lapangan Futsal Rumput', 'Lapangan futsal dengan rumput sintetis berkualitas', 'Futsal', '2026-05-02'),
  ('g3', 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80', 'Lapangan Futsal Vinyl', 'Lapangan futsal vinyl anti-slip', 'Futsal', '2026-05-03'),
  ('g4', 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80', 'Lapangan Basket Indoor', 'Lapangan basket indoor dengan tribun penonton', 'Basket', '2026-05-04'),
  ('g5', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', 'Suasana Pertandingan', 'Suasana pertandingan olahraga di Orion Jaya', 'Event', '2026-05-05'),
  ('g6', 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&q=80', 'Area Parkir Luas', 'Area parkir yang luas dan aman', 'Fasilitas', '2026-05-06'),
  ('g7', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', 'Musholla Nyaman', 'Musholla bersih untuk beribadah', 'Fasilitas', '2026-05-07'),
  ('g8', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', 'Ruang Ganti & Loker', 'Ruang ganti dengan loker pengaman', 'Fasilitas', '2026-05-08')
on conflict (id) do nothing;

-- Artikel
insert into public.artikel (id, gambar, judul, konten, kategori, penulis, tanggal, created_at) values
  ('a1', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80', 'Tips Memilih Raket Badminton untuk Pemula', 'Ingin mulai main badminton? Simak tips memilih raket yang tepat sesuai kebutuhan dan budget Anda.', 'Tips', 'Admin Orion', '25 Mei 2026', '2026-05-25'),
  ('a2', 'https://images.unsplash.com/photo-1577415124269-fc1140af69b8?w=600&q=80', 'Jadwal Turnamen Futsal Orion Jaya 2026', 'Turnamen futsal antar komunitas akan digelar bulan depan. Daftarkan tim Anda sekarang!', 'Event', 'Admin Orion', '20 Mei 2026', '2026-05-20'),
  ('a3', 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80', '5 Manfaat Bermain Basket untuk Kesehatan', 'Bukan hanya menyenangkan, bermain basket juga punya segudang manfaat bagi tubuh Anda.', 'Kesehatan', 'Admin Orion', '15 Mei 2026', '2026-05-15'),
  ('a4', 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80', 'Promo Spesial: Diskon 20% Booking Weekday', 'Nikmati diskon 20% untuk setiap booking lapangan di hari Senin sampai Kamis.', 'Promo', 'Admin Orion', '10 Mei 2026', '2026-05-10'),
  ('a5', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', 'Cara Meningkatkan Stamina saat Bermain Futsal', 'Ikuti tips-tips berikut agar stamina Anda tetap prima selama pertandingan futsal.', 'Tips', 'Admin Orion', '5 Mei 2026', '2026-05-05'),
  ('a6', 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&q=80', 'Kompetisi Basket Antar SMA se-Jakarta', 'Orion Jaya menjadi tuan rumah kompetisi basket antar SMA yang akan digelar bulan Juni.', 'Event', 'Admin Orion', '28 April 2026', '2026-04-28'),
  ('a7', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', 'Program Latihan Badminton untuk Pemula', 'Ikuti program latihan badminton 4 minggu yang dirancang khusus untuk pemula.', 'Latihan', 'Admin Orion', '20 April 2026', '2026-04-20'),
  ('a8', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', 'Cara Merawat Sepatu Olahraga', 'Tips merawat sepatu olahraga agar awet dan tetap nyaman digunakan.', 'Tips', 'Admin Orion', '15 April 2026', '2026-04-15')
on conflict (id) do nothing;

-- Pengaturan (single row)
insert into public.pengaturan (id, nama, alamat, telepon, email, jam_buka, jam_tutup, jam_buka_weekend, jam_tutup_weekend, google_maps) values
  ('default', 'Orion Jaya', 'Jl. Merdeka No. 123, Jakarta Pusat', '+62 812-3456-7890', 'info@orionjaya.com', '08:00', '22:00', '08:00', '23:00', '')
on conflict (id) do nothing;

-- Slider
insert into public.slider (id, image, judul, subjudul, urutan) values
  ('s1', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&q=80', 'Tempat Terbaik untuk Olahragamu', 'Booking lapangan badminton, futsal, dan basket dengan mudah & cepat', 1),
  ('s2', 'https://images.unsplash.com/photo-1577415124269-fc1140af69b8?w=1600&q=80', 'Fasilitas Premium, Harga Terjangkau', 'Nikmati pengalaman olahraga dengan fasilitas terbaik', 2),
  ('s3', 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=1600&q=80', 'Booking Online, Main Tanpa Antri', 'Pesan lapangan favoritmu kapan saja, di mana saja', 3)
on conflict (id) do nothing;

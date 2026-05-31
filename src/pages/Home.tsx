import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, MapPin, Users, Star, ChevronLeft, ChevronRight,
  Award, BadgeCheck, CalendarDays, User,
  Building2, Car, Bike, DoorOpen, CupSoda, CakeSlice, Loader2
} from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import LapanganCard from '../components/lapangan/LapanganCard'
import { useApp } from '../store/AppContext'

const iconMap = {
  Mosque: Building2, Car, Bike, DoorOpen, CupSoda, CakeSlice
}

export default function Home() {
  const { lapangan, fasilitas, galeri, artikel, slider, loading } = useApp()
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [...slider].sort((a, b) => a.urutan - b.urutan)
  const sortedGaleri = [...galeri].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const sortedArtikel = [...artikel].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const galleryImages = sortedGaleri.map((g) => g.gambar)

  useEffect(() => {
    if (!heroSlides.length) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const nextSlide = () => heroSlides.length && setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => heroSlides.length && setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-3" />
        <p className="text-gray-500 font-medium text-sm animate-pulse">Memuat halaman...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 overflow-hidden">
      
      {/* ================= HERO SECTION (SLIDER) ================= */}
      <section className="relative h-[85vh] min-h-[550px] max-h-[800px] w-full bg-violet-950">
        {heroSlides.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={heroSlides[currentSlide].image} 
                alt="" 
                className="w-full h-full object-cover object-center" 
              />
              {/* Gelap overlay bertingkat agar teks putih kontras tinggi */}
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/20" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-700 to-indigo-900" />
        )}

        {/* Konten Text di Atas Slider */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-400 text-xs sm:text-sm mb-6 border border-white/20 shadow-sm mx-auto">
                <MapPin size={14} />
                <span>Orion Jaya Sport Center</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight drop-shadow-md">
                {heroSlides[currentSlide] ? heroSlides[currentSlide].judul : "Selamat Datang di Orion Jaya"}
              </h1>
              
              <p className="text-sm sm:text-lg text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-sm font-light">
                {heroSlides[currentSlide] ? heroSlides[currentSlide].subjudul : "Booking lapangan sekarang dan nikmati pengalaman olahraga terbaik bersama Orion Jaya"}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-all shadow-lg hover:shadow-violet-500/30 text-sm sm:text-base"
                >
                  Booking Sekarang <ArrowRight size={18} />
                </Link>
                <Link
                  to="/lapangan"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all border border-white/30 text-sm sm:text-base"
                >
                  Lihat Lapangan
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigasi Panah Slider */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
            <button onClick={prevSlide} className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10">
              <ChevronLeft size={16} className="text-white" />
            </button>
            <div className="flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10">
              <ChevronRight size={16} className="text-white" />
            </button>
          </div>
        )}
      </section>

      {/* ================= STATS ================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: MapPin, label: 'Total Lapangan', value: '13', color: 'text-violet-600' },
            { icon: Users, label: 'Pelanggan Puas', value: '1000+', color: 'text-amber-500' },
            { icon: Award, label: 'Tahun Berdiri', value: '5+', color: 'text-emerald-500' },
            { icon: Star, label: 'Rating Kepuasan', value: '4.9', color: 'text-blue-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 sm:p-6 text-center bg-white border border-gray-100 shadow-sm"
            >
              <stat.icon size={26} className={`${stat.color} mx-auto mb-2`} />
              <div className="text-xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= JENIS LAPANGAN ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">Jenis Lapangan</h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                Tersedia berbagai pilihan lapangan olahraga dengan kualitas terbaik
              </p>
            </div>
          </ScrollReveal>
          
          {lapangan.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada data lapangan</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {lapangan.slice(0, 4).map((l, i) => (
                <ScrollReveal key={l.id} delay={i * 0.1}>
                  <LapanganCard lapangan={l} fasilitas={fasilitas} />
                </ScrollReveal>
              ))}
            </div>
          )}
          
          <ScrollReveal>
            <div className="text-center mt-10">
              <Link
                to="/lapangan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm text-sm"
              >
                Lihat Semua Lapangan <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= FASILITAS ================= */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">Fasilitas Kami</h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                Nikmati fasilitas lengkap untuk kenyamanan olahragamu
              </p>
            </div>
          </ScrollReveal>
          
          {fasilitas.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada data fasilitas</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {fasilitas.map((f, i) => {
                const Icon = iconMap[f.icon] || BadgeCheck
                return (
                  <ScrollReveal key={f.id} delay={i * 0.08}>
                    <div className="rounded-2xl p-5 text-center bg-gray-50 border border-gray-100 hover:border-violet-200 hover:bg-white hover:shadow-sm transition-all duration-300 group">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-600 transition-colors duration-300">
                        <Icon size={22} className="text-violet-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h4 className="text-gray-800 font-semibold text-xs sm:text-sm">{f.nama}</h4>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= GALERI ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">Galeri</h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                Lihat langsung kondisi lapangan premium kami
              </p>
            </div>
          </ScrollReveal>
          
          {galleryImages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada data galeri</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.slice(0, 4).map((img, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="relative group rounded-2xl overflow-hidden aspect-[4/3] shadow-sm border border-gray-100">
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
          
          <ScrollReveal>
            <div className="text-center mt-8">
              <Link
                to="/galeri"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm text-sm"
              >
                Lihat Selengkapnya <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= ARTIKEL & BERITA ================= */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">Artikel & Berita</h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                Informasi terbaru seputar olahraga dan Orion Jaya
              </p>
            </div>
          </ScrollReveal>
          
          {sortedArtikel.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada data artikel</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedArtikel.slice(0, 4).map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.08}>
                  <Link to={`/artikel/${item.id}`} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group block h-full">
                    <div className="aspect-[16/10] overflow-hidden bg-gray-50">
                      <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md border border-violet-100">
                        {item.kategori}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 mt-3 mb-1 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors">
                        {item.judul}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                        {item.konten}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 border-t border-gray-50 pt-3">
                        <span className="flex items-center gap-1"><CalendarDays size={12} /> {item.tanggal}</span>
                        <span className="flex items-center gap-1"><User size={12} /> {item.penulis}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
          
          <ScrollReveal>
            <div className="text-center mt-10">
              <Link
                to="/artikel"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm text-sm"
              >
                Lihat Selengkapnya <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= CTA (SIAP UNTUK BEROLAHRAGA?) ================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            {/* Menghapus class custom .card agar tidak memutihkan background secara tidak sengaja */}
            <div className="rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-violet-600 to-indigo-800 shadow-xl shadow-violet-600/10 text-white">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Siap untuk Berolahraga?
              </h2>
              <p className="text-violet-100 mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-light">
                Booking lapangan sekarang dan nikmati pengalaman olahraga terbaik bersama Orion Jaya dengan sistem yang cepat.
              </p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-violet-700 font-bold hover:bg-gray-50 transition-all shadow-md hover:scale-[1.02] duration-200 text-sm sm:text-base"
              >
                Booking Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Newspaper, CalendarDays, User, ArrowRight } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import { useApp } from '../store/AppContext'

const kategoriList = ['Semua', 'Tips', 'Event', 'Kesehatan', 'Promo', 'Latihan']

export default function ArtikelPage() {
  const { artikel } = useApp()
  const [filter, setFilter] = useState('Semua')

  const sorted = [...artikel].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const filtered = filter === 'Semua' ? sorted : sorted.filter((a) => a.kategori === filter)

  return (
    <div className="pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200/50">
              <Newspaper size={28} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Artikel & Berita</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Informasi terbaru seputar olahraga dan Orion Jaya
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {kategoriList.map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === k
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.08}>
              <Link
                to={`/artikel/${item.id}`}
                className="block bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                    {item.kategori}
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 mt-2 mb-1 line-clamp-2 leading-snug">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {item.konten}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><CalendarDays size={12} /> {item.tanggal}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {item.penulis}</span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-600 group-hover:text-violet-700 transition-colors">
                    Selengkapnya <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Newspaper size={48} className="mx-auto mb-3 opacity-30" />
            <p>Tidak ada artikel untuk kategori ini</p>
          </div>
        )}
      </div>
    </div>
  )
}

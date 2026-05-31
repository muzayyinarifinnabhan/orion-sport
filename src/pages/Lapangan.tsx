import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ui/ScrollReveal'
import LapanganCard from '../components/lapangan/LapanganCard'
import { useApp } from '../store/AppContext'

const jenisFilter = ['Semua', 'Badminton Karpet Vinyl', 'Futsal Rumput Sintetis', 'Futsal Interlock', 'Basketball Parkit Vinyl']

export default function LapanganPage() {
  const { lapangan, fasilitas } = useApp()
  const [filter, setFilter] = useState('Semua')

  const filtered = filter === 'Semua' ? lapangan : lapangan.filter((l) => l.jenis === filter)

  return (
    <div className="pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Lapangan Kami</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Tersedia 13 lapangan dengan berbagai pilihan olahraga
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {jenisFilter.map((j) => (
              <button
                key={j}
                onClick={() => setFilter(j)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === j
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((l, i) => (
            <ScrollReveal key={l.id} delay={i * 0.08}>
              <motion.div layout>
                <LapanganCard lapangan={l} fasilitas={fasilitas} />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>Tidak ada lapangan untuk kategori ini</p>
          </div>
        )}
      </div>
    </div>
  )
}

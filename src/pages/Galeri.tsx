import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import { useApp } from '../store/AppContext'

const kategoriList = ['Semua', 'Badminton', 'Futsal', 'Basket', 'Event', 'Fasilitas']

export default function GaleriPage() {
  const { galeri } = useApp()
  const [filter, setFilter] = useState('Semua')
  const [selected, setSelected] = useState<string | null>(null)

  const sorted = [...galeri].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const filtered = filter === 'Semua' ? sorted : sorted.filter((g) => g.kategori === filter)
  const selectedItem = galeri.find((g) => g.id === selected)

  return (
    <div className="pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200/50">
              <Image size={28} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Galeri</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Lihat langsung kondisi lapangan dan fasilitas Orion Sports Center
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.05}>
              <motion.button
                layoutId={`galeri-${item.id}`}
                onClick={() => setSelected(item.id)}
                className="relative group rounded-2xl overflow-hidden aspect-[4/3] w-full shadow-md hover:shadow-lg transition-all"
              >
                <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">{item.judul}</p>
                    <span className="text-white/70 text-xs">{item.kategori}</span>
                  </div>
                </div>
              </motion.button>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Image size={48} className="mx-auto mb-3 opacity-30" />
            <p>Tidak ada gambar untuk kategori ini</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              layoutId={`galeri-${selectedItem.id}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full rounded-2xl overflow-hidden bg-white shadow-2xl"
            >
              <div className="relative">
                <img src={selectedItem.gambar} alt={selectedItem.judul} className="w-full aspect-video object-cover" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                  {selectedItem.kategori}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{selectedItem.judul}</h3>
                <p className="text-gray-600 mt-2">{selectedItem.deskripsi}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

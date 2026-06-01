import { useParams, Link } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { ArrowLeft, CalendarDays, User, FileText, Loader2, Share2, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function DetailArtikel() {
  const { id } = useParams()
  const { artikel, loading: globalLoading } = useApp()
  
  const [isLocalLoading, setIsLocalLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  const detailArtikel = artikel.find((item) => item.id === id)

  useEffect(() => {
    if (artikel.length > 0 || !globalLoading) {
      const timer = setTimeout(() => {
        setIsLocalLoading(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [artikel, globalLoading, id])

  // --- FUNGSI BAGIKAN SISTEM NATIVE ---
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: detailArtikel?.judul || 'Artikel Orion Sports Center',
          text: `Yuk baca artikel: "${detailArtikel?.judul}"`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Batal membagikan:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Gagal menyalin link: ', err)
      }
    }
  }

  if (isLocalLoading) {
    return (
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-3" />
        <p className="text-gray-500 font-medium text-sm animate-pulse">Memuat artikel...</p>
      </div>
    )
  }

  if (!detailArtikel) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-28 pb-12 bg-gray-50">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4 shadow-sm">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Artikel tidak ditemukan</h2>
        <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
          Artikel yang Anda cari mungkin telah dipindahkan atau sudah dihapus dari sistem.
        </p>
        <Link 
          to="/artikel" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Berita
        </Link>
      </div>
    )
  }

  return (
    // Ditambahkan bg-gray-50 dan padding top (pt-28) agar tidak menempel/hilang di bawah navbar
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-4"
      >
        {/* Container Utama Berbentuk Card Putih yang Bersih */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
          
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              {detailArtikel.kategori}
            </span>

            {/* TOMBOL BAGIKAN */}
            <button
              onClick={handleShare}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-200 ${
                isCopied 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
              }`}
            >
              {isCopied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span>Link Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Bagikan</span>
                </>
              )}
            </button>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            {detailArtikel.judul}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-400 border-b border-gray-100 pb-5 mb-6">
            <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {detailArtikel.tanggal}</span>
            <span className="flex items-center gap-1.5"><User size={14} /> Oleh {detailArtikel.penulis}</span>
          </div>
          
          <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl mb-8 shadow-sm bg-gray-50 border border-gray-100">
            <img src={detailArtikel.gambar} alt={detailArtikel.judul} className="w-full h-full object-cover" />
          </div>
          
          {/* ISI KONTEN ARTIKEL */}
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4 whitespace-pre-line text-sm sm:text-base mb-10 min-h-[100px]">
            {detailArtikel.konten}
          </div>

          {/* --- TOMBOL KEMBALI KE BERITA DI TENGAH BAWAH --- */}
          <div className="flex justify-center items-center pt-6 border-t border-gray-100">
            <Link 
              to="/artikel" 
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-violet-600 text-violet-600 font-bold text-xs sm:text-sm hover:bg-violet-600 hover:text-white transition-all duration-200"
            >
              <ArrowLeft size={16} /> 
              <span>Kembali ke Berita</span>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
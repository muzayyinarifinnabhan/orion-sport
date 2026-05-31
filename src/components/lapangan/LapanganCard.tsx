import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import type { Lapangan, Fasilitas } from '../../types'

interface Props {
  lapangan: Lapangan
  fasilitas: Fasilitas[]
}

export default function LapanganCard({ lapangan, fasilitas }: Props) {
  const facilityBadges = lapangan.fasilitasIds
    .map((id) => fasilitas.find((f) => f.id === id))
    .filter((f): f is Fasilitas => f != null)

  const visibleBadges = facilityBadges.slice(0, 3)
  const extraCount = facilityBadges.length - 3

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group flex flex-col">
      <Link to="/booking" className="relative aspect-[16/10] overflow-hidden block">
        <img
          src={lapangan.gambar[0]}
          alt={lapangan.nama}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
          Rp {lapangan.hargaPerJam.toLocaleString()}/jam
        </span>
        <h3 className="absolute bottom-3 left-3 text-white font-bold text-sm leading-tight">
          {lapangan.nama}
        </h3>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
          {lapangan.deskripsi}
        </p>

        <div className="mb-3">
          <span className="text-xs font-semibold text-gray-700">Fasilitas:</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {visibleBadges.map((f) => (
              <span key={f.id} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                <Check size={10} /> {f.nama}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-medium border border-gray-200">
                +{extraCount} lainnya
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <Link
            to="/booking"
            className="block w-full text-center py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-all shadow-sm"
          >
            Booking Sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}

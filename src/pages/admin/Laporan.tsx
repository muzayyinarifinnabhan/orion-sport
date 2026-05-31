import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, CalendarCheck, DollarSign, Download } from 'lucide-react'
import { useApp } from '../../store/AppContext'

export default function Laporan() {
  const { booking: bookingData, lapangan } = useApp()
  const totalPendapatan = bookingData.reduce((acc, b) => acc + b.totalHarga, 0)
  const totalBooking = bookingData.length
  const bookingSelesai = bookingData.filter((b) => b.status === 'completed').length
  const bookingDibatalkan = bookingData.filter((b) => b.status === 'cancelled').length

  const stats = [
    { label: 'Total Pendapatan', value: `Rp ${totalPendapatan.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Total Booking', value: totalBooking, icon: CalendarCheck, color: 'text-blue-600' },
    { label: 'Booking Selesai', value: bookingSelesai, icon: TrendingUp, color: 'text-violet-600' },
    { label: 'Booking Dibatalkan', value: bookingDibatalkan, icon: BarChart3, color: 'text-red-600' },
  ]

  const pendapatanPerBulan = [12, 18, 15, 22, 20, 28, 24, 30, 26, 32, 35, 40]
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-500 text-sm mt-1">Laporan data booking dan pendapatan</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all shadow-sm">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200 ${s.color}`}>
                <s.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pendapatan per Bulan (Juta)</h3>
          <div className="flex items-end gap-2 h-48">
            {pendapatanPerBulan.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${val * 2}%` }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-violet-400"
                />
                <span className="text-[10px] text-gray-400">{bulan[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Total Lapangan</span>
              <span className="text-gray-900 font-bold">{lapangan.length}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Total Booking</span>
              <span className="text-gray-900 font-bold">{totalBooking}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Booking Selesai</span>
              <span className="text-emerald-600 font-bold">{bookingSelesai}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Booking Dibatalkan</span>
              <span className="text-red-600 font-bold">{bookingDibatalkan}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Total Pendapatan</span>
              <span className="text-amber-600 font-bold text-lg">Rp {totalPendapatan.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

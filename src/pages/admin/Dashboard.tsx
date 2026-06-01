import { motion } from 'framer-motion'
import {
  CalendarCheck, Users, MapPin, DollarSign, TrendingUp, TrendingDown,
} from 'lucide-react'
import { useApp } from '../../store/AppContext'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
}

export default function Dashboard() {
  const { booking, lapangan } = useApp()

  const stats = [
    { label: 'Total Booking', value: booking.length, icon: CalendarCheck, change: '+12%', up: true, color: 'from-violet-50 to-violet-100 border-violet-200', iconColor: 'text-violet-600' },
    { label: 'Total Lapangan', value: lapangan.length, icon: MapPin, change: '+0%', up: true, color: 'from-emerald-50 to-emerald-100 border-emerald-200', iconColor: 'text-emerald-600' },
    { label: 'Pengguna', value: '1,024', icon: Users, change: '+8%', up: true, color: 'from-blue-50 to-blue-100 border-blue-200', iconColor: 'text-blue-600' },
    { label: 'Pendapatan', value: `Rp ${(booking.reduce((acc, b) => acc + b.totalHarga, 0)).toLocaleString()}`, icon: DollarSign, change: '+23%', up: true, color: 'from-amber-50 to-amber-100 border-amber-200', iconColor: 'text-amber-600' },
  ]

  const recentBookings = [...booking].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview data booking Orion Sports Center</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-5 bg-gradient-to-br ${stat.color} border bg-white shadow-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${stat.iconColor}`}>
                  <Icon size={20} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Terbaru</h3>
          <div className="space-y-3">
            {recentBookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-gray-900 text-sm font-medium">{b.namaPemesan}</div>
                  <div className="text-gray-500 text-xs">{b.tanggal} | {b.jamMulai}-{b.jamSelesai}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[b.status]}`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Lapangan</h3>
          <div className="space-y-3">
            {lapangan.slice(0, 6).map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${l.tersedia ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-gray-900 text-sm">{l.nama}</span>
                </div>
                <span className="text-gray-500 text-xs">{l.jenis}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grafik Pendapatan</h3>
        <div className="flex items-end gap-2 h-40">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 100].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-violet-400 hover:from-amber-500 hover:to-amber-400 transition-colors cursor-pointer"
              />
              <span className="text-[10px] text-gray-400">{['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][i]}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

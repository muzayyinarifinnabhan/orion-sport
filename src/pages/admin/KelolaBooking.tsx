import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { updateOne, deleteOne } from '../../lib/db'
import type { Booking } from '../../types'

export default function KelolaBooking() {
  const { booking: bookings, setBooking: setBookings } = useApp()
  const { showToast } = useToast()

  const updateStatus = async (id: string, status: Booking['status']) => {
    await updateOne('booking', id, { status })
    setBookings(bookings.map((b) => b.id === id ? { ...b, status } : b))
    showToast(`Booking ${status === 'confirmed' ? 'dikonfirmasi' : status === 'cancelled' ? 'dibatalkan' : status === 'completed' ? 'diselesaikan' : ''}!`, 'success')
  }

  const handleDelete = async (id: string) => {
    await deleteOne('booking', id)
    setBookings(bookings.filter((b) => b.id !== id))
    showToast('Booking berhasil dihapus!', 'error')
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
  }

  const columns = [
    { key: 'namaPemesan', header: 'Pemesan', sortable: true },
    { key: 'tanggal', header: 'Tanggal', sortable: true },
    { key: 'jamMulai', header: 'Jam', sortable: true,
      render: (b: Booking) => `${b.jamMulai} - ${b.jamSelesai}` },
    { key: 'lapanganId', header: 'Lapangan', sortable: true },
    { key: 'totalHarga', header: 'Total', sortable: true,
      render: (b: Booking) => `Rp ${b.totalHarga.toLocaleString()}` },
    { key: 'status', header: 'Status', sortable: true,
      render: (b: Booking) => (
        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[b.status]}`}>
          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kelola Booking</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola data booking lapangan</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <DataTable
          columns={columns}
          data={bookings}
          searchKeys={['namaPemesan', 'lapanganId', 'status']}
          actions={(b: Booking) => (
            <div className="flex items-center gap-2">
              {b.status === 'pending' && (
                <button onClick={() => updateStatus(b.id, 'confirmed')} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200" title="Konfirmasi">
                  <CheckCircle size={14} />
                </button>
              )}
              {b.status !== 'cancelled' && b.status !== 'completed' && (
                <button onClick={() => updateStatus(b.id, 'cancelled')} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200" title="Batalkan">
                  <XCircle size={14} />
                </button>
              )}
              {b.status === 'confirmed' && (
                <button onClick={() => updateStatus(b.id, 'completed')} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200" title="Selesaikan">
                  <CheckCircle size={14} />
                </button>
              )}
              <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200" title="Hapus">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        />
      </motion.div>
    </div>
  )
}

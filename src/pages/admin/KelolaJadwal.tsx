import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { insertOne, updateOne, deleteOne } from '../../lib/db'
import { hariList } from '../../data'
import type { Jadwal } from '../../types'

export default function KelolaJadwal() {
  const { jadwal, setJadwal, lapangan } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Jadwal | null>(null)
  const { showToast } = useToast()

  const [form, setForm] = useState({ lapanganId: '', hari: 'Senin' as Jadwal['hari'], jamBuka: '08:00', jamTutup: '22:00' })

  const openAdd = () => {
    setEditing(null)
    setForm({ lapanganId: lapangan[0]?.id || '', hari: 'Senin', jamBuka: '08:00', jamTutup: '22:00' })
    setModalOpen(true)
  }

  const openEdit = (j: Jadwal) => {
    setEditing(j)
    setForm({ lapanganId: j.lapanganId, hari: j.hari, jamBuka: j.jamBuka, jamTutup: j.jamTutup })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.lapanganId) { showToast('Pilih lapangan!', 'error'); return }
    if (editing) {
      await updateOne('jadwal', editing.id, form)
      setJadwal(jadwal.map((j) => j.id === editing.id ? { ...j, ...form } : j))
      showToast('Jadwal berhasil diperbarui!', 'success')
    } else {
      const newJ: Jadwal = { id: `j-${Date.now()}`, ...form }
      await insertOne('jadwal', newJ)
      setJadwal([...jadwal, newJ])
      showToast('Jadwal berhasil ditambahkan!', 'success')
    }
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    await deleteOne('jadwal', id)
    setJadwal(jadwal.filter((j) => j.id !== id))
    showToast('Jadwal berhasil dihapus!', 'error')
  }

  const getNamaLapangan = (id: string) => lapangan.find((l) => l.id === id)?.nama || id

  const columns = [
    { key: 'lapanganId', header: 'Lapangan', sortable: true, render: (j: Jadwal) => getNamaLapangan(j.lapanganId) },
    { key: 'hari', header: 'Hari', sortable: true },
    { key: 'jamBuka', header: 'Jam Buka', sortable: true },
    { key: 'jamTutup', header: 'Jam Tutup', sortable: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Jadwal</h1>
          <p className="text-gray-500 text-sm mt-1">Atur jadwal operasional lapangan</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all shadow-sm">
          <Plus size={16} /> Tambah Jadwal
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <DataTable
          columns={columns}
          data={jadwal}
          searchKeys={['hari']}
          actions={(j: Jadwal) => (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(j)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(j.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Jadwal' : 'Tambah Jadwal'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 mb-2">Lapangan</label>
            <select value={form.lapanganId} onChange={(e) => setForm({ ...form, lapanganId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30">
              {lapangan.map((l) => <option key={l.id} value={l.id}>{l.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Hari</label>
            <select value={form.hari} onChange={(e) => setForm({ ...form, hari: e.target.value as Jadwal['hari'] })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30">
              {hariList.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-200 mb-2">Jam Buka</label>
              <input type="time" value={form.jamBuka} onChange={(e) => setForm({ ...form, jamBuka: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30" />
            </div>
            <div>
              <label className="block text-sm text-gray-200 mb-2">Jam Tutup</label>
              <input type="time" value={form.jamTutup} onChange={(e) => setForm({ ...form, jamTutup: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-gray-200 hover:text-white transition-colors text-sm">Batal</button>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all">
              {editing ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

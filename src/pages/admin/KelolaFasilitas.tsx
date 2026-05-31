import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { insertOne, updateOne, deleteOne } from '../../lib/db'
import type { Fasilitas } from '../../types'

const icons = ['Building2', 'Car', 'Bike', 'DoorOpen', 'CupSoda', 'CakeSlice']

export default function KelolaFasilitas() {
  const { fasilitas, setFasilitas } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Fasilitas | null>(null)
  const { showToast } = useToast()

  const [form, setForm] = useState({ nama: '', icon: 'Building2', deskripsi: '' })

  const openAdd = () => {
    setEditing(null)
    setForm({ nama: '', icon: 'Building2', deskripsi: '' })
    setModalOpen(true)
  }

  const openEdit = (f: Fasilitas) => {
    setEditing(f)
    setForm({ nama: f.nama, icon: f.icon, deskripsi: f.deskripsi })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nama) { showToast('Harap lengkapi data!', 'error'); return }
    if (editing) {
      await updateOne('fasilitas', editing.id, form)
      setFasilitas(fasilitas.map((f) => f.id === editing.id ? { ...f, ...form } : f))
      showToast('Fasilitas berhasil diperbarui!', 'success')
    } else {
      const newF: Fasilitas = { id: `f-${Date.now()}`, ...form }
      await insertOne('fasilitas', newF)
      setFasilitas([...fasilitas, newF])
      showToast('Fasilitas berhasil ditambahkan!', 'success')
    }
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    await deleteOne('fasilitas', id)
    setFasilitas(fasilitas.filter((f) => f.id !== id))
    showToast('Fasilitas berhasil dihapus!', 'error')
  }

  const columns = [
    { key: 'nama', header: 'Nama Fasilitas', sortable: true },
    { key: 'icon', header: 'Icon' },
    { key: 'deskripsi', header: 'Deskripsi' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Fasilitas</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data fasilitas lapangan</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all shadow-sm">
          <Plus size={16} /> Tambah Fasilitas
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <DataTable
          columns={columns}
          data={fasilitas}
          searchKeys={['nama']}
          actions={(f: Fasilitas) => (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Fasilitas' : 'Tambah Fasilitas'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 mb-2">Nama Fasilitas</label>
            <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Icon</label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30">
              {icons.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 resize-none placeholder-gray-400" />
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

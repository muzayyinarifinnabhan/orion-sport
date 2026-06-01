import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Image } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ImageUpload from '../../components/ui/ImageUpload'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { insertOne, updateOne, deleteOne } from '../../lib/db'
import type { Galeri } from '../../types'

export default function KelolaGaleri() {
  const { galeri, setGaleri, refreshAll } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Galeri | null>(null)
  const [form, setForm] = useState({ gambar: '', judul: '', deskripsi: '', kategori: '' })
  const { showToast } = useToast()

  const kategoriOptions = ['Badminton', 'Futsal', 'Basket', 'Event', 'Fasilitas']

  function openAdd() {
    setEditing(null)
    setForm({ gambar: '', judul: '', deskripsi: '', kategori: '' })
    setShowModal(true)
  }

  function openEdit(item: Galeri) {
    setEditing(item)
    setForm({ gambar: item.gambar, judul: item.judul, deskripsi: item.deskripsi, kategori: item.kategori })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.gambar || !form.judul || !form.kategori) {
      showToast('Harap isi semua field wajib!', 'error')
      return
    }
    if (editing) {
      await updateOne('galeri', editing.id, form)
      setGaleri(galeri.map((g) => (g.id === editing.id ? { ...g, ...form } : g)))
      showToast('Galeri berhasil diperbarui!', 'success')
    } else {
      const newItem: Galeri = {
        id: `g${Date.now()}`,
        ...form,
        createdAt: new Date().toISOString(),
      }
      await insertOne('galeri', newItem)
      setGaleri([newItem, ...galeri])
      showToast('Galeri berhasil ditambahkan!', 'success')
    }
    setShowModal(false)
    await refreshAll()
  }

  async function handleDelete(id: string) {
    await deleteOne('galeri', id)
    setGaleri(galeri.filter((g) => g.id !== id))
    showToast('Galeri berhasil dihapus!', 'success')
    await refreshAll()
  }

  const columns = [
    { key: 'gambar', header: 'Gambar', render: (row: Galeri) => (
      <img src={row.gambar} alt={row.judul} className="w-16 h-12 rounded-lg object-cover" />
    )},
    { key: 'judul', header: 'Judul' },
    { key: 'kategori', header: 'Kategori', render: (row: Galeri) => (
      <span className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">{row.kategori}</span>
    )},
    { key: 'createdAt', header: 'Ditambahkan' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Image size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kelola Galeri</h1>
            <p className="text-sm text-gray-500">Atur gambar galeri Orion Sports Center</p>
          </div>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm text-sm">
          <Plus size={18} /> Tambah Gambar
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable data={galeri} columns={columns} actions={(g: Galeri) => (
          <div className="flex items-center gap-2">
            <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"><Edit size={14} /></button>
            <button onClick={() => handleDelete(g.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"><Trash2 size={14} /></button>
          </div>
        )} />
      </motion.div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Gambar' : 'Tambah Gambar'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 mb-1">Unggah Gambar *</label>
            <ImageUpload value={form.gambar} onChange={(v) => setForm({ ...form, gambar: v })} />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Judul *</label>
            <input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400" placeholder="Judul gambar" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 resize-none placeholder-gray-400" placeholder="Deskripsi gambar" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Kategori *</label>
            <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30">
              <option value="">Pilih kategori</option>
              {kategoriOptions.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-gray-200 hover:text-white transition-colors text-sm">Batal</button>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm text-sm">
              {editing ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Newspaper } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ImageUpload from '../../components/ui/ImageUpload'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { insertOne, updateOne, deleteOne } from '../../lib/db'
import type { Artikel } from '../../types'

export default function KelolaArtikel() {
  const { artikel, setArtikel, refreshAll } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Artikel | null>(null)
  const [form, setForm] = useState({ gambar: '', judul: '', konten: '', kategori: '', penulis: '' })
  const { showToast } = useToast()

  const kategoriOptions = ['Tips', 'Event', 'Kesehatan', 'Promo', 'Latihan']

  function openAdd() {
    setEditing(null)
    setForm({ gambar: '', judul: '', konten: '', kategori: '', penulis: '' })
    setShowModal(true)
  }

  function openEdit(item: Artikel) {
    setEditing(item)
    setForm({ gambar: item.gambar, judul: item.judul, konten: item.konten, kategori: item.kategori, penulis: item.penulis })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.gambar || !form.judul || !form.konten || !form.kategori) {
      showToast('Harap isi semua field wajib!', 'error')
      return
    }
    if (editing) {
      await updateOne('artikel', editing.id, { ...form, tanggal: editing.tanggal })
      setArtikel(artikel.map((a) => (a.id === editing.id ? { ...a, ...form, tanggal: editing.tanggal } : a)))
      showToast('Artikel berhasil diperbarui!', 'success')
    } else {
      const newItem: Artikel = {
        id: `a${Date.now()}`,
        ...form,
        penulis: form.penulis || 'Admin Orion',
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        createdAt: new Date().toISOString(),
      }
      await insertOne('artikel', newItem)
      setArtikel([newItem, ...artikel])
      showToast('Artikel berhasil ditambahkan!', 'success')
    }
    setShowModal(false)
    await refreshAll()
  }

  async function handleDelete(id: string) {
    await deleteOne('artikel', id)
    setArtikel(artikel.filter((a) => a.id !== id))
    showToast('Artikel berhasil dihapus!', 'success')
    await refreshAll()
  }

  const columns = [
    { key: 'gambar', header: 'Gambar', render: (row: Artikel) => (
      <img src={row.gambar} alt={row.judul} className="w-16 h-12 rounded-lg object-cover" />
    )},
    { key: 'judul', header: 'Judul' },
    { key: 'kategori', header: 'Kategori', render: (row: Artikel) => (
      <span className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">{row.kategori}</span>
    )},
    { key: 'tanggal', header: 'Tanggal' },
    { key: 'penulis', header: 'Penulis' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Newspaper size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kelola Artikel</h1>
            <p className="text-sm text-gray-500">Atur artikel dan berita Orion Sports Center</p>
          </div>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm text-sm">
          <Plus size={18} /> Tambah Artikel
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable data={artikel} columns={columns} actions={(a: Artikel) => (
          <div className="flex items-center gap-2">
            <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"><Edit size={14} /></button>
            <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"><Trash2 size={14} /></button>
          </div>
        )} />
      </motion.div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Artikel' : 'Tambah Artikel'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 mb-1">Unggah Gambar *</label>
            <ImageUpload value={form.gambar} onChange={(v) => setForm({ ...form, gambar: v })} />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Judul *</label>
            <input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400" placeholder="Judul artikel" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Konten *</label>
            <textarea value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 resize-none placeholder-gray-400" placeholder="Isi artikel" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Kategori *</label>
            <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30">
              <option value="">Pilih kategori</option>
              {kategoriOptions.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Penulis</label>
            <input value={form.penulis} onChange={(e) => setForm({ ...form, penulis: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400" placeholder="Admin Orion" />
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

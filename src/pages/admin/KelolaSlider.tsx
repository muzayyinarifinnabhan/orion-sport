import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ImageUpload from '../../components/ui/ImageUpload'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { insertOne, updateOne, deleteOne } from '../../lib/db'
import type { Slider } from '../../types'

export default function KelolaSlider() {
  const { slider, setSlider } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Slider | null>(null)
  const [form, setForm] = useState({ image: '', judul: '', subjudul: '' })
  const { showToast } = useToast()

  function openAdd() {
    setEditing(null)
    setForm({ image: '', judul: '', subjudul: '' })
    setShowModal(true)
  }

  function openEdit(item: Slider) {
    setEditing(item)
    setForm({ image: item.image, judul: item.judul, subjudul: item.subjudul })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.image || !form.judul) {
      showToast('Harap isi semua field wajib!', 'error')
      return
    }
    const sorted = [...slider].sort((a, b) => a.urutan - b.urutan)
    if (editing) {
      await updateOne('slider', editing.id, form)
      setSlider(slider.map((s) => (s.id === editing.id ? { ...s, ...form } : s)))
      showToast('Slider berhasil diperbarui!', 'success')
    } else {
      const maxUrutan = sorted.length > 0 ? sorted[sorted.length - 1].urutan : 0
      const newItem: Slider = {
        id: `s${Date.now()}`,
        ...form,
        urutan: maxUrutan + 1,
      }
      await insertOne('slider', newItem)
      setSlider([...slider, newItem])
      showToast('Slider berhasil ditambahkan!', 'success')
    }
    setShowModal(false)
  }

  async function handleDelete(id: string) {
    await deleteOne('slider', id)
    setSlider(slider.filter((s) => s.id !== id))
    showToast('Slider berhasil dihapus!', 'success')
  }

  function moveUp(item: Slider) {
    const sorted = [...slider].sort((a, b) => a.urutan - b.urutan)
    const idx = sorted.findIndex((s) => s.id === item.id)
    if (idx <= 0) return
    const above = sorted[idx - 1]
    const updated = slider.map((s) => {
      if (s.id === item.id) return { ...s, urutan: above.urutan }
      if (s.id === above.id) return { ...s, urutan: item.urutan }
      return s
    })
    setSlider(updated)
    Promise.all([
      updateOne('slider', item.id, { urutan: above.urutan }),
      updateOne('slider', above.id, { urutan: item.urutan }),
    ])
  }

  function moveDown(item: Slider) {
    const sorted = [...slider].sort((a, b) => a.urutan - b.urutan)
    const idx = sorted.findIndex((s) => s.id === item.id)
    if (idx < 0 || idx >= sorted.length - 1) return
    const below = sorted[idx + 1]
    const updated = slider.map((s) => {
      if (s.id === item.id) return { ...s, urutan: below.urutan }
      if (s.id === below.id) return { ...s, urutan: item.urutan }
      return s
    })
    setSlider(updated)
    Promise.all([
      updateOne('slider', item.id, { urutan: below.urutan }),
      updateOne('slider', below.id, { urutan: item.urutan }),
    ])
  }

  const sorted = [...slider].sort((a, b) => a.urutan - b.urutan)

  const columns = [
    { key: 'gambar', header: 'Gambar', render: (row: Slider) => (
      <img src={row.image} alt={row.judul} className="w-24 h-14 rounded-lg object-cover" />
    )},
    { key: 'judul', header: 'Judul' },
    { key: 'subjudul', header: 'Subjudul' },
    { key: 'urutan', header: 'Urutan', render: (row: Slider) => (
      <span className="text-sm font-medium text-gray-600">{row.urutan}</span>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kelola Slider</h1>
          <p className="text-sm text-gray-500">Atur gambar slider hero di halaman utama</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm text-sm">
          <Plus size={18} /> Tambah Slide
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {sorted.map((slide, i) => (
            <div key={slide.id} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveUp(slide)} disabled={i === 0} className="p-0.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed">
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => moveDown(slide)} disabled={i === sorted.length - 1} className="p-0.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed">
                  <ChevronDown size={14} />
                </button>
              </div>
              <img src={slide.image} alt={slide.judul} className="w-24 h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{slide.judul}</div>
                <div className="text-xs text-gray-500 truncate">{slide.subjudul}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(slide)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"><Edit size={14} /></button>
                <button onClick={() => handleDelete(slide.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>Belum ada slide. Klik "Tambah Slide" untuk memulai.</p>
            </div>
          )}
        </div>
      </motion.div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Slide' : 'Tambah Slide'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 mb-1">Gambar *</label>
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Judul *</label>
            <input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400"
              placeholder="Judul slide" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-1">Subjudul</label>
            <textarea value={form.subjudul} onChange={(e) => setForm({ ...form, subjudul: e.target.value })} rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 resize-none placeholder-gray-400"
              placeholder="Subjudul slide" />
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

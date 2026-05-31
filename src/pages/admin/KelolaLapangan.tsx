import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, PlusCircle, Upload } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { insertOne, updateOne, deleteOne, mapKeys, camelToSnake } from '../../lib/db'
import type { Lapangan } from '../../types'

export default function KelolaLapangan() {
  const { lapangan, setLapangan, fasilitas, setFasilitas, supabase, refreshAll } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Lapangan | null>(null)
  const [fasilitasIds, setFasilitasIds] = useState<string[]>([])
  const [newFasilitas, setNewFasilitas] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { showToast } = useToast()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran file maksimal 2MB!', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreviewImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const [form, setForm] = useState({
    nama: '', jenis: 'Badminton Karpet Vinyl' as Lapangan['jenis'], hargaPerJam: 0, kapasitas: 0, deskripsi: '', tersedia: true,
  })

  function toggleFasilitas(id: string) {
    setFasilitasIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  async function addNewFasilitas() {
    const trimmed = newFasilitas.trim()
    if (!trimmed) return
    const exists = fasilitas.some((f) => f.nama.toLowerCase() === trimmed.toLowerCase())
    if (exists) {
      showToast('Fasilitas sudah ada!', 'error')
      return
    }
    const newItem = { id: `f${Date.now()}`, nama: trimmed, icon: 'BadgeCheck', deskripsi: '' }
    await insertOne('fasilitas', newItem)
    setFasilitas([...fasilitas, newItem])
    setFasilitasIds((prev) => [...prev, newItem.id])
    setNewFasilitas('')
    showToast('Fasilitas baru ditambahkan!', 'success')
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ nama: '', jenis: 'Badminton Karpet Vinyl', hargaPerJam: 0, kapasitas: 0, deskripsi: '', tersedia: true })
    setFasilitasIds([])
    setPreviewImage(null)
    setModalOpen(true)
  }

  const openEdit = (l: Lapangan) => {
    setEditing(l)
    setForm({ nama: l.nama, jenis: l.jenis, hargaPerJam: l.hargaPerJam, kapasitas: l.kapasitas, deskripsi: l.deskripsi, tersedia: l.tersedia })
    setFasilitasIds([...l.fasilitasIds])
    setPreviewImage(l.gambar[0] || null)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nama || form.hargaPerJam <= 0) {
      showToast('Harap lengkapi data lapangan!', 'error'); return
    }
    const gambar = previewImage
      ? [previewImage]
      : ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80']
    if (editing) {
      const updated = { ...form, fasilitasIds, gambar }
      await updateOne('lapangan', editing.id, updated)
      setLapangan(lapangan.map((l) => l.id === editing.id ? { ...l, ...updated } : l))
      showToast('Lapangan berhasil diperbarui!', 'success')
    } else {
      const newL: Lapangan = { id: `lap-${Date.now()}`, ...form, fasilitasIds, gambar }
      await insertOne('lapangan', newL)
      setLapangan([...lapangan, newL])
      showToast('Lapangan berhasil ditambahkan!', 'success')
    }
    setModalOpen(false)
    await refreshAll()
  }

  const handleDelete = async (id: string) => {
    await deleteOne('lapangan', id)
    setLapangan(lapangan.filter((l) => l.id !== id))
    showToast('Lapangan berhasil dihapus!', 'error')
    await refreshAll()
  }

  const columns = [
    { key: 'nama', header: 'Nama Lapangan', sortable: true },
    { key: 'jenis', header: 'Jenis', sortable: true },
    { key: 'hargaPerJam', header: 'Harga/Jam', sortable: true,
      render: (l: Lapangan) => `Rp ${l.hargaPerJam.toLocaleString()}` },
    { key: 'kapasitas', header: 'Kapasitas', sortable: true,
      render: (l: Lapangan) => `${l.kapasitas} org` },
    { key: 'tersedia', header: 'Status', sortable: true,
      render: (l: Lapangan) => (
        <span className={`text-xs px-2 py-0.5 rounded-full border ${l.tersedia ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {l.tersedia ? 'Tersedia' : 'Tidak'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Lapangan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data lapangan olahraga</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all shadow-sm">
          <Plus size={16} /> Tambah Lapangan
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <DataTable
          columns={columns}
          data={lapangan}
          searchKeys={['nama', 'jenis']}
          actions={(l: Lapangan) => (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Lapangan' : 'Tambah Lapangan'} size="xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 mb-2">Nama Lapangan</label>
            <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400"
              placeholder="Nama lapangan" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Jenis Lapangan</label>
            <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value as Lapangan['jenis'] })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30">
              <option value="Badminton Karpet Vinyl">Badminton Karpet Vinyl</option>
              <option value="Futsal Rumput Sintetis">Futsal Rumput Sintetis</option>
              <option value="Futsal Interlock">Futsal Interlock</option>
              <option value="Basketball Parkit Vinyl">Basketball Parkit Vinyl</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-200 mb-2">Harga/Jam (Rp)</label>
              <input type="number" value={form.hargaPerJam} onChange={(e) => setForm({ ...form, hargaPerJam: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30" />
            </div>
            <div>
              <label className="block text-sm text-gray-200 mb-2">Kapasitas (Orang)</label>
              <input type="number" value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Foto Lapangan</label>
            <label className="flex flex-col items-center justify-center w-full p-4 rounded-xl border-2 border-dashed border-slate-600 bg-slate-700/50 cursor-pointer hover:border-slate-500 transition-colors">
              <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleImageChange} className="hidden" />
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-36 object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Upload size={28} className="text-gray-400" />
                  <p className="text-xs text-gray-400 text-center">Klik atau seret file gambar ke sini (PNG, JPG, maks. 2MB)</p>
                </div>
              )}
            </label>
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 resize-none placeholder-gray-400" />
          </div>

          {/* Fasilitas Lapangan */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-200 mb-3">Fasilitas Lapangan</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {fasilitas.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFasilitas(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    fasilitasIds.includes(f.id)
                      ? 'bg-violet-600 text-white border-violet-500'
                      : 'bg-slate-700 text-gray-300 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {f.nama}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newFasilitas}
                onChange={(e) => setNewFasilitas(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNewFasilitas()}
                placeholder="Tambah fasilitas baru..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-xs focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={addNewFasilitas}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-500 transition-all"
              >
                <PlusCircle size={14} /> Tambah
              </button>
            </div>
          </div>

          <label className="flex items-center gap-3 pt-2">
            <input type="checkbox" checked={form.tersedia} onChange={(e) => setForm({ ...form, tersedia: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500/30" />
            <span className="text-sm text-gray-200">Lapangan tersedia</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-gray-300 hover:text-white transition-colors text-sm">Batal</button>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all">
              {editing ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

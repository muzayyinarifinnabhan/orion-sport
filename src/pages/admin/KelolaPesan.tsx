import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, MailOpen, Trash2, Eye } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { updateOne, deleteOne } from '../../lib/db'
import type { Pesan } from '../../types'

export default function KelolaPesan() {
  const { pesan, setPesan } = useApp()
  const [viewing, setViewing] = useState<Pesan | null>(null)
  const { showToast } = useToast()

  async function handleDelete(id: string) {
    await deleteOne('pesan', id)
    setPesan(pesan.filter((p) => p.id !== id))
    showToast('Pesan berhasil dihapus!', 'success')
  }

  async function toggleBaca(item: Pesan) {
    await updateOne('pesan', item.id, { dibaca: !item.dibaca })
    setPesan(pesan.map((p) => (p.id === item.id ? { ...p, dibaca: !p.dibaca } : p)))
    showToast(item.dibaca ? 'Pesan ditandai belum dibaca' : 'Pesan ditandai sudah dibaca', 'success')
  }

  function formatDate(iso: string) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const columns = [
    { key: 'dibaca', header: 'Status', render: (row: Pesan) => (
      row.dibaca
        ? <MailOpen size={18} className="text-gray-400" />
        : <Mail size={18} className="text-violet-600" />
    )},
    { key: 'nama', header: 'Nama' },
    { key: 'email', header: 'Email' },
    { key: 'pesan', header: 'Pesan', render: (row: Pesan) => (
      <span className="truncate block max-w-[200px] text-gray-500">
        {row.pesan.length > 40 ? row.pesan.slice(0, 40) + '...' : row.pesan}
      </span>
    )},
    { key: 'createdAt', header: 'Tanggal', render: (row: Pesan) => (
      <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <MessageSquare size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kelola Pesan</h1>
            <p className="text-sm text-gray-500">Pesan masuk dari pengunjung website</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {pesan.filter((p) => !p.dibaca).length} pesan belum dibaca
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable data={pesan} columns={columns} actions={(p: Pesan) => (
          <div className="flex items-center gap-2">
            <button onClick={() => setViewing(p)} className="p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors border border-violet-200" title="Lihat detail">
              <Eye size={14} />
            </button>
            <button onClick={() => toggleBaca(p)} className={`p-1.5 rounded-lg transition-colors border ${p.dibaca ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200'}`} title={p.dibaca ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}>
              {p.dibaca ? <Mail size={14} /> : <MailOpen size={14} />}
            </button>
            <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200" title="Hapus">
              <Trash2 size={14} />
            </button>
          </div>
        )} />
      </motion.div>

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Detail Pesan">
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nama</label>
                <div className="text-white font-medium">{viewing.nama}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <div className="text-white font-medium">{viewing.email}</div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tanggal</label>
              <div className="text-white font-medium">{formatDate(viewing.createdAt)}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Pesan</label>
              <div className="text-white bg-slate-700 rounded-xl p-4 min-h-[100px] whitespace-pre-wrap">
                {viewing.pesan}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setViewing(null)} className="px-4 py-2.5 rounded-xl text-gray-200 hover:text-white transition-colors text-sm">Tutup</button>
              <button
                onClick={() => {
                  if (!viewing.dibaca) toggleBaca(viewing)
                  setViewing(null)
                }}
                className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm text-sm"
              >
                Tandai Sudah Dibaca
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

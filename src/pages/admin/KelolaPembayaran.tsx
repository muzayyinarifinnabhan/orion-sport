import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, CreditCard, Landmark, Wallet, Store, QrCode } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { insertOne, updateOne, deleteOne } from '../../lib/db'
import type { PaymentMethod } from '../../types'

const metodeIcon: Record<string, typeof CreditCard> = {
  virtual_account: Landmark,
  ewallet: Wallet,
  retail: Store,
  qris: QrCode,
  cards: CreditCard,
}

const metodeList = [
  { id: 'virtual_account', label: 'Virtual Account' },
  { id: 'ewallet', label: 'E-Wallet' },
  { id: 'retail', label: 'Bayar di Gerai Retail' },
  { id: 'qris', label: 'QRIS' },
  { id: 'cards', label: 'Cards' },
]

const defaultForm: PaymentMethod = {
  id: '', metode: 'virtual_account', label: '', deskripsi: '',
  noRekening: '', atasNama: '', bankName: '', noEwallet: '',
  qrImage: '', kodeGerai: '', cardInfo: '', isActive: true, urutan: 0,
}

export default function KelolaPembayaran() {
  const { paymentMethods, setPaymentMethods } = useApp()
  const { showToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<PaymentMethod | null>(null)
  const [form, setForm] = useState<PaymentMethod>(defaultForm)

  const openAdd = () => {
    setEditing(null)
    setForm({ ...defaultForm, id: `pm${Date.now()}`, urutan: paymentMethods.length + 1 })
    setShowModal(true)
  }

  const openEdit = (pm: PaymentMethod) => {
    setEditing(pm)
    setForm({ ...pm })
    setShowModal(true)
  }

  const syncToLocal = (data: PaymentMethod[]) => {
    try { localStorage.setItem('orion_payment_methods', JSON.stringify(data)) } catch {}
  }

  const handleSave = async () => {
    if (!form.label) {
      showToast('Label harus diisi!', 'error')
      return
    }
    let updated: PaymentMethod[]
    if (editing) {
      updated = paymentMethods.map((p) => p.id === editing.id ? { ...form } : p)
      await updateOne('payment_method', editing.id, form).catch(() => {})
      setPaymentMethods(updated)
      showToast('Metode pembayaran berhasil diupdate!', 'success')
    } else {
      updated = [...paymentMethods, form]
      await insertOne('payment_method', form).catch(() => {})
      setPaymentMethods(updated)
      showToast('Metode pembayaran berhasil ditambahkan!', 'success')
    }
    syncToLocal(updated)
    setShowModal(false)
  }

  const handleDelete = async (id: string) => {
    const updated = paymentMethods.filter((p) => p.id !== id)
    await deleteOne('payment_method', id).catch(() => {})
    setPaymentMethods(updated)
    syncToLocal(updated)
    showToast('Metode pembayaran berhasil dihapus!', 'error')
  }

  const toggleActive = async (pm: PaymentMethod) => {
    const updatedList = paymentMethods.map((p) => p.id === pm.id ? { ...p, isActive: !p.isActive } : p)
    await updateOne('payment_method', pm.id, { is_active: !pm.isActive }).catch(() => {})
    setPaymentMethods(updatedList)
    syncToLocal(updatedList)
    showToast(!pm.isActive ? 'Metode diaktifkan!' : 'Metode dinonaktifkan!', 'success')
  }

  const columns = [
    {
      key: 'metode', header: 'Tipe', sortable: true,
      render: (p: PaymentMethod) => {
        const Icon = metodeIcon[p.metode] || CreditCard
        const label = metodeList.find((m) => m.id === p.metode)?.label || p.metode
        return (
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-violet-600" />
            <span>{label}</span>
          </div>
        )
      },
    },
    { key: 'label', header: 'Label', sortable: true },
    { key: 'atasNama', header: 'Atas Nama', sortable: true,
      render: (p: PaymentMethod) => p.atasNama || '-' },
    { key: 'noRekening', header: 'No. Rekening', sortable: true,
      render: (p: PaymentMethod) => p.noRekening || p.noEwallet || p.kodeGerai || '-' },
    {
      key: 'isActive', header: 'Status', sortable: true,
      render: (p: PaymentMethod) => (
        <span className={`text-xs px-2 py-0.5 rounded-full border ${p.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
          {p.isActive ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    { key: 'urutan', header: 'Urutan', sortable: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pembayaran</h1>
          <p className="text-gray-500 text-sm mt-1">Atur metode pembayaran yang tersedia</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all">
          <Plus size={18} /> Tambah Metode
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <DataTable
          columns={columns}
          data={paymentMethods.sort((a, b) => a.urutan - b.urutan)}
          searchKeys={['label', 'metode', 'atasNama', 'noRekening']}
          actions={(p: PaymentMethod) => (
            <div className="flex items-center gap-2">
              <button onClick={() => toggleActive(p)} className={`p-1.5 rounded-lg transition-colors border ${p.isActive ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200'}`} title={p.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                {p.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200" title="Edit">
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200" title="Hapus">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        />
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tipe</label>
                <select
                  value={form.metode}
                  onChange={(e) => setForm({ ...form, metode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                >
                  {metodeList.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Label</label>
                <input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  placeholder="Contoh: BCA Virtual Account"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Deskripsi</label>
                <input
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  placeholder="Deskripsi singkat"
                />
              </div>

              {form.metode === 'virtual_account' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Nama Bank</label>
                    <input
                      value={form.bankName}
                      onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      placeholder="BCA"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">No. Rekening</label>
                      <input
                        value={form.noRekening}
                        onChange={(e) => setForm({ ...form, noRekening: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        placeholder="88008123456789012"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Atas Nama</label>
                      <input
                        value={form.atasNama}
                        onChange={(e) => setForm({ ...form, atasNama: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        placeholder="Orion Sports Center"
                      />
                    </div>
                  </div>
                </>
              )}

              {form.metode === 'ewallet' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">No. E-Wallet</label>
                    <input
                      value={form.noEwallet}
                      onChange={(e) => setForm({ ...form, noEwallet: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      placeholder="081234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Atas Nama</label>
                    <input
                      value={form.atasNama}
                      onChange={(e) => setForm({ ...form, atasNama: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      placeholder="Orion Sports Center"
                    />
                  </div>
                </>
              )}

              {form.metode === 'retail' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Kode Pembayaran</label>
                  <input
                    value={form.kodeGerai}
                    onChange={(e) => setForm({ ...form, kodeGerai: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    placeholder="ORION-1234-5678"
                  />
                </div>
              )}

              {form.metode === 'qris' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">URL Gambar QR</label>
                  <input
                    value={form.qrImage}
                    onChange={(e) => setForm({ ...form, qrImage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    placeholder="https://example.com/qr-code.png"
                  />
                  {form.qrImage && (
                    <img src={form.qrImage} alt="QR Preview" className="mt-2 w-32 h-32 object-contain rounded-xl border border-gray-200" />
                  )}
                </div>
              )}

              {form.metode === 'cards' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Informasi Kartu</label>
                  <textarea
                    value={form.cardInfo}
                    onChange={(e) => setForm({ ...form, cardInfo: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
                    placeholder="Visa / Mastercard"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Urutan</label>
                  <input
                    type="number"
                    value={form.urutan}
                    onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-600">Aktif</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-gray-500 hover:text-gray-700 transition-colors text-sm">
                Batal
              </button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all text-sm">
                {editing ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

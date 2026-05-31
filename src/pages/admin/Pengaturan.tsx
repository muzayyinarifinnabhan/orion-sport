import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, MapPin } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { camelToSnake } from '../../lib/db'

export default function Pengaturan() {
  const { pengaturan, setPengaturan, supabase } = useApp()
  const [form, setForm] = useState({ ...pengaturan })
  const { showToast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dbData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(form)) {
      dbData[camelToSnake(key)] = value
    }
    await supabase.from('pengaturan').update(dbData as never).eq('id', 'default')
    setPengaturan({ ...form })
    showToast('Pengaturan berhasil disimpan!', 'success')
  }

  const fields = [
    { label: 'Nama Tempat', key: 'nama' as const, type: 'text' },
    { label: 'Alamat', key: 'alamat' as const, type: 'text' },
    { label: 'Telepon', key: 'telepon' as const, type: 'text' },
    { label: 'Email', key: 'email' as const, type: 'email' },
    { label: 'Link Embed Google Maps (Iframe URL)', key: 'googleMaps' as const, type: 'text' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-1">Pengaturan umum website</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="max-w-2xl bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-amber-500 flex items-center justify-center">
            <MapPin size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Informasi Tempat</h2>
            <p className="text-gray-500 text-sm">Kelola informasi profil Orion Jaya</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm text-gray-600 mb-2">{field.label}</label>
              <input type={field.type} value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.key === 'googleMaps' ? 'Masukkan URL dari src iframe Google Maps (https://www.google.com/maps/embed?...)' : ''}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Jam Buka (Weekday)</label>
              <input type="time" value={form.jamBuka} onChange={(e) => setForm({ ...form, jamBuka: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Jam Tutup (Weekday)</label>
              <input type="time" value={form.jamTutup} onChange={(e) => setForm({ ...form, jamTutup: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Jam Buka (Weekend)</label>
              <input type="time" value={form.jamBukaWeekend} onChange={(e) => setForm({ ...form, jamBukaWeekend: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Jam Tutup (Weekend)</label>
              <input type="time" value={form.jamTutupWeekend} onChange={(e) => setForm({ ...form, jamTutupWeekend: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all shadow-sm"
            >
              <Save size={16} /> Simpan Pengaturan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

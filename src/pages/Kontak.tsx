import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import { useToast } from '../components/ui/Toast'
import { useApp } from '../store/AppContext'
import { insertOne } from '../lib/db'
import type { Pesan } from '../types'

export default function Kontak() {
  const { pengaturan, pesan: pesanList, setPesan: setPesanList } = useApp()
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [pesan, setPesan] = useState('')
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama || !email || !pesan) {
      showToast('Harap lengkapi semua data!', 'error')
      return
    }
    const newPesan: Pesan = {
      id: `msg${Date.now()}`,
      nama,
      email,
      pesan,
      createdAt: new Date().toISOString(),
      dibaca: false,
    }
    await insertOne('pesan', newPesan)
    setPesanList([newPesan, ...pesanList])
    showToast('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success')
    setNama('')
    setEmail('')
    setPesan('')
  }

  const infoItems = [
    { icon: MapPin, label: 'Alamat', value: pengaturan.alamat },
    { icon: Phone, label: 'Telepon', value: pengaturan.telepon },
    { icon: Mail, label: 'Email', value: pengaturan.email },
    { icon: Clock, label: 'Jam Operasional', value: `Senin - Jumat: ${pengaturan.jamBuka} - ${pengaturan.jamTutup}\nSabtu - Minggu: ${pengaturan.jamBukaWeekend} - ${pengaturan.jamTutupWeekend}` },
  ]

  return (
    <div className="pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Punya pertanyaan? Jangan ragu untuk menghubungi kami
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <ScrollReveal direction="left">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informasi Kontak</h2>
                <div className="space-y-5">
                  {infoItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                        <item.icon size={20} className="text-violet-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{item.label}</div>
                        <div className="text-gray-800 text-sm font-medium whitespace-pre-line">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Maps */}
            <ScrollReveal direction="left" delay={0.1}>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lokasi Kami</h2>
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                  {pengaturan.googleMaps ? (
                    <iframe src={pengaturan.googleMaps} width="100%" height="100%" style={{ border: 0, minHeight: '200px' }}
                      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center text-gray-400">
                      <div>
                        <MapPin size={40} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Google Maps akan ditampilkan di sini</p>
                        <p className="text-xs text-gray-500 mt-1">{pengaturan.alamat}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form */}
          <ScrollReveal direction="right">
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { label: 'Nama Lengkap', value: nama, set: setNama, type: 'text', placeholder: 'Masukkan nama Anda' },
                  { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'Masukkan email Anda' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm text-gray-600 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder-gray-400"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Pesan</label>
                  <textarea
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder-gray-400 resize-none"
                    placeholder="Tulis pesan Anda..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white font-medium hover:from-violet-500 hover:to-violet-600 transition-all shadow-sm"
                >
                  <Send size={16} /> Kirim Pesan
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}

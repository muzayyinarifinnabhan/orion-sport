import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, MapPin, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import { useToast } from '../components/ui/Toast'
import { useApp } from '../store/AppContext'
import { fetchAll, insertOne } from '../lib/db'
import { jamTersedia as defaultJamTersedia } from '../data'
import type { Jadwal } from '../types'

const dayMap: Record<number, string> = {
  0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu',
}

function generateJamSlots(jamBuka: string, jamTutup: string): string[] {
  let start = Number.parseInt(jamBuka)
  let end = Number.parseInt(jamTutup)
  if (Number.isNaN(start)) start = 8
  if (Number.isNaN(end)) end = 22
  if (jamTutup === '00:00' || jamTutup === '24:00') end = 24
  const len = end - start
  if (len <= 0) return defaultJamTersedia
  return Array.from({ length: len }, (_, i) => `${String(start + i).padStart(2, '0')}:00`)
}

export default function Booking() {
  const { lapangan: lapanganList, booking: bookingList, setBooking, jadwal: jadwalList, setJadwal } = useApp()

  useEffect(() => {
    fetchAll<Jadwal>('jadwal').then((data) => setJadwal(data))
  }, [])
  const [selectedLapangan, setSelectedLapangan] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [jamMulai, setJamMulai] = useState('')
  const [durasi, setDurasi] = useState(1)
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [telepon, setTelepon] = useState('')
  const [catatan, setCatatan] = useState('')
  const [step, setStep] = useState(1)
  const { showToast } = useToast()

  const lapangan = lapanganList.find((l) => l.id === selectedLapangan)

  let hari = ''
  try { hari = tanggal ? dayMap[new Date(tanggal + 'T00:00:00').getDay()] : '' } catch {}
  const jadwalHari = Array.isArray(jadwalList) ? jadwalList.find((j) => j.lapanganId === selectedLapangan && j.hari === hari) : undefined
  const jamTersedia = jadwalHari && jadwalHari.jamBuka
    ? generateJamSlots(jadwalHari.jamBuka, jadwalHari.jamTutup)
    : defaultJamTersedia

  const bookedSlots = Array.isArray(bookingList)
    ? bookingList
        .filter((b) => b.lapanganId === selectedLapangan && b.tanggal === tanggal && b.status !== 'cancelled')
        .flatMap((b) => {
          const startH = Number.parseInt(b.jamMulai)
          const endH = Number.parseInt(b.jamSelesai)
          return Array.from({ length: endH - startH }, (_, i) => `${String(startH + i).padStart(2, '0')}:00`)
        })
    : []

  const tersedia = (jam: string) => !bookedSlots.includes(jam)

  const totalHarga = lapangan ? lapangan.hargaPerJam * durasi : 0

  const handleBooking = async () => {
    if (!selectedLapangan || !tanggal || !jamMulai || !nama || !email || !telepon) {
      showToast('Harap lengkapi semua data!', 'error')
      return
    }
    const jamSelesai = String(Number(jamMulai.split(':')[0]) + durasi).padStart(2, '0') + ':00'
    const newBooking: import('../types').Booking = {
      id: `b${Date.now()}`,
      lapanganId: selectedLapangan,
      namaPemesan: nama,
      email,
      telepon,
      tanggal,
      jamMulai,
      jamSelesai,
      totalHarga,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      catatan,
    }
    await insertOne('booking', newBooking)
    setBooking([...bookingList, newBooking])
    showToast(`Booking berhasil! Total: Rp ${totalHarga.toLocaleString()}`, 'success')
    setSelectedLapangan('')
    setTanggal('')
    setJamMulai('')
    setNama('')
    setEmail('')
    setTelepon('')
    setCatatan('')
    setStep(1)
  }

  return (
    <div className="pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Booking Lapangan</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Pilih lapangan, tanggal, dan jam sesuai keinginanmu
            </p>
          </div>
        </ScrollReveal>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {['Pilih Lapangan', 'Pilih Jadwal', 'Lengkapi Data', 'Konfirmasi'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step > i + 1 ? 'bg-emerald-500 text-white' :
                step === i + 1 ? 'bg-violet-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < 3 && <div className="w-6 sm:w-12 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-violet-600" /> Pilih Lapangan
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {lapanganList.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => { setSelectedLapangan(l.id); setJamMulai('') }}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedLapangan === l.id
                          ? 'border-violet-300 bg-violet-50'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-violet-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-gray-900 font-medium">{l.nama}</div>
                          <div className="text-gray-500 text-sm">{l.jenis}</div>
                          <div className="text-amber-600 text-sm font-medium mt-1">
                            Rp {l.hargaPerJam.toLocaleString()}/jam
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    disabled={!selectedLapangan}
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CalendarDays size={20} className="text-violet-600" /> Pilih Jadwal
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Tanggal</label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => { setTanggal(e.target.value); setJamMulai('') }}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Jam Mulai</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {jamTersedia.map((jam) => {
                        const available = selectedLapangan && tanggal ? tersedia(jam) : false
                        return (
                          <button
                            key={jam}
                            disabled={!available}
                            onClick={() => { setJamMulai(jam); }}
                            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                              jamMulai === jam
                                ? 'bg-violet-600 text-white'
                                : available
                                  ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                  : 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                            }`}
                          >
                            {jam}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {jamMulai && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Durasi (Jam)</label>
                      <div className="flex items-center gap-3">
                        {[1, 2, 3, 4].map((d) => (
                          <button
                            key={d}
                            onClick={() => setDurasi(d)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              durasi === d
                                ? 'bg-violet-600 text-white'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {d} Jam
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl text-gray-500 hover:text-gray-700 transition-colors">
                    Kembali
                  </button>
                  <button
                    disabled={!tanggal || !jamMulai}
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-violet-600" /> Data Pemesan
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Nama Lengkap', value: nama, set: setNama, type: 'text' },
                    { label: 'Email', value: email, set: setEmail, type: 'email' },
                    { label: 'Nomor Telepon', value: telepon, set: setTelepon, type: 'tel' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm text-gray-600 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder-gray-400"
                        placeholder={`Masukkan ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Catatan (Opsional)</label>
                    <textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder-gray-400 resize-none"
                      placeholder="Tambahkan catatan..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl text-gray-500 hover:text-gray-700 transition-colors">
                    Kembali
                  </button>
                  <button
                    disabled={!nama || !email || !telepon}
                    onClick={() => setStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle size={20} className="text-emerald-500" /> Konfirmasi Booking
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Lapangan</span>
                    <span className="text-gray-900 font-medium">{lapangan?.nama || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="text-gray-900 font-medium">{tanggal || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Jam</span>
                    <span className="text-gray-900 font-medium">{jamMulai} - {String(Number(jamMulai.split(':')[0]) + durasi).padStart(2, '0')}:00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Durasi</span>
                    <span className="text-gray-900 font-medium">{durasi} Jam</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Nama</span>
                    <span className="text-gray-900 font-medium">{nama}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-900 font-medium">{email}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Total Harga</span>
                    <span className="text-amber-600 font-bold text-lg">Rp {totalHarga.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(3)} className="px-6 py-2.5 rounded-xl text-gray-500 hover:text-gray-700 transition-colors">
                    Kembali
                  </button>
                  <button
                    onClick={handleBooking}
                    className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-400 hover:to-amber-500 transition-all shadow-sm"
                  >
                    Konfirmasi Booking <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Ringkasan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Booking</h3>
              {lapangan ? (
                <div className="space-y-3 text-sm">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
                    <img src={lapangan.gambar[0]} alt={lapangan.nama} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-violet-600 mt-0.5" />
                    <div>
                      <div className="text-gray-900 font-medium">{lapangan.nama}</div>
                      <div className="text-gray-500 text-xs">{lapangan.jenis}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600 shrink-0">Rp</span>
                    <span className="text-gray-700">Rp {lapangan.hargaPerJam.toLocaleString()} / jam</span>
                  </div>
                  {tanggal && (
                    <div className="flex items-center gap-3">
                      <CalendarDays size={16} className="text-violet-600" />
                      <span className="text-gray-700">{tanggal}</span>
                    </div>
                  )}
                  {jamMulai && (
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-violet-600" />
                      <span className="text-gray-700">{jamMulai} - {String(Number(jamMulai.split(':')[0]) + durasi).padStart(2, '0')}:00</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900">Rp {(lapangan.hargaPerJam * durasi).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-2">
                      <span className="text-gray-600">Total</span>
                      <span className="text-amber-600">Rp {(lapangan.hargaPerJam * durasi).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <MapPin size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Pilih lapangan untuk melihat ringkasan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

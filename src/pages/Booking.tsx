import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, MapPin, CheckCircle, ArrowRight, AlertCircle, CreditCard, Landmark, Wallet, Store, QrCode } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import { useToast } from '../components/ui/Toast'
import { useApp } from '../store/AppContext'
import { fetchAll, insertOne } from '../lib/db'
import { jamTersedia as defaultJamTersedia } from '../data'
import type { Jadwal, PaymentMethod } from '../types'

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
  const { lapangan: lapanganList, booking: bookingList, setBooking, jadwal: jadwalList, setJadwal, paymentMethods } = useApp()

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
  const [metodePembayaran, setMetodePembayaran] = useState('')
  const [paymentPhase, setPaymentPhase] = useState<'select' | 'pay'>('select')
  const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null)
  const [buktiPreview, setBuktiPreview] = useState('')
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

  const handleStartPayment = () => {
    if (!metodePembayaran) return
    setPaymentPhase('pay')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBuktiPembayaran(file)
      setBuktiPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmitPayment = async () => {
    if (!selectedLapangan || !tanggal || !jamMulai || !nama || !email || !telepon || !metodePembayaran) {
      showToast('Harap lengkapi semua data!', 'error')
      return
    }
    if (!buktiPembayaran) {
      showToast('Harap upload bukti pembayaran!', 'error')
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
      metodePembayaran,
    }
    await insertOne('booking', newBooking)
    setBooking([...bookingList, newBooking])
    showToast(`Booking berhasil! Total: Rp ${totalHarga.toLocaleString()}`, 'success')
    setStep(5)
  }

  const resetForm = () => {
    setSelectedLapangan('')
    setTanggal('')
    setJamMulai('')
    setNama('')
    setEmail('')
    setTelepon('')
    setCatatan('')
    setMetodePembayaran('')
    setPaymentPhase('select')
    setBuktiPembayaran(null)
    setBuktiPreview('')
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
          {['Pilih Lapangan', 'Pilih Jadwal', 'Lengkapi Data', 'Pembayaran', 'Konfirmasi'].map((label, i) => (
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
              {i < 4 && <div className="w-6 sm:w-12 h-px bg-gray-200" />}
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
                {paymentPhase === 'select' ? (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <CreditCard size={20} className="text-violet-600" /> Pembayaran
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="text-sm text-gray-600 mb-1">Total Pembayaran</div>
                        <div className="text-2xl font-bold text-amber-600">Rp {totalHarga.toLocaleString()}</div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-3">Metode Pembayaran</label>
                        <div className="space-y-2">
                          {(() => {
                         const metodeConfig = [
                          { id: 'virtual_account', label: 'Transfer Virtual Account', icon: Landmark, defaultDesc: 'BCA / Mandiri / BNI' },
                          { id: 'ewallet', label: 'E-Wallet', icon: Wallet, defaultDesc: 'GoPay / OVO / Dana / ShopeePay' },
                          { id: 'retail', label: 'Bayar di Gerai Retail', icon: Store, defaultDesc: 'Indomaret / Alfamart / Pos Indonesia' },
                          { id: 'qris', label: 'QRIS', icon: QrCode, defaultDesc: 'Scan QR menggunakan aplikasi pembayaran' },
                          { id: 'cards', label: 'Cards', icon: CreditCard, defaultDesc: 'Kartu Kredit / Debit (Visa / Mastercard)' },
                        ]
                        const activeMethods = paymentMethods.filter((p) => p.isActive)
                        return metodeConfig.map((mc) => {
                          const items = activeMethods.filter((p) => p.metode === mc.id)
                          const Icon = mc.icon
                          return (
                            <button
                              key={mc.id}
                              onClick={() => setMetodePembayaran(mc.id)}
                              className={`w-full text-left p-4 rounded-xl border transition-all ${
                                metodePembayaran === mc.id
                                  ? 'border-violet-300 bg-violet-50'
                                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  metodePembayaran === mc.id ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  <Icon size={20} />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{mc.label}</div>
                                  <div className="text-sm text-gray-500">{items.length > 0 ? items.map((i) => i.label).join(' / ') : mc.defaultDesc}</div>
                                </div>
                              </div>
                            </button>
                          )
                        })
                      })()}
                        </div>
                      </div>
                    </div>
                    {metodePembayaran && (
                      <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 mt-4">
                        <div className="text-sm text-violet-600 mb-1">Siap melakukan pembayaran?</div>
                        <div className="text-lg font-bold text-violet-800">Rp {totalHarga.toLocaleString()}</div>
                      </div>
                    )}
                    <div className="mt-6 flex justify-between">
                      <button onClick={() => setStep(3)} className="px-6 py-2.5 rounded-xl text-gray-500 hover:text-gray-700 transition-colors">
                        Kembali
                      </button>
                      {metodePembayaran ? (
                        <button
                          onClick={handleStartPayment}
                          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-200 text-base"
                        >
                          Bayar Sekarang <ArrowRight size={20} />
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Pilih metode pembayaran terlebih dahulu</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <CreditCard size={20} className="text-violet-600" /> Pembayaran
                    </h2>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4">
                      <div className="text-sm text-gray-600 mb-1">Total Pembayaran</div>
                      <div className="text-2xl font-bold text-amber-600">Rp {totalHarga.toLocaleString()}</div>
                    </div>

                    {/* Payment Instructions by Method */}
                    {(() => {
                      const items = paymentMethods.filter((p) => p.isActive && p.metode === metodePembayaran)

                      if (metodePembayaran === 'qris') {
                        const qr = items[0]
                        return (
                          <div className="text-center mb-4">
                            <div className="inline-block bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-3">
                              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                                {qr?.qrImage ? (
                                  <img src={qr.qrImage} alt="QRIS" className="w-full h-full object-contain" />
                                ) : (
                                  <svg viewBox="0 0 200 200" className="w-48 h-48">
                                    <rect width="200" height="200" fill="white" rx="8" />
                                    <rect x="4" y="4" width="40" height="40" fill="white" rx="4" stroke="black" strokeWidth="3" />
                                    <rect x="6" y="6" width="36" height="36" fill="black" rx="2" />
                                    <rect x="10" y="10" width="28" height="28" fill="white" rx="1" />
                                    <rect x="14" y="14" width="20" height="20" fill="black" />
                                    <rect x="156" y="4" width="40" height="40" fill="white" rx="4" stroke="black" strokeWidth="3" />
                                    <rect x="158" y="6" width="36" height="36" fill="black" rx="2" />
                                    <rect x="162" y="10" width="28" height="28" fill="white" rx="1" />
                                    <rect x="166" y="14" width="20" height="20" fill="black" />
                                    <rect x="4" y="156" width="40" height="40" fill="white" rx="4" stroke="black" strokeWidth="3" />
                                    <rect x="6" y="158" width="36" height="36" fill="black" rx="2" />
                                    <rect x="10" y="162" width="28" height="28" fill="white" rx="1" />
                                    <rect x="14" y="166" width="20" height="20" fill="black" />
                                    <rect x="50" y="48" width="100" height="4" fill="black" rx="2" />
                                    <rect x="48" y="50" width="4" height="100" fill="black" rx="2" />
                                    {Array.from({ length: 12 }, (_, r) =>
                                      Array.from({ length: 12 }, (_, c) => {
                                        const fill = ((r * 13 + c * 7 + (r + c) * 3) % 4 !== 0).toString() === 'true' ? 'black' : 'white'
                                        return <rect key={`${r}-${c}`} x={60 + c * 7} y={60 + r * 7} width={3} height={3} fill={fill} rx={0.5} />
                                      })
                                    )}
                                    <rect x="52" y="148" width="96" height="3" fill="black" rx={1} />
                                    <rect x="82" y="82" width="36" height="36" fill="white" rx="6" stroke="black" strokeWidth="2" />
                                    <text x="100" y="103" textAnchor="middle" fill="black" fontSize="10" fontWeight="bold">QR</text>
                                  </svg>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{qr?.deskripsi || 'Scan QR code di atas menggunakan aplikasi pembayaran'}</p>
                          </div>
                        )
                      }

                      if (metodePembayaran === 'virtual_account') {
                        return (
                          <div className="space-y-3 mb-4">
                            {items.length > 0 ? items.map((item) => (
                              <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-500">{item.bankName || item.label}</span>
                                  {item.atasNama && <span className="text-xs text-gray-400">a.n. {item.atasNama}</span>}
                                </div>
                                <div className="text-lg font-bold text-gray-900 tracking-wider">{item.noRekening}</div>
                              </div>
                            )) : (
                              <>
                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                  <div className="text-sm text-gray-500 mb-1">BCA Virtual Account</div>
                                  <div className="text-lg font-bold text-gray-900 tracking-wider">88008 1234 5678 9012</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                  <div className="text-sm text-gray-500 mb-1">Mandiri Virtual Account</div>
                                  <div className="text-lg font-bold text-gray-900 tracking-wider">19000 1234 5678 9012</div>
                                </div>
                              </>
                            )}
                            <p className="text-xs text-gray-400 text-center">Transfer sesuai nominal total pembayaran</p>
                          </div>
                        )
                      }

                      if (metodePembayaran === 'ewallet') {
                        return (
                          <div className="space-y-3 mb-4">
                            {items.length > 0 ? items.map((item) => (
                              <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">{item.label}</div>
                                  {item.atasNama && <div className="text-xs text-gray-400">a.n. {item.atasNama}</div>}
                                </div>
                                <div className="text-lg font-bold text-gray-900 tracking-wider">{item.noEwallet}</div>
                              </div>
                            )) : (
                              <>
                                <div className="flex justify-center gap-3 flex-wrap">
                                  {['GoPay', 'OVO', 'Dana', 'ShopeePay'].map((ew) => (
                                    <div key={ew} className="bg-white rounded-xl px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700">{ew}</div>
                                  ))}
                                </div>
                                <p className="text-sm text-gray-500 text-center">Buka aplikasi dan lakukan pembayaran ke nomor terdaftar Orion Sports Center</p>
                              </>
                            )}
                          </div>
                        )
                      }

                      if (metodePembayaran === 'retail') {
                        return (
                          <div className="space-y-3 mb-4">
                            {items.length > 0 ? items.map((item) => (
                              <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                                <div className="font-medium text-gray-900">{item.label}</div>
                                <div className="text-lg font-bold text-gray-900 tracking-wider">{item.kodeGerai}</div>
                              </div>
                            )) : (
                              <>
                                <div className="flex justify-center gap-3 flex-wrap">
                                  {['Indomaret', 'Alfamart', 'Pos Indonesia'].map((r) => (
                                    <div key={r} className="bg-white rounded-xl px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700">{r}</div>
                                  ))}
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-gray-200 inline-block">
                                  <div className="text-sm text-gray-500 mb-1">Kode Pembayaran</div>
                                  <div className="text-lg font-bold text-gray-900 tracking-wider">ORION {Date.now().toString().slice(-8)}</div>
                                </div>
                                <p className="text-sm text-gray-500 text-center">Tunjukkan kode pembayaran ke kasir</p>
                              </>
                            )}
                          </div>
                        )
                      }

                      if (metodePembayaran === 'cards') {
                        const card = items[0]
                        return (
                          <div className="text-center mb-4">
                            <div className="bg-white rounded-xl p-4 border border-gray-200 inline-block">
                              <CreditCard size={32} className="text-violet-600 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">{card?.cardInfo || 'Pembayaran melalui kartu kredit/debit akan diproses setelah booking dikonfirmasi'}</p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })()}

                    {/* Upload Bukti Pembayaran */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Upload Bukti Pembayaran
                      </label>
                      {buktiPreview ? (
                        <div className="space-y-3">
                          <div className="relative inline-block rounded-xl overflow-hidden border border-gray-200">
                            <img src={buktiPreview} alt="Bukti Pembayaran" className="max-h-48 object-contain" />
                            <button
                              onClick={() => { setBuktiPembayaran(null); setBuktiPreview('') }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-xs text-gray-400">File: {buktiPembayaran?.name}</p>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all">
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                          <div className="text-gray-400 text-center">
                            <svg className="mx-auto h-10 w-10 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-sm">Klik untuk upload screenshot bukti transfer</p>
                            <p className="text-xs mt-1">Format: JPG, PNG (max 5MB)</p>
                          </div>
                        </label>
                      )}
                    </div>

                    <div className="mt-6 flex justify-between">
                      <button onClick={() => setPaymentPhase('select')} className="px-6 py-2.5 rounded-xl text-gray-500 hover:text-gray-700 transition-colors">
                        Kembali
                      </button>
                      <button
                        disabled={!buktiPembayaran}
                        onClick={handleSubmitPayment}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 text-base"
                      >
                        Kirim <ArrowRight size={20} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Booking Berhasil!</h2>
                  <p className="text-gray-500 mt-1">Pembayaran telah dikonfirmasi</p>
                </div>
                <div className="space-y-3 text-sm bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Lapangan</span>
                    <span className="text-gray-900 font-medium">{lapangan?.nama || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="text-gray-900 font-medium">{tanggal || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Jam</span>
                    <span className="text-gray-900 font-medium">{jamMulai} - {String(Number(jamMulai.split(':')[0]) + durasi).padStart(2, '0')}:00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Durasi</span>
                    <span className="text-gray-900 font-medium">{durasi} Jam</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Pemesan</span>
                    <span className="text-gray-900 font-medium">{nama}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Pembayaran</span>
                    <span className="text-gray-900 font-medium">{metodePembayaran === 'virtual_account' ? 'Transfer Virtual Account' : metodePembayaran === 'ewallet' ? 'E-Wallet' : metodePembayaran === 'retail' ? 'Bayar di Gerai Retail' : metodePembayaran === 'qris' ? 'QRIS' : metodePembayaran === 'cards' ? 'Cards' : '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 border-t border-gray-200">
                    <span className="text-gray-600 font-semibold">Total Dibayar</span>
                    <span className="text-amber-600 font-bold text-lg">Rp {totalHarga.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <button
                    onClick={resetForm}
                    className="px-8 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-all"
                  >
                    Booking Lagi
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
                  {metodePembayaran && (
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-violet-600" />
                      <span className="text-gray-700">{metodePembayaran === 'virtual_account' ? 'Transfer Virtual Account' : metodePembayaran === 'ewallet' ? 'E-Wallet' : metodePembayaran === 'retail' ? 'Bayar di Gerai Retail' : metodePembayaran === 'qris' ? 'QRIS' : metodePembayaran === 'cards' ? 'Cards' : metodePembayaran}</span>
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

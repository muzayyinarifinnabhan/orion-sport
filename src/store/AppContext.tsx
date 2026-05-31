import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Lapangan, Booking, User, Jadwal, Fasilitas, Galeri, Artikel, Pesan, Pengaturan, Slider } from '../types'
import { fetchAll } from '../lib/db'
import { supabase } from '../lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

interface AppContextType {
  lapangan: Lapangan[]
  setLapangan: (d: Lapangan[]) => void
  booking: Booking[]
  setBooking: (d: Booking[]) => void
  users: User[]
  setUsers: (d: User[]) => void
  jadwal: Jadwal[]
  setJadwal: (d: Jadwal[]) => void
  fasilitas: Fasilitas[]
  setFasilitas: (d: Fasilitas[]) => void
  galeri: Galeri[]
  setGaleri: (d: Galeri[]) => void
  artikel: Artikel[]
  setArtikel: (d: Artikel[]) => void
  pengaturan: Pengaturan
  setPengaturan: (d: Pengaturan) => void
  pesan: Pesan[]
  setPesan: (d: Pesan[]) => void
  slider: Slider[]
  setSlider: (d: Slider[]) => void
  loading: boolean
  supabase: SupabaseClient
  refreshAll: () => Promise<void>
  adminUser: User | null
  setAdminUser: (u: User | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lapangan, setLapangan] = useState<Lapangan[]>([])
  const [booking, setBooking] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [jadwal, setJadwal] = useState<Jadwal[]>([])
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([])
  const [galeri, setGaleri] = useState<Galeri[]>([])
  const [artikel, setArtikel] = useState<Artikel[]>([])
  const [pengaturan, setPengaturan] = useState<Pengaturan>({
    nama: '', alamat: '', telepon: '', email: '',
    jamBuka: '', jamTutup: '', jamBukaWeekend: '', jamTutupWeekend: '', googleMaps: '',
  })
  const [pesan, setPesan] = useState<Pesan[]>([])
  const [slider, setSlider] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<User | null>(() => {
    try {
      const raw = sessionStorage.getItem('orion_admin')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  async function refreshAll() {
    setLoading(true)
    try {
      const [lapanganData, bookingData, usersData, jadwalData, fasilitasData, galeriData, artikelData, pesanData, sliderData] =
        await Promise.all([
          fetchAll<Lapangan>('lapangan'),
          fetchAll<Booking>('booking'),
          fetchAll<User>('users'),
          fetchAll<Jadwal>('jadwal'),
          fetchAll<Fasilitas>('fasilitas'),
          fetchAll<Galeri>('galeri'),
          fetchAll<Artikel>('artikel'),
          fetchAll<Pesan>('pesan'),
          fetchAll<Slider>('slider'),
        ])
      setLapangan(lapanganData)
      setBooking(bookingData)
      setUsers(usersData)
      setJadwal(jadwalData)
      setFasilitas(fasilitasData)
      setGaleri(galeriData)
      setArtikel(artikelData)
      setPesan(pesanData)
      setSlider(sliderData)

      const { data: penData } = await supabase.from('pengaturan').select('*').eq('id', 'default').single()
      if (penData) {
        setPengaturan({
          nama: penData.nama,
          alamat: penData.alamat,
          telepon: penData.telepon,
          email: penData.email,
          jamBuka: penData.jam_buka,
          jamTutup: penData.jam_tutup,
          jamBukaWeekend: penData.jam_buka_weekend,
          jamTutupWeekend: penData.jam_tutup_weekend,
          googleMaps: penData.google_maps,
        })
      }
    } catch (e) {
      console.error('Failed to fetch data from Supabase:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshAll()
  }, [])

  return (
    <AppContext.Provider value={{
      lapangan, setLapangan, booking, setBooking, users, setUsers,
      jadwal, setJadwal, fasilitas, setFasilitas, galeri, setGaleri, artikel, setArtikel,
      pengaturan, setPengaturan, pesan, setPesan, slider, setSlider, loading, supabase, refreshAll,
      adminUser, setAdminUser: (u: User | null) => {
        setAdminUser(u)
        if (u) sessionStorage.setItem('orion_admin', JSON.stringify(u))
        else sessionStorage.removeItem('orion_admin')
      },
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

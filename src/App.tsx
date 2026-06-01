import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider } from './store/AppContext'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Lapangan from './pages/Lapangan'
import Galeri from './pages/Galeri'
import Artikel from './pages/Artikel'
import ArtikelDetail from './pages/ArtikelDetail'
import Tentang from './pages/Tentang'
import Kontak from './pages/Kontak'
import LoginAdmin from './pages/LoginAdmin'
import Dashboard from './pages/admin/Dashboard'
import KelolaLapangan from './pages/admin/KelolaLapangan'
import KelolaBooking from './pages/admin/KelolaBooking'
import KelolaJadwal from './pages/admin/KelolaJadwal'
import KelolaUser from './pages/admin/KelolaUser'
import KelolaFasilitas from './pages/admin/KelolaFasilitas'
import KelolaGaleri from './pages/admin/KelolaGaleri'
import KelolaPembayaran from './pages/admin/KelolaPembayaran'
import KelolaArtikel from './pages/admin/KelolaArtikel'
import Laporan from './pages/admin/Laporan'
import Pengaturan from './pages/admin/Pengaturan'
import KelolaPesan from './pages/admin/KelolaPesan'
import KelolaSlider from './pages/admin/KelolaSlider'

function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<Booking />} />
            <Route path="lapangan" element={<Lapangan />} />
            <Route path="galeri" element={<Galeri />} />
            <Route path="artikel" element={<Artikel />} />
            <Route path="artikel/:id" element={<ArtikelDetail />} />
            <Route path="tentang" element={<Tentang />} />
            <Route path="kontak" element={<Kontak />} />
            <Route path="login-admin" element={<LoginAdmin />} />
          </Route>
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="lapangan" element={<KelolaLapangan />} />
            <Route path="booking" element={<KelolaBooking />} />
            <Route path="jadwal" element={<KelolaJadwal />} />
            <Route path="user" element={<KelolaUser />} />
            <Route path="fasilitas" element={<KelolaFasilitas />} />
            <Route path="galeri" element={<KelolaGaleri />} />
            <Route path="pembayaran" element={<KelolaPembayaran />} />
            <Route path="artikel" element={<KelolaArtikel />} />
            <Route path="pesan" element={<KelolaPesan />} />
            <Route path="slider" element={<KelolaSlider />} />
            <Route path="laporan" element={<Laporan />} />
            <Route path="pengaturan" element={<Pengaturan />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </AppProvider>
  )
}

export default App

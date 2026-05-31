import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react'
import { useApp } from '../../store/AppContext'

export default function Footer() {
  const { pengaturan } = useApp()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Orion Jaya" className="h-9 w-auto" />
              <span className="text-xl font-bold text-gray-900">
                Orion <span className="text-black">Jaya</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Tempat olahraga terlengkap dengan fasilitas premium. Booking lapangan badminton, futsal, dan basket dengan mudah.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-violet-100 hover:text-violet-600 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Menu</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/booking', label: 'Booking' },
                { to: '/lapangan', label: 'Lapangan' },
                { to: '/galeri', label: 'Galeri' },
                { to: '/artikel', label: 'Artikel' },
                { to: '/tentang', label: 'Tentang' },
                { to: '/kontak', label: 'Kontak' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-500 hover:text-violet-600 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Jam Operasional</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <Clock size={14} className="text-amber-500 shrink-0" />
                <span>Senin - Jumat: {pengaturan.jamBuka} - {pengaturan.jamTutup}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <Clock size={14} className="text-amber-500 shrink-0" />
                <span>Sabtu - Minggu: {pengaturan.jamBukaWeekend} - {pengaturan.jamTutupWeekend}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-500 text-sm">
                <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <span>{pengaturan.alamat}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <Phone size={14} className="text-amber-500 shrink-0" />
                <span>{pengaturan.telepon}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <Mail size={14} className="text-amber-500 shrink-0" />
                <span>{pengaturan.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-6">
        <p className="text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {pengaturan.nama}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

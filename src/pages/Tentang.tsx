import { MapPin, Target, Eye, Shield, Users, Star, Trophy } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import { useApp } from '../store/AppContext'

const keunggulan = [
  {
    icon: Shield,
    title: 'Standar Internasional',
    desc: 'Lapangan berkualitas dengan standar kompetisi nasional dan internasional',
  },
  {
    icon: Users,
    title: 'Ramah & Nyaman',
    desc: 'Staf profesional dan lingkungan yang nyaman untuk semua kalangan',
  },
  {
    icon: Star,
    title: 'Fasilitas Lengkap',
    desc: 'Musholla, parkir luas, ruang ganti, dan kantin tersedia',
  },
  {
    icon: Trophy,
    title: 'Terpercaya',
    desc: 'Lebih dari 5 tahun melayani pecinta olahraga di Indonesia',
  },
]

export default function Tentang() {
  const { lapangan, fasilitas } = useApp()
  return (
    <div className="pt-20 lg:pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-amber-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-violet-700 text-sm mb-6 border border-violet-200 shadow-sm">
              <MapPin size={14} /> Tentang Orion Sports Center
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Tempat Olahraga Terbaik untukmu
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Orion Sports Center adalah pusat olahraga terkemuka yang menyediakan fasilitas lengkap untuk badminton, futsal, dan basket. 
              Kami berkomitmen memberikan pengalaman olahraga terbaik bagi setiap pengunjung.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                  <Eye size={28} className="text-violet-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi pusat olahraga terdepan di Indonesia yang menginspirasi gaya hidup sehat 
                  dan aktif melalui fasilitas berkualitas tinggi dan pelayanan profesional.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <Target size={28} className="text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi</h3>
                <ul className="space-y-3 text-gray-600">
                  {[
                    'Menyediakan lapangan olahraga dengan standar kualitas internasional',
                    'Memberikan pelayanan terbaik untuk kenyamanan setiap pengunjung',
                    'Mengembangkan fasilitas olahraga yang inovatif dan modern',
                    'Membangun komunitas olahraga yang solid dan aktif',
                  ].map((m, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Target size={16} className="text-amber-500 mt-1 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Keunggulan Kami</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Mengapa memilih Orion Sports Center untuk kegiatan olahragamu
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keunggulan.map((k, i) => (
              <ScrollReveal key={k.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-amber-100 flex items-center justify-center mx-auto mb-4">
                    <k.icon size={28} className="text-violet-600" />
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">{k.title}</h3>
                  <p className="text-gray-500 text-sm">{k.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Lapangan', value: lapangan.length },
                { label: 'Fasilitas', value: fasilitas.length },
                { label: 'Pelanggan', value: '1000+' },
                { label: 'Tahun', value: '5+' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-amber-500">
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MapPin, Calendar, Clock, Users, Building2, Image, Newspaper, MessageSquare, BarChart3, Settings, Sliders,
  ChevronLeft, ChevronRight, LogOut, Menu,
} from 'lucide-react'
import { useApp } from '../../store/AppContext'

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/lapangan', label: 'Kelola Lapangan', icon: MapPin },
  { to: '/admin/booking', label: 'Kelola Booking', icon: Calendar },
  { to: '/admin/jadwal', label: 'Kelola Jadwal', icon: Clock },
  { to: '/admin/user', label: 'Kelola User', icon: Users },
  { to: '/admin/fasilitas', label: 'Kelola Fasilitas', icon: Building2 },
  { to: '/admin/galeri', label: 'Kelola Galeri', icon: Image },
  { to: '/admin/slider', label: 'Kelola Slider', icon: Sliders },
  { to: '/admin/artikel', label: 'Kelola Artikel', icon: Newspaper },
  { to: '/admin/pesan', label: 'Kelola Pesan', icon: MessageSquare },
  { to: '/admin/laporan', label: 'Laporan', icon: BarChart3 },
  { to: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  mobileClose: () => void
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, mobileClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { setAdminUser } = useApp()
  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
        <div className={`flex items-center gap-3 px-4 h-16 lg:h-20 border-b border-gray-200 ${collapsed ? 'justify-center' : ''}`}>
          <img src="/orion-logo.jpg" alt="Orion Admin" className={`${collapsed ? 'w-8 h-8' : 'h-8 w-auto'} rounded-lg shrink-0`} />
          {!collapsed && (
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
              Orion <span className="text-amber-500">Admin</span>
            </span>
          )}
        </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={mobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                collapsed ? 'justify-center' : ''
              } ${
                active
                  ? 'bg-violet-100 text-violet-700 border border-violet-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={`p-2 border-t border-gray-200 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => { setAdminUser(null); navigate('/login-admin'); mobileClose() }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center p-3 border-t border-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300"
        style={{ width: collapsed ? '72px' : '260px' }}
      >
        {sidebarContent}
      </aside>

      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-lg"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={mobileClose}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-gray-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import { ToastProvider } from '../ui/Toast'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setPageLoading(true)
    const timer = setTimeout(() => setPageLoading(false), 300)
    return () => clearTimeout(timer)
  }, [location.pathname])

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Sidebar
          collapsed={collapsed}
          onToggle={handleToggle}
          mobileOpen={mobileOpen}
          mobileClose={() => setMobileOpen(false)}
        />
        <div
          className="transition-all duration-300 min-h-screen"
          style={{ marginLeft: window.innerWidth < 1024 ? 0 : collapsed ? '72px' : '260px' }}
        >
          <div className="p-4 lg:p-6 pt-16 lg:pt-6">
            <AnimatePresence mode="wait">
              {pageLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <LoadingSpinner text="Memuat halaman..." />
                </motion.div>
              ) : (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <Outlet />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

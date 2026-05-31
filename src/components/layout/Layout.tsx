import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { ToastProvider } from '../ui/Toast'

export default function Layout() {
  const location = useLocation()

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
        <Footer />
      </div>
    </ToastProvider>
  )
}

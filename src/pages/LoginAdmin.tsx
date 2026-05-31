import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, LogIn, Eye, EyeOff } from 'lucide-react'
import { useToast } from '../components/ui/Toast'
import { useApp } from '../store/AppContext'
import { supabase } from '../lib/supabase'
import type { User } from '../types'

export default function LoginAdmin() {
  const { adminUser, setAdminUser } = useApp()
  const navigate = useNavigate()

  if (adminUser) return <Navigate to="/admin" replace />
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      showToast('Harap isi email dan password!', 'error')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) {
      showToast('Email atau password salah!', 'error')
      setLoading(false)
      return
    }
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    if (profile && profile.role === 'admin') {
      setAdminUser(profile as unknown as User)
      showToast(`Selamat datang, ${profile.nama}!`, 'success')
      navigate('/admin')
    } else {
      showToast('Anda tidak memiliki akses admin!', 'error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-amber-50 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-amber-500 mb-4 shadow-sm">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Login Admin</h1>
          <p className="text-gray-500 text-sm mt-2">Masuk ke dashboard admin</p>
        </div>

        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email Admin</label>
              <div className="relative">
                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder-gray-400"
                  placeholder="admin@orionjaya.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder-gray-400"
                  placeholder="Masukkan password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white font-medium hover:from-violet-500 hover:to-violet-600 transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <LogIn size={18} />
                </motion.div>
              ) : (
                <><LogIn size={18} /> Masuk ke Dashboard</>
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Demo: admin@orionjaya.com / admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

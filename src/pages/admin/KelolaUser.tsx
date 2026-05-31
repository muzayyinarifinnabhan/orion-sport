import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { useApp } from '../../store/AppContext'
import { insertOne, updateOne, deleteOne } from '../../lib/db'
import type { User } from '../../types'

export default function KelolaUser() {
  const { users, setUsers } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const { showToast } = useToast()

  const [form, setForm] = useState({ nama: '', email: '', telepon: '', password: '', role: 'user' as User['role'] })

  const openAdd = () => {
    setEditing(null)
    setForm({ nama: '', email: '', telepon: '', password: '', role: 'user' })
    setModalOpen(true)
  }

  const openEdit = (u: User) => {
    setEditing(u)
    setForm({ nama: u.nama, email: u.email, telepon: u.telepon, password: u.password, role: u.role })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nama || !form.email) { showToast('Harap lengkapi data!', 'error'); return }
    if (editing) {
      await updateOne('users', editing.id, form)
      setUsers(users.map((u) => u.id === editing.id ? { ...u, ...form } : u))
      showToast('User berhasil diperbarui!', 'success')
    } else {
      const newUser: User = { id: `u-${Date.now()}`, ...form }
      await insertOne('users', newUser)
      setUsers([...users, newUser])
      showToast('User berhasil ditambahkan!', 'success')
    }
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    await deleteOne('users', id)
    setUsers(users.filter((u) => u.id !== id))
    showToast('User berhasil dihapus!', 'error')
  }

  const columns = [
    { key: 'nama', header: 'Nama', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'telepon', header: 'Telepon' },
    { key: 'role', header: 'Role', sortable: true,
      render: (u: User) => (
        <span className={`text-xs px-2 py-0.5 rounded-full border ${u.role === 'admin' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          {u.role === 'admin' ? 'Admin' : 'User'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola User</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data pengguna</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all shadow-sm">
          <Plus size={16} /> Tambah User
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <DataTable
          columns={columns}
          data={users}
          searchKeys={['nama', 'email']}
          actions={(u: User) => (
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Tambah User'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 mb-2">Nama</label>
            <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Telepon</label>
            <input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-200 mb-2">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl text-gray-200 hover:text-white transition-colors text-sm">Batal</button>
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all">
              {editing ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

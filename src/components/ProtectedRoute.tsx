import { Navigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { adminUser } = useApp()
  if (!adminUser) return <Navigate to="/login-admin" replace />
  return <>{children}</>
}

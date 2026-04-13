import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <div className='text-center p-5'>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to='/' replace />
  }

  return children
}

export default ProtectedRoute

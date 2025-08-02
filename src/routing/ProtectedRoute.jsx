import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/stores/useAuthStore'
import Loader from '@/components/ui/Loader'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Loader />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute 
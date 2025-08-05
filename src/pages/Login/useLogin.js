import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import useAuthStore from '@/stores/useAuthStore'

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn, signUp, error, clearError, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle login
  const handleLogin = async (email, password) => {
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return false
    }

    setIsLoading(true)
    clearError()

    try {
      await signIn(email, password)
      toast.success('Login successful!')
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
      return true
    } catch (error) {
      toast.error(error.message || 'Login failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration
  const handleRegistration = async (formData) => {
    const { fullName, email, phone, password, confirmPassword } = formData

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return false
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return false
    }

    setIsLoading(true)
    clearError()

    try {
      await signUp(email, password, fullName, phone)
      toast.success('Registration successful! Please check your email to verify your account.')
      return true
    } catch (error) {
      toast.error(error.message || 'Registration failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleLogin,
    handleRegistration,
    error,
    clearError,
    isAuthenticated
  }
}

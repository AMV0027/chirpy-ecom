import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/db/supabase'
import { toast } from 'sonner'
import useAuthStore from '@/stores/useAuthStore'

export const useLogin = () => {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailExists, setEmailExists] = useState(null)
  const [showEmailExistsMessage, setShowEmailExistsMessage] = useState(false)
  
  const { signIn, signUp, error, clearError, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle email verification redirects
  useEffect(() => {
    const handleEmailVerification = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (session?.user && !session.user.email_confirmed_at) {
        // User is logged in but email is not confirmed
        toast.info('Please check your email and verify your account')
      }
    }

    const handleEmailVerificationRedirect = async () => {
      // Check for email verification in URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const accessToken = urlParams.get('access_token')
      const refreshToken = urlParams.get('refresh_token')
      const type = urlParams.get('type')

      if (accessToken && refreshToken && type === 'email_confirmation') {
        // Handle email verification success
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (!error && data.session) {
          toast.success('Email verified successfully! Welcome to Chirpy!')
          // Redirect to the specified URL
          window.location.href = 'https://chirpy-ecom.vercel.app/'
        } else {
          toast.error('Email verification failed. Please try again.')
        }
      }

      await handleEmailVerification()
    }

    handleEmailVerificationRedirect()
  }, [])

  // Check if email exists
  const checkEmailExists = async (email) => {
    if (!email || !email.includes('@')) {
      setEmailExists(null)
      return
    }

    setIsCheckingEmail(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      setEmailExists(!!data)
    } catch (error) {
      setEmailExists(false)
    } finally {
      setIsCheckingEmail(false)
    }
  }

  // Handle login
  const handleLogin = async (email, password) => {
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return false
    }

    clearError()

    try {
      await signIn(email, password)
      toast.success('Login successful!')

      // Redirect to the page they were trying to access, or home
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
      return true
    } catch (error) {
      toast.error(error.message || 'Login failed')
      return false
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

    // Check if email already exists
    if (emailExists === true) {
      setShowEmailExistsMessage(true)
      toast.error('An account with this email already exists. Please sign in instead.')
      return false
    }

    clearError()

    try {
      await signUp(email, password, fullName, phone)
      toast.success('Registration successful! Please check your email to verify your account.')
      return true
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes('already exists')) {
        setShowEmailExistsMessage(true)
        toast.error(error.message)
        return false
      } else {
        toast.error(error.message || 'Registration failed')
        return false
      }
    }
  }

  // Clear email exists message
  const clearEmailExistsMessage = () => {
    setShowEmailExistsMessage(false)
    setEmailExists(null)
  }

  return {
    isCheckingEmail,
    emailExists,
    showEmailExistsMessage,
    checkEmailExists,
    handleLogin,
    handleRegistration,
    clearEmailExistsMessage,
    error,
    clearError,
    isAuthenticated
  }
}

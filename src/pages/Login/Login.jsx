import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import loginBg from '@/assets/login-bg.jpg'
import logo from '../../assets/logo.png'
import { useLogin } from './useLogin'

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    isLoading,
    handleLogin,
    handleRegistration,
    error,
    clearError,
    isAuthenticated
  } = useLogin()

  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isLoginMode) {
        // Login mode
        const success = await handleLogin(formData.email, formData.password)
        if (success) {
          // Login successful, redirect handled by handleLogin
          return
        }
      } else {
        // Register mode
        const success = await handleRegistration(formData)
        if (success) {
          // Registration successful, show message about email verification
          // Don't redirect - user needs to verify email first
          return
        }
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred')
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })
    clearError()
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6 lg:p-8">
      <Card className="shadow-xl border-[1px] border-gray-200 rounded-xl bg-white flex flex-col lg:flex-row justify-center gap-0 p-0 m-0 w-full max-w-6xl h-auto lg:h-[80vh]">
        {/* Form Section */}
        <div className='w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto'>
          <CardHeader className="pb-4 sm:pb-6 px-0">
            <div className="flex flex-col items-center sm:items-start space-y-4">
              <img src={logo} alt="logo" className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24' />
              <div className="text-center sm:text-left">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                  {isLoginMode ? 'Welcome Back!' : 'Create Your Account'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 mt-2">
                  {isLoginMode
                    ? 'Enter your credentials to access your professional dashboard'
                    : 'Fill in your details to create your professional account'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6 px-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Full Name - Only for Register */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10 h-11 sm:h-12 border-gray-200 focus:border-green-600 focus:ring-green-600 text-sm sm:text-base"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-11 sm:h-12 border-gray-200 focus:border-green-600 focus:ring-green-600 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Phone Number - Only for Register */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 h-11 sm:h-12 border-gray-200 focus:border-green-600 focus:ring-green-600 text-sm sm:text-base"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-11 sm:h-12 border-gray-200 focus:border-green-600 focus:ring-green-600 text-sm sm:text-base"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors h-auto p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password - Only for Register */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 h-11 sm:h-12 border-gray-200 focus:border-green-600 focus:ring-green-600 text-sm sm:text-base"
                      required={!isLoginMode}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors h-auto p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">{isLoginMode ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm sm:text-base">{isLoginMode ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-2 pb-4">
              <p className="text-gray-600 text-sm sm:text-base">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                <Button
                  variant="link"
                  onClick={toggleMode}
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors p-0 h-auto text-sm sm:text-base"
                >
                  {isLoginMode ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            </div>
          </CardContent>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={loginBg}
            alt="Professional Login Background"
            className="w-full h-full object-cover object-center rounded-r-xl"
          />
        </div>

        {/* Mobile/Tablet Image - Only visible on smaller screens */}
        <div className="lg:hidden w-full h-32 sm:h-40 relative">
          <img
            src={loginBg}
            alt="Professional Login Background"
            className="w-full h-full object-cover object-center rounded-b-xl"
          />
        </div>
      </Card>
    </div>
  )
}

export default Login

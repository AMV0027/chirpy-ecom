import { useState, useEffect } from 'react'
import { supabase } from '@/db/supabase'
import useAuthStore from '@/stores/useAuthStore'
import { toast } from 'sonner'

const useProfile = () => {
  const { user, isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: ''
  })

  // Fetch user profile data
  const fetchProfile = async () => {
    if (!isAuthenticated || !user?.email) return

    setIsLoading(true)
    setError(null)
    toast.loading('Loading profile data...')

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        name: data.name || '',
        mobile: data.mobile || '',
        address: data.address || ''
      })
      
      toast.dismiss()
      toast.success('Profile loaded successfully')
    } catch (error) {
      setError(error.message)
      toast.dismiss()
      toast.error('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  // Update profile
  const updateProfile = async (updates) => {
    if (!isAuthenticated || !user?.email) return

    setIsUpdating(true)
    setError(null)
    toast.loading('Updating profile...')

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('email', user.email)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        name: data.name || '',
        mobile: data.mobile || '',
        address: data.address || ''
      })

      toast.dismiss()
      toast.success('Profile updated successfully')
    } catch (error) {
      setError(error.message)
      toast.dismiss()
      toast.error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const updates = {
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      address: formData.address.trim()
    }

    // Basic validation
    if (!updates.name) {
      toast.error('Name is required')
      return
    }

    if (!updates.mobile) {
      toast.error('Mobile number is required')
      return
    }

    await updateProfile(updates)
  }

  // Reset form to original values
  const resetForm = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        mobile: profile.mobile || '',
        address: profile.address || ''
      })
    }
  }

  // Fetch profile on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchProfile()
    }
  }, [isAuthenticated, user?.email])

  return {
    profile,
    formData,
    isLoading,
    isUpdating,
    error,
    handleInputChange,
    handleSubmit,
    resetForm,
    fetchProfile
  }
}

export default useProfile

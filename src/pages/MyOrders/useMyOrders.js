import { useState, useEffect } from 'react'
import { supabase } from '@/db/supabase'
import useAuthStore from '@/stores/useAuthStore'

const useMyOrders = () => {
  const { user, isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, confirmed, processing, completed, cancelled
  const [sortBy, setSortBy] = useState('created_at') // created_at, order_status, product_name
  const [sortOrder, setSortOrder] = useState('desc') // asc, desc

  const fetchOrders = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name,
            price,
            discount,
            images
          )
        `)
        .eq('user_id', user.id)

      // Apply status filter
      if (filter !== 'all') {
        query = query.eq('order_status', filter)
      }

      // Apply sorting
      if (sortBy === 'product_name') {
        query = query.order('products.name', { ascending: sortOrder === 'asc' })
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setOrders(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user, isAuthenticated, filter, sortBy, sortOrder])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'confirmed':
        return 'Confirmed'
      case 'processing':
        return 'Processing'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateTotalPrice = (order) => {
    const price = parseFloat(order.products?.price || 0)
    const discount = parseFloat(order.products?.discount || 0)
    const discountedPrice = price - (price * discount / 100)
    return (discountedPrice * order.quantity).toFixed(2)
  }

  const getFilterOptions = () => [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const getSortOptions = () => [
    { value: 'created_at', label: 'Order Date' },
    { value: 'order_status', label: 'Status' },
    { value: 'product_name', label: 'Product Name' }
  ]

  return {
    orders,
    loading,
    error,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    getStatusColor,
    getStatusText,
    formatDate,
    calculateTotalPrice,
    getFilterOptions,
    getSortOptions,
    refetch: fetchOrders
  }
}

export default useMyOrders

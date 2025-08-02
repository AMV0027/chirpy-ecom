import { create } from 'zustand'
import { supabase } from '@/db/supabase'

const useProductStore = create((set, get) => ({
  products: [],
  filteredProducts: [],
  categories: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    sortOrder: 'asc'
  },

  // Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ 
        products: data || [],
        filteredProducts: data || [],
        isLoading: false 
      })

      // Extract unique categories
      const categories = [...new Set(data?.map(product => product.category).filter(Boolean) || [])]
      set({ categories })
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      })
    }
  },

  // Fetch single product
  fetchProduct: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      set({ isLoading: false })
      return data
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      })
      return null
    }
  },

  // Apply filters
  applyFilters: (filters) => {
    set({ filters })
    const { products } = get()
    
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice))
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy]
      let bValue = b[filters.sortBy]

      if (filters.sortBy === 'price') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      } else {
        aValue = aValue?.toLowerCase()
        bValue = bValue?.toLowerCase()
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    set({ filteredProducts: filtered })
  },

  // Clear filters
  clearFilters: () => {
    const filters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name',
      sortOrder: 'asc'
    }
    set({ filters, filteredProducts: get().products })
  },

  // Get featured products
  getFeaturedProducts: () => {
    const { products } = get()
    return products.slice(0, 8) // Return first 8 products as featured
  },

  // Get products by collection ID
  getProductsByCategory: (collectionId) => {
    const { products } = get()
    return products.filter(product => product.collection_id === collectionId)
  },

  // Search products
  searchProducts: (searchTerm) => {
    const { products } = get()
    if (!searchTerm) return products

    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  }
}))

export default useProductStore 
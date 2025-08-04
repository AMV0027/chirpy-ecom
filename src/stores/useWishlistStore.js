import { create } from 'zustand'
import { supabase } from '@/db/supabase'

const useWishlistStore = create((set, get) => ({
  wishlistItems: [],
  loading: false,
  error: null,
  lastFetch: 0,
  hasInitialized: false,

  // Fetch wishlist items
  fetchWishlist: async (userId, force = false) => {
    if (!userId) return

    const state = get()
    
    // Prevent multiple simultaneous requests
    if (state.loading && !force) return

    // Only fetch if forced, not initialized, or cache expired (5 minutes)
    const now = Date.now()
    const cacheExpired = now - state.lastFetch > 300000 // 5 minutes
    const shouldFetch = force || !state.hasInitialized || cacheExpired

    if (!shouldFetch) return

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('wishlist')
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
        .eq('user_id', userId)

      if (error) throw error

      set({ 
        wishlistItems: data || [], 
        lastFetch: now, 
        hasInitialized: true,
        loading: false 
      })
    } catch (err) {
      set({ 
        error: err.message, 
        loading: false 
      })
      console.error('Error fetching wishlist:', err)
    }
  },

  // Add item to wishlist
  addToWishlist: async (userId, product) => {
    if (!userId) {
      set({ error: 'Please login to add items to wishlist' })
      return false
    }

    const state = get()
    
    // Check if already in wishlist
    const isAlreadyInWishlist = state.wishlistItems.some(item => item.product_id === product.id)
    if (isAlreadyInWishlist) {
      return true
    }

    // Optimistic update
    const newItem = {
      id: `temp-${Date.now()}`,
      user_id: userId,
      product_id: product.id,
      created_at: new Date().toISOString(),
      products: product
    }
    
    set({ wishlistItems: [...state.wishlistItems, newItem] })

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: userId,
          product_id: product.id
        })

      if (error) {
        if (error.code === '23505') {
          // Item already exists in wishlist
          return true
        }
        // Revert optimistic update on error
        set({ wishlistItems: state.wishlistItems.filter(item => item.id !== newItem.id) })
        throw error
      }

      // Update the temporary item with real data
      set({ 
        wishlistItems: state.wishlistItems.map(item => 
          item.id === newItem.id 
            ? { ...item, id: `real-${Date.now()}` } 
            : item
        )
      })

      return true
    } catch (err) {
      set({ error: err.message })
      console.error('Error adding to wishlist:', err)
      return false
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (userId, productId) => {
    if (!userId) return false

    const state = get()

    // Optimistic update
    set({ wishlistItems: state.wishlistItems.filter(item => item.product_id !== productId) })

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) {
        // Revert optimistic update on error
        await get().fetchWishlist(userId, true)
        throw error
      }

      return true
    } catch (err) {
      set({ error: err.message })
      console.error('Error removing from wishlist:', err)
      return false
    }
  },

  // Check if product is in wishlist
  isInWishlist: (productId) => {
    const state = get()
    return state.wishlistItems.some(item => item.product_id === productId)
  },

  // Get wishlist count
  getWishlistCount: () => {
    const state = get()
    return state.wishlistItems.length
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Reset state when user logs out
  reset: () => {
    set({ 
      wishlistItems: [], 
      loading: false, 
      error: null, 
      lastFetch: 0, 
      hasInitialized: false 
    })
  }
}))

export default useWishlistStore 
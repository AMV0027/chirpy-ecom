import { useEffect } from 'react'
import useAuthStore from '@/stores/useAuthStore'
import useWishlistStore from '@/stores/useWishlistStore'

const useWishlist = () => {
  const { user } = useAuthStore()
  const {
    wishlistItems,
    loading,
    error,
    hasInitialized,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    clearError,
    reset
  } = useWishlistStore()

  // Initialize wishlist when user changes
  useEffect(() => {
    if (user && user.id && !hasInitialized) {
      fetchWishlist(user.id)
    } else if (!user) {
      reset()
    }
  }, [user, hasInitialized, fetchWishlist, reset])

  // Wrapper functions to pass user ID
  const addToWishlistWithUser = async (product) => {
    return await addToWishlist(user?.id, product)
  }

  const removeFromWishlistWithUser = async (productId) => {
    return await removeFromWishlist(user?.id, productId)
  }

  const fetchWishlistWithUser = async (force = false) => {
    return await fetchWishlist(user?.id, force)
  }

  return {
    wishlistItems,
    loading,
    error,
    addToWishlist: addToWishlistWithUser,
    removeFromWishlist: removeFromWishlistWithUser,
    isInWishlist,
    getWishlistCount,
    clearError,
    fetchWishlist: fetchWishlistWithUser
  }
}

export default useWishlist

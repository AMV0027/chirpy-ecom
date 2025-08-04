import React, { useCallback } from 'react'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LazyImage from '@/components/ui/LazyImage'
import { Link } from 'react-router-dom'
import useWishlist from './useWishlist'
import useCartStore from '@/stores/useCartStore'
import { toast } from 'sonner'

function Wishlist() {
  const {
    wishlistItems,
    loading,
    error,
    removeFromWishlist,
    clearError
  } = useWishlist()

  const { addToCart } = useCartStore()

  const handleRemoveFromWishlist = useCallback(async (productId) => {
    const success = await removeFromWishlist(productId)
    if (success) {
      toast.success('Removed from wishlist')
    } else {
      toast.error('Failed to remove from wishlist')
    }
  }, [removeFromWishlist])

  const handleAddToCart = useCallback((product) => {
    addToCart(product, 1)
    toast.success('Added to cart')
  }, [addToCart])

  const handleMoveToCart = useCallback(async (product) => {
    // Add to cart
    addToCart(product, 1)

    // Remove from wishlist
    const success = await removeFromWishlist(product.id)

    if (success) {
      toast.success('Moved to cart')
    } else {
      toast.error('Failed to move to cart')
    }
  }, [addToCart, removeFromWishlist])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={clearError}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length === 0
              ? "Your wishlist is empty"
              : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} in your wishlist`
            }
          </p>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding products you love to your wishlist</p>
            <Link to="/products">
              <Button className="bg-emerald-900 hover:bg-emerald-800">
                Browse Products
              </Button>
            </Link>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.products
              return (
                <Card key={item.id} className="group relative bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300">
                  <CardContent className="p-0">
                    <Link to={`/product/${product.id}`} className="block">
                      {/* Image Container */}
                      <div className="relative h-[300px] overflow-hidden bg-gray-50">
                        <LazyImage
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 border-b-2 border-gray-200"
                        />

                        {/* Discount Badge */}
                        {product.discount && product.discount > 0 && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-black text-white border-0 px-2 py-1 text-xs font-medium">
                              -{product.discount}%
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-4 line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>

                        {/* Price Section */}
                        <div className="mb-4">
                          {product.discount && product.discount > 0 ? (
                            <div>
                              <span className="text-xl font-bold text-gray-900">
                                ₹{(product.price - (product.price * product.discount / 100)).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ₹{product.price?.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-gray-900">
                              ₹{product.price?.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="p-4 pt-0 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 bg-emerald-900 text-white hover:bg-emerald-800 border-0"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Move to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist

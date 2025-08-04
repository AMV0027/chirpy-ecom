import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import LazyImage from '@/components/ui/LazyImage'
import useCartStore from '@/stores/useCartStore'
import useWishlist from '@/pages/Wishlist/useWishlist'
import { toast } from 'sonner'

const ProductCard = ({ product, showBadge = false, badgeText = '' }) => {
  const { addToCart } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  const handleAddToCart = useCallback((product) => {
    addToCart(product, 1)
  }, [addToCart])

  const handleWishlistToggle = useCallback(async (e) => {
    e.preventDefault()

    if (isWishlistLoading) return // Prevent multiple clicks

    setIsWishlistLoading(true)
    const isInWishlistState = isInWishlist(product.id)

    try {
      if (isInWishlistState) {
        const success = await removeFromWishlist(product.id)
        if (success) {
          toast.success('Removed from wishlist')
        } else {
          toast.error('Failed to remove from wishlist')
        }
      } else {
        const success = await addToWishlist(product)
        if (success) {
          toast.success('Added to wishlist')
        } else {
          toast.error('Failed to add to wishlist')
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsWishlistLoading(false)
    }
  }, [isWishlistLoading, isInWishlist, removeFromWishlist, addToWishlist, product])

  const isInWishlistState = isInWishlist(product.id)

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 min-w-[280px]">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative h-[300px] overflow-hidden bg-gray-50">
          <LazyImage
            src={product.images?.[0] || product.image || 'https://placehold.co/600x600?text=Loading'}
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

          {/* Heart Button */}
          <div className="absolute top-3 left-3 duration-300">
            <Button
              size="sm"
              variant="secondary"
              disabled={isWishlistLoading}
              className={`h-8 w-8 p-0 border border-gray-200 transition-all duration-200 ${isInWishlistState
                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                : 'bg-white/90 hover:bg-white'
                } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-4 w-4 ${isInWishlistState ? 'fill-current' : 'text-gray-600'}`} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className='flex flex-row items-end justify-between'>
            <div className="">
              {product.discount && product.discount > 0 ? (
                <p className=''>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{(product.price - (product.price * product.discount / 100)).toFixed(2)}
                  </span> <br />
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.price?.toFixed(2)}
                  </span>
                </p>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ₹{product.price?.toFixed(2)}
                </span>
              )}
            </div>
            {/* add to cart button  */}
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                handleAddToCart(product)
              }}
              className="h-10 px-4 bg-emerald-900 text-white hover:bg-gray-800 border-0 shadow-lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Link>

    </div>
  )
}

export default ProductCard

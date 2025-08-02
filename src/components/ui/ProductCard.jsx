import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useCartStore from '@/stores/useCartStore'

const ProductCard = ({ product, showBadge = false, badgeText = '' }) => {
  const { addToCart } = useCartStore()

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 min-w-[280px]">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative h-[300px] overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
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
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white border border-gray-200">
              <Heart className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({product.review_count || 0})
            </span>
          </div>

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
                  ${product.price?.toFixed(2)}
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

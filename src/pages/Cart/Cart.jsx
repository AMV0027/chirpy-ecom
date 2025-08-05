import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/stores/useCartStore'
import useAuthStore from '@/stores/useAuthStore'
import { toast } from 'sonner'

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart
  } = useCartStore()

  const { user, isAuthenticated } = useAuthStore()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      toast.success('Item removed from cart')
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
    toast.success('Item removed from cart')
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Redirect to checkout page
    window.location.href = '/checkout'
  }

  const cartTotal = getCartTotal()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">🛒</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products">
              <Button size="lg">
                Start Shopping
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-3 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      {/* Product Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">${item.price.toFixed(2)} each</p>

                        {/* Quantity Controls - Mobile */}
                        <div className="flex items-center justify-between sm:hidden">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= (item.stock_quantity || 999)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Desktop Controls and Price */}
                      <div className="hidden sm:flex items-center space-x-6">
                        {/* Quantity Controls - Desktop */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.stock_quantity || 999)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price - Desktop */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button - Desktop */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-base sm:text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full"
                  >
                    Clear Cart
                  </Button>
                </div>

                {!isAuthenticated && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-800">
                      Please <Link to="/login" className="underline font-medium">login</Link> to complete your order.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

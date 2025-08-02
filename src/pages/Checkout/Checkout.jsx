import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useCartStore from '@/stores/useCartStore'
import useAuthStore from '@/stores/useAuthStore'
import { formatWhatsAppMessage, sendToWhatsApp, generateOrderId } from '@/lib/whatsapp'
import { toast } from 'sonner'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access checkout')
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
      return
    }
  }, [isAuthenticated, cartItems.length, navigate])

  const cartTotal = getCartTotal()
  const orderId = generateOrderId()

  const handleWhatsAppOrder = () => {
    const message = formatWhatsAppMessage(cartItems, user, orderId)
    sendToWhatsApp(message)

    // Clear cart after sending to WhatsApp
    clearCart()

    toast.success('Order sent to WhatsApp! We will contact you soon.')

    // Redirect to orders page after a short delay
    setTimeout(() => {
      navigate('/my-orders')
    }, 2000)
  }

  const handleBackToCart = () => {
    navigate('/cart')
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToCart}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Info & WhatsApp Order */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{user?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order ID</label>
                    <p className="text-gray-900 font-mono">{orderId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Order */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  Complete Order via WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-900">How it works</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Click the button below to send your order details to our WhatsApp.
                          We'll contact you to confirm your order and arrange payment & delivery.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleWhatsAppOrder}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send Order to WhatsApp
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By clicking this button, you agree to our terms and conditions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Why order via WhatsApp?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Personalized Service</h4>
                      <p className="text-sm text-gray-600">Direct communication with our team</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Flexible Payment</h4>
                      <p className="text-sm text-gray-600">Multiple payment options available</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Fast Delivery</h4>
                      <p className="text-sm text-gray-600">Quick and reliable shipping</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout 
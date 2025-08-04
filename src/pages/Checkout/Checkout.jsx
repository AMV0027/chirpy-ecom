import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, MessageCircle, Edit3, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useCartStore from '@/stores/useCartStore'
import useAuthStore from '@/stores/useAuthStore'
import { formatWhatsAppMessage, sendToWhatsApp, generateOrderId } from '@/lib/whatsapp'
import { toast } from 'sonner'
import { supabase } from '@/db/supabase'

// Form validation schema
const customerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters').optional(),
})

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCartStore()
  const { user, isAuthenticated, updateProfile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)

  // Form setup
  const form = useForm({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || user?.mobile || '',
      address: user?.address || '',
    },
  })

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

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || user.mobile || '',
        address: user.address || '',
      })
    }
  }, [user, form])

  const cartTotal = getCartTotal()
  const orderId = generateOrderId()

  const handleWhatsAppOrder = async () => {
    // Validate required data
    if (!user?.id) {
      toast.error('User information is missing. Please try logging in again.')
      return
    }

    // Ensure we have the correct user ID (from users table, not auth)
    const userId = user.id

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.')
      return
    }

    setIsProcessingOrder(true)
    try {
      // Store order information in database
      const orderPromises = cartItems.map(async (item) => {
        // Validate item data
        if (!item.id || !item.quantity || item.quantity <= 0) {
          throw new Error(`Invalid item data: ${item.name}`)
        }

        const { error } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            product_id: item.id,
            quantity: item.quantity,
            requirements: `Order ID: ${orderId}`,
            order_status: 'pending',
            whatsapp_sent: true,
            whatsapp_sent_at: new Date().toISOString(),
            notes: `Order placed via WhatsApp. Customer: ${user.name}, Phone: ${user.phone || user.mobile}, Email: ${user.email}, Address: ${user.address || 'Not provided'}, Total Items: ${cartItems.length}, Total Amount: $${cartTotal.toFixed(2)}`
          })

        if (error) {
          console.error('Error storing order:', error)
          throw error
        }
      })

      // Wait for all orders to be stored
      await Promise.all(orderPromises)

      // Send WhatsApp message
      const message = formatWhatsAppMessage(cartItems, user, orderId)
      sendToWhatsApp(message)

      // Clear cart after successful database storage and WhatsApp sending
      clearCart()

      toast.success(`Order sent to WhatsApp! Order ID: ${orderId}. We will contact you soon.`)

      // Redirect to orders page after a short delay
      setTimeout(() => {
        navigate('/my-orders')
      }, 2000)
    } catch (error) {
      console.error('Error processing order:', error)
      toast.error('Failed to process order. Please try again.')
    } finally {
      setIsProcessingOrder(false)
    }
  }

  const handleBackToCart = () => {
    navigate('/cart')
  }

  const handleSaveCustomerInfo = async (data) => {
    setIsSaving(true)
    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name: data.name,
          email: data.email,
          mobile: data.phone,
          address: data.address || null,
        })
        .eq('email', user.email)

      if (error) {
        throw error
      }

      // Update local user state
      await updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      })

      setIsEditing(false)
      toast.success('Customer information updated successfully!')
    } catch (error) {
      console.error('Error updating customer info:', error)
      toast.error('Failed to update customer information')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    form.reset()
    setIsEditing(false)
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToCart}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Order Summary - Takes 2 columns on xl screens */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-6 pt-6 space-y-3">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg sm:text-xl font-semibold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Info & WhatsApp Order - Takes 1 column on xl screens */}
          <div className="space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg">Customer Information</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="h-8 w-8 p-0"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSaveCustomerInfo)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your delivery address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex space-x-2 pt-2">
                        <Button type="submit" disabled={isSaving} className="flex-1">
                          {isSaving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save</>}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Name</Label>
                      <p className="text-sm text-gray-900">{user?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Email</Label>
                      <p className="text-sm text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Phone</Label>
                      <p className="text-sm text-gray-900">{user?.phone || user?.mobile || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Address</Label>
                      <p className="text-sm text-gray-900">{user?.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Order ID</Label>
                      <p className="text-sm text-gray-900 font-mono">{orderId}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* WhatsApp Order */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  Complete Order via WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-900 text-sm sm:text-base">How it works</h3>
                        <p className="text-xs sm:text-sm text-green-700 mt-1">
                          Click the button below to send your order details to our WhatsApp.
                          We'll contact you to confirm your order and arrange payment & delivery.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleWhatsAppOrder}
                      disabled={isProcessingOrder}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                      size="lg"
                    >
                      {isProcessingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Send Order to WhatsApp
                        </>
                      )}
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
                <CardTitle className="text-lg">Why order via WhatsApp?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">Personalized Service</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Direct communication with our team</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">Flexible Payment</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Multiple payment options available</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">Fast Delivery</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Quick and reliable shipping</p>
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
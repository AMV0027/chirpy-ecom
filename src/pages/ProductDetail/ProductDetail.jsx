import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart, Heart, Eye, Truck, Shield, RotateCcw, Share2, Minus, Plus, CheckCircle, Info, AlertCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import useProductStore from '@/stores/useProductStore'
import useCartStore from '@/stores/useCartStore'
import useWishlistStore from '@/stores/useWishlistStore'
import useAuthStore from '@/stores/useAuthStore'
import Loader from '@/components/ui/Loader'
import { sendToWhatsApp, formatWhatsAppMessage } from '@/lib/whatsapp'

const ProductDetail = () => {
  const { id } = useParams()
  const { fetchProduct, products, isLoading } = useProductStore()
  const { addToCart, cartItems } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlistStore()
  const { user, isAuthenticated } = useAuthStore()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showFullSpecs, setShowFullSpecs] = useState(false)
  const [showFullTopSpecs, setShowFullTopSpecs] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProduct(id).then(setProduct)
    }
  }, [id, fetchProduct])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      // Create a single item order for WhatsApp
      const orderData = {
        cartItems: [{
          id: product.id,
          name: product.name,
          price: getDiscountedPrice(),
          quantity: quantity
        }],
        user: null, // Will be filled by user data if available
        orderId: 'DIRECT-' + Date.now(),
        totalAmount: getDiscountedPrice() * quantity
      }
      const message = formatWhatsAppMessage(orderData.cartItems, orderData.user, orderData.orderId)
      sendToWhatsApp(message)
    }
  }

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const isInCart = product && cartItems.some(item => item.id === product.id)
  const isInWishlistState = product && isInWishlist(product.id)

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      // You could show a login prompt here
      alert('Please login to add items to wishlist')
      return
    }
    if (product) {
      if (isInWishlistState) {
        await removeFromWishlist(user.id, product.id)
      } else {
        await addToWishlist(user.id, product)
      }
    }
  }

  // Calculate discounted price
  const getDiscountedPrice = () => {
    if (!product) return 0
    const originalPrice = parseFloat(product.price)
    const discount = parseFloat(product.discount || 0)
    return originalPrice - (originalPrice * discount / 100)
  }

  // Render JSON blocks
  const renderBlocks = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null
    return blocks.map((block, index) => {
      switch (block.type) {
        case 'list':
          return (
            <div key={index} className="mb-4">
              {block.title && <h4 className="font-semibold text-gray-900 mb-2">{block.title}</h4>}
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {block.content.map((item, i) => {
                  // Remove numbered prefixes like "1.", "2.", "10.", etc. from the beginning of the item
                  const cleanedItem = item.replace(/^\d+\.\s*/, '')
                  return <li key={i} className="text-md">{cleanedItem}</li>
                })}
              </ul>
            </div>
          )
        case 'paragraph':
          return (
            <div key={index} className="mb-4">
              {block.title && <h4 className="font-semibold text-gray-900 mb-2">{block.title}</h4>}
              <p className="text-gray-600 text-md leading-relaxed">{block.content}</p>
            </div>
          )
        case 'keyvalue':
          return (
            <div key={index} className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">{block.title}</h4>
              <p className="text-gray-600 text-md">{block.content}</p>
            </div>
          )
        case 'label':
          return (
            <div key={index} className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">{block.title}</h4>
            </div>
          )
        default:
          return null
      }
    })
  }

  // Render product overview specifications
  const renderProductOverview = () => {
    if (!product?.product_overview?.blocks) return null
    return (
      <div className="grid grid-cols-1 gap-4">
        {product.product_overview.blocks.map((block, index) => (
          <div key={index} className="flex justify-between py-3 border-b border-gray-100">
            <span className="font-medium text-gray-700">{block.title}</span>
            <span className="text-gray-600 text-sm">{block.content}</span>
          </div>
        ))}
      </div>
    )
  }

  if (isLoading || !product) {
    return <Loader />
  }

  const images = product.images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop']
  const discountedPrice = getDiscountedPrice()
  const relatedProducts = products
    .filter(p => p.collection_id === product.collection_id && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-emerald-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <div className="block lg:sticky top-4 pt-2 md:pt-4">
            <div className="space-y-4 px-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex space-x-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-emerald-600' : 'border-gray-200'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 pt-4 md:pt-6">
            <div className="py-4 px-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.0 reviews)</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  ₹{discountedPrice.toLocaleString()}
                </div>
                {product.discount && parseFloat(product.discount) > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-500 line-through">
                      ₹{parseFloat(product.price).toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {product.discount}% OFF
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Product Specifications */}
            {product.product_overview && (
              <div className="">
                <h3 className="font-semibold text-gray-900 mb-3">Product Specifications</h3>
                <div className="relative">
                  <div
                    className={`space-y-3 transition-all duration-300 ${showFullTopSpecs ? 'max-h-none' : 'max-h-[200px] overflow-hidden'
                      }`}
                  >
                    {renderProductOverview()}
                  </div>
                  {!showFullTopSpecs && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFullTopSpecs(!showFullTopSpecs)}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      {showFullTopSpecs ? 'Show Less' : 'Show More'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start flex-between space-x-4">
                <Truck className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Ready to ship by late-March. Mattress not included. Made in limited
                  runs.
                </span>
              </div>
              <div className="flex items-start flex-between space-x-4">
                <Shield className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Financing available with Affirm, PayPal, or Afterpay.
                </span>
              </div>
              <div className="flex items-start flex-between space-x-4">
                <RotateCcw className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Eligible for Premium Delivery. Scheduled delivery to room of choice,
                  and assembly & package removal.
                </span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              {/* First Row: Quantity and Add to Cart */}
              <div className="flex items-center space-x-2">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={isInCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </Button>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-1 text-sm font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => handleQuantityChange('increase')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={isInWishlistState ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isInWishlistState ? 'fill-current' : ''}`} />
                </Button>
              </div>
              {/* Second Row: Buy Now and Like Button */}
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  className="flex-1"
                  variant="default"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Product Details Accordion */}
            <div className="mt-2">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {/* Overview */}
                <AccordionItem value="overview" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">Product Overview</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    {product.overview ? (
                      <div className="space-y-4">
                        {renderBlocks(product.overview.blocks)}
                      </div>
                    ) : (
                      <p className="text-gray-600">No overview available for this product.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                {/* Specifications */}
                <AccordionItem value="specifications" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">Product Specifications</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="relative">
                      <div
                        className={`space-y-4 transition-all duration-300 ${showFullSpecs ? 'max-h-none' : 'max-h-[200px] overflow-hidden'
                          }`}
                      >
                        {renderProductOverview()}
                      </div>
                      {!showFullSpecs && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      )}
                      <div className="mt-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFullSpecs(!showFullSpecs)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          {showFullSpecs ? 'Show Less' : 'Show More'}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Care & Instructions */}
                <AccordionItem value="care" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">Care & Maintenance Instructions</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    {product.care_and_instructions ? (
                      <div className="space-y-4">
                        {renderBlocks(product.care_and_instructions.blocks)}
                      </div>
                    ) : (
                      <p className="text-gray-600">No care instructions available for this product.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                {/* Delivery & Installation */}
                <AccordionItem value="delivery" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">Delivery & Installation</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    {product.delivery_installation ? (
                      <div className="space-y-4">
                        {renderBlocks(product.delivery_installation.blocks)}
                      </div>
                    ) : (
                      <p className="text-gray-600">No delivery information available for this product.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                {/* FAQ */}
                <AccordionItem value="faq" className="border border-gray-200 rounded-lg">
                  <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">Frequently Asked Questions</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    {product.faq ? (
                      <div className="space-y-4">
                        {product.faq.blocks.map((faq, index) => (
                          <div key={index} className="border border-gray-100 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{faq.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{faq.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No FAQ available for this product.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
                {/* Terms & Conditions */}
                {product.terms_and_conditions && (
                  <AccordionItem value="terms" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">Terms & Conditions</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4">
                        {renderBlocks(product.terms_and_conditions.blocks)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {/* Disclaimer */}
                {product.disclaimer && (
                  <AccordionItem value="disclaimer" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">Important Disclaimer</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4">
                        {renderBlocks(product.disclaimer.blocks)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-white border-gray-100 overflow-hidden">
                    <CardHeader className="p-0 relative">
                      <div className="aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={relatedProduct.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight mb-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{parseFloat(relatedProduct.price).toLocaleString()}
                        </span>
                        <Button size="sm" className="h-8 px-3 text-xs">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart, Heart, Eye, Truck, Shield, RotateCcw, Share2, Minus, Plus, CheckCircle, Info, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import useProductStore from '@/stores/useProductStore'
import useCartStore from '@/stores/useCartStore'
import Loader from '@/components/ui/Loader'

const ProductDetail = () => {
  const { id } = useParams()
  const { fetchProduct, products, isLoading } = useProductStore()
  const { addToCart, cartItems } = useCartStore()

  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('overview')

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

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const isInCart = product && cartItems.some(item => item.id === product.id)

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
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {block.content.map((item, i) => (
                  <li key={i} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )
        case 'paragraph':
          return (
            <div key={index} className="mb-4">
              {block.title && <h4 className="font-semibold text-gray-900 mb-2">{block.title}</h4>}
              <p className="text-gray-600 text-sm leading-relaxed">{block.content}</p>
            </div>
          )
        case 'keyvalue':
          return (
            <div key={index} className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">{block.title}</h4>
              <p className="text-gray-600 text-sm">{block.content}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
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
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-600' : 'border-gray-200'
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
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

            {/* Product Overview */}
            {product.overview && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Product Overview</h3>
                {renderBlocks(product.overview.blocks)}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-1 text-sm font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange('increase')}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={isInCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="care">Care & Instructions</TabsTrigger>
              <TabsTrigger value="delivery">Delivery & Installation</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Overview</h3>
                  {product.overview ? (
                    renderBlocks(product.overview.blocks)
                  ) : (
                    <p className="text-gray-600">No overview available for this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                  {renderProductOverview()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Care & Maintenance Instructions</h3>
                  {product.care_and_instructions ? (
                    renderBlocks(product.care_and_instructions.blocks)
                  ) : (
                    <p className="text-gray-600">No care instructions available for this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Delivery & Installation</h3>
                  {product.delivery_installation ? (
                    renderBlocks(product.delivery_installation.blocks)
                  ) : (
                    <p className="text-gray-600">No delivery information available for this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                  {product.faq ? (
                    <Accordion type="single" collapsible className="w-full">
                      {product.faq.blocks.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-gray-600 text-sm leading-relaxed">{faq.content}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-gray-600">No FAQ available for this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Terms and Conditions */}
        {product.terms_and_conditions && (
          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span>Terms & Conditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderBlocks(product.terms_and_conditions.blocks)}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Disclaimer */}
        {product.disclaimer && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span>Important Disclaimer</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderBlocks(product.disclaimer.blocks)}
              </CardContent>
            </Card>
          </div>
        )}

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
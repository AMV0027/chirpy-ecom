import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart, Heart, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useProductStore from '@/stores/useProductStore'
import useCartStore from '@/stores/useCartStore'
import { supabase } from '@/db/supabase'
import Loader from '@/components/ui/Loader'
import { Navigate } from 'react-router-dom'
import ProductCard from '@/components/ui/ProductCard'

const Collections = () => {
  const { id } = useParams()
  const { products, isLoading, fetchProducts, getProductsByCategory } = useProductStore()
  const { addToCart } = useCartStore()

  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('grid')
  const [collection, setCollection] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Fetch collection information
  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching collection:', error)
        } else {
          setCollection(data)
        }
      } catch (error) {
        console.error('Error fetching collection:', error)
      }
    }

    fetchCollection()
  }, [id])

  useEffect(() => {
    if (products.length > 0 && id) {
      let categoryProducts = getProductsByCategory(id)

      // Apply search filter
      if (searchQuery) {
        categoryProducts = categoryProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Apply sorting
      categoryProducts.sort((a, b) => {
        let aValue = a[sortBy]
        let bValue = b[sortBy]

        if (sortBy === 'price') {
          aValue = parseFloat(aValue)
          bValue = parseFloat(bValue)
        } else if (sortBy === 'name') {
          aValue = aValue?.toLowerCase()
          bValue = bValue?.toLowerCase()
        }

        return aValue > bValue ? 1 : -1
      })

      setFilteredProducts(categoryProducts)
    }
  }, [products, id, searchQuery, sortBy, getProductsByCategory])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  const getCategoryInfo = (collectionId) => {
    if (collection) {
      return {
        name: collection.name,
        icon: '📦',
        description: collection.description || 'Products in this collection',
        color: 'bg-blue-50 border-blue-200'
      }
    }

    // Fallback while loading
    return {
      name: `Collection ${collectionId}`,
      icon: '📦',
      description: 'Products in this collection',
      color: 'bg-gray-50 border-gray-200'
    }
  }

  if (isLoading) {
    return <Loader />
  }

  const categoryInfo = getCategoryInfo(id)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Title and Description */}
          <div className="flex flex-row gap-2 w-full">
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 border border-gray-200 shadow-xs">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className='flex flex-col'>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryInfo.name}</h1>
            </div>
          </div>
          {/* <p className="text-gray-600 text-sm mb-1">{categoryInfo.description}</p> */}

          {/* Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Search and Sort Controls */}
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={`Search from the ${filteredProducts.length} products in ${categoryInfo.name}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 text-sm"
                />
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-[100px] text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-8">
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-4 ${viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
            }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? `No products match "${searchQuery}" in ${categoryInfo.name}` : `No products available in ${categoryInfo.name}`}
            </p>
            <Link to="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Collections 
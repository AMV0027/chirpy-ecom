import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Filter, ArrowRight, ChevronLeft, ChevronRight, Star, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Breadcrumb from '@/components/ui/Breadcrumb'
import ProductCard from '@/components/ui/ProductCard'
import useProductStore from '@/stores/useProductStore'
import { supabase } from '@/db/supabase'
import Loader from '@/components/ui/Loader'

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [trendingProducts, setTrendingProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const {
    products,
    fetchProducts,
    getProductsByCategory
  } = useProductStore()

  // Fetch products and collections
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await fetchProducts()

      // Fetch collections
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('hide', false)
          .order('name')

        if (error) {
          console.error('Error fetching collections:', error)
        } else {
          setCollections(data || [])
        }
      } catch (error) {
        console.error('Error fetching collections:', error)
      } finally {
        setCollectionsLoading(false)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [fetchProducts])

  // Set trending products when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      // Get trending products (random selection for demo)
      const trending = products
        .sort(() => 0.5 - Math.random())
        .slice(0, 8)
      setTrendingProducts(trending)
    }
  }, [products])

  // Get products for each collection
  const getCollectionProducts = (collectionId) => {
    return products.filter(product => product.collection_id === collectionId)
  }

  const ProductSection = ({ title, products, viewAllLink, icon: Icon }) => {
    const scrollContainerRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      }
    }

    const scrollLeft = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
      }
    }

    const scrollRight = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
      }
    }

    useEffect(() => {
      checkScrollButtons()
      const container = scrollContainerRef.current
      if (container) {
        container.addEventListener('scroll', checkScrollButtons)
        return () => container.removeEventListener('scroll', checkScrollButtons)
      }
    }, [products])

    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            </div>

            <div className="flex items-center space-x-2">
              {/* Scroll Buttons */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
              {viewAllLink && (
                <Link to={viewAllLink}>
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="relative w-full">
            <div
              ref={scrollContainerRef}
              className="flex w-full space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Products' }
        ]}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-600">Browse our complete product catalog</p>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-[120px]">
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

      <div className='p-4'>
        {/* Trending Products */}
        {trendingProducts.length > 0 && (
          <ProductSection
            title="Trending Now"
            products={trendingProducts}
            viewAllLink="/products?sort=trending"
            icon={Star}
          />
        )}

        {/* Individual Collection Sections */}
        {!collectionsLoading && collections.map((collection) => {
          const collectionProducts = getCollectionProducts(collection.id)

          // Only show collection if it has products
          if (collectionProducts.length === 0) return null

          return (
            <ProductSection
              key={collection.id}
              title={collection.name}
              products={collectionProducts}
              viewAllLink={`/collections/${collection.id}`}
              icon={Package}
            />
          )
        })}
      </div>

      <div className="max-w-7xl mx-auto pb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products 
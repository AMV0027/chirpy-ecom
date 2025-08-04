import React, { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/db/supabase'
import CollectionCard from '@/components/ui/CollectionCard'
import Loader from '@/components/ui/Loader'
import Breadcrumb from '@/components/ui/Breadcrumb'

const CollectionsOverview = () => {
  const [collections, setCollections] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    const fetchCollectionsAndProducts = async () => {
      try {
        // Fetch collections from the collections table
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections')
          .select('*')
          .eq('hide', false)

        if (collectionsError) {
          console.error('Error fetching collections:', collectionsError)
          setError('Failed to load collections. Please try again later.')
          setIsLoading(false)
          return
        }

        // Fetch all products to get product counts for each collection
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')

        if (productsError) {
          console.error('Error fetching products:', productsError)
          setError('Failed to load collections. Please try again later.')
          setIsLoading(false)
          return
        }

        setProducts(productsData || [])
        setCollections(collectionsData || [])
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching collections:', error)
        setError('Failed to load collections. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchCollectionsAndProducts()
  }, [])

  const getCollectionProducts = (collectionId) => {
    return products.filter(product => product.collection_id === collectionId)
  }

  // Filter collections based on search query
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort collections
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'products') {
      const aCount = getCollectionProducts(a.id).length
      const bCount = getCollectionProducts(b.id).length
      return bCount - aCount
    } else if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at)
    }
    return 0
  })

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Collections</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Collections' }
        ]}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Our Collections</h1>
            <p className="text-gray-600">Discover our carefully curated furniture collections</p>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Input
                  type="text"
                  placeholder="Search collections..."
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
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {sortedCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                getCollectionProducts={getCollectionProducts}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No collections match "${searchQuery}"`
                : 'Collections will appear here once they are added to the database.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionsOverview 
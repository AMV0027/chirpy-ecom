import { useEffect, useState } from 'react'
import useProductStore from '@/stores/useProductStore'
import { supabase } from '@/db/supabase'

const useHome = () => {
  const {
    products,
    isLoading,
    fetchProducts,
    getFeaturedProducts,
    getProductsByCategory
  } = useProductStore()

  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [collections, setCollections] = useState([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollectionsLoading(true)
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
      }
    }

    fetchCollections()
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      // Get featured products (first 8)
      const featured = getFeaturedProducts()
      setFeaturedProducts(featured)

      // Get trending products (random selection for demo)
      const trending = products
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
      setTrendingProducts(trending)

      // Get new arrivals (latest products)
      const newArrivals = products
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4)
      setNewArrivals(newArrivals)
    }
  }, [products, getFeaturedProducts])

  // Get products for each collection
  const getCollectionProducts = (collectionId) => {
    return products.filter(product => product.collection_id === collectionId).slice(0, 4)
  }

  const categories = [
    { 
      name: 'Electronics', 
      icon: '📱', 
      color: 'bg-blue-50 border-blue-200',
      description: 'Latest gadgets and tech',
      productCount: getProductsByCategory('Electronics').length
    },
    { 
      name: 'Clothing', 
      icon: '👕', 
      color: 'bg-green-50 border-green-200',
      description: 'Fashion and apparel',
      productCount: getProductsByCategory('Clothing').length
    },
    { 
      name: 'Home & Garden', 
      icon: '🏠', 
      color: 'bg-yellow-50 border-yellow-200',
      description: 'Home improvement essentials',
      productCount: getProductsByCategory('Home & Garden').length
    },
    { 
      name: 'Sports', 
      icon: '⚽', 
      color: 'bg-red-50 border-red-200',
      description: 'Sports and fitness gear',
      productCount: getProductsByCategory('Sports').length
    },
    { 
      name: 'Books', 
      icon: '📚', 
      color: 'bg-purple-50 border-purple-200',
      description: 'Books and literature',
      productCount: getProductsByCategory('Books').length
    },
    { 
      name: 'Toys', 
      icon: '🎮', 
      color: 'bg-pink-50 border-pink-200',
      description: 'Games and entertainment',
      productCount: getProductsByCategory('Toys').length
    }
  ]

  const stats = [
    { label: 'Products', value: products.length, icon: '📦' },
    { label: 'Categories', value: categories.length, icon: '🏷️' },
    { label: 'Happy Customers', value: '1000+', icon: '😊' },
    { label: 'Fast Delivery', value: '24h', icon: '🚚' }
  ]

  return {
    featuredProducts,
    trendingProducts,
    newArrivals,
    collections,
    collectionsLoading,
    getCollectionProducts,
    categories,
    stats,
    isLoading
  }
}

export default useHome

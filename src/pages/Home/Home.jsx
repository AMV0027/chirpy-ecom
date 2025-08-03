import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Eye, Package, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import collectionImage from "../../assets/collection-card.jpg";
import ProductCard from '@/components/ui/ProductCard'
import CollectionCard from '@/components/ui/CollectionCard'
import useHome from './useHome'
import useCartStore from '@/stores/useCartStore'
import Loader from '@/components/ui/Loader'

const Home = () => {
  const {
    featuredProducts,
    trendingProducts,
    newArrivals,
    collections,
    collectionsLoading,
    getCollectionProducts,
    categories,
    stats,
    isLoading
  } = useHome()

  const { addToCart } = useCartStore()
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  // Banner carousel data
  const banners = [
    {
      id: 1,
      title: "Elegant Wood Furniture",
      subtitle: "Discover timeless pieces crafted with premium materials",
      image: "https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      cta: "Explore Collection",
      link: "/products"
    },
    {
      id: 2,
      title: "Modern Living Spaces",
      subtitle: "Transform your home with our curated furniture selection",
      image: "https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      cta: "Shop Now",
      link: "/collections/furniture"
    },
    {
      id: 3,
      title: "Premium Home Decor",
      subtitle: "Create beautiful spaces with our handcrafted furniture",
      image: "https://images.pexels.com/photos/1366879/pexels-photo-1366879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      cta: "View Collection",
      link: "/collections/home"
    }
  ]

  // Auto-advance banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  if (isLoading) {
    return <Loader />
  }



  const ProductSection = ({ title, products, viewAllLink, icon: Icon }) => (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* {Icon && <Icon className="h-6 w-6 text-blue-600" />} */}
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          </div>
          <Link to={viewAllLink}>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  const CollectionSection = ({ title, collections, viewAllLink, icon: Icon }) => (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          </div>
          <Link to={viewAllLink}>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {/* Explore Collections Card */}
            <div className="group relative bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 min-w-[300px]">
              <Link to="/collections" className="block">
                {/* Image Container */}
                <div className="relative h-[400px] w-[300px] overflow-hidden bg-gray-50">
                  <img src={collectionImage}
                    className='w-full h-full'
                    alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end text-white">
                    <div className="text-center p-6">
                      <h3 className="text-xl font-semibold mb-2">Explore All Collections</h3>
                      <p className="text-sm text-gray-300 mb-4">
                        Discover our complete range of handcrafted furniture and home decor
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Collection Name */}
                  <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2">
                    Browse All Collections
                  </h3>
                </div>
              </Link>
            </div>

            {/* Individual Collection Cards */}
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} getCollectionProducts={getCollectionProducts} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Carousel */}
      <section className="relative bg-gray-50">
        <div className="relative overflow-hidden h-[90vh]">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}>
            {banners.map((banner, index) => (
              <div key={banner.id} className="w-full flex-shrink-0">
                <div className="relative h-screen">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-bottom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-4xl mx-auto px-4">
                      <h1 className="text-4xl md:text-6xl font-medium mb-3">{banner.title}</h1>
                      <p className="text-base md:text-lg mb-6 opacity-90">{banner.subtitle}</p>
                      <Link to={banner.link}>
                        <Button size="lg" className="text-sm px-6 py-3 bg-white text-gray-900 hover:bg-gray-100">
                          {banner.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevBanner}
            className="absolute left-4 top-[85vh] md:top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-[85vh]  md:top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blue-sm hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      {!collectionsLoading && collections.length > 0 && (
        <CollectionSection
          title="Shop by Collections"
          collections={collections}
          viewAllLink="/collections"
          icon={Grid3X3}
        />
      )}

      {/* slogan section */}
      <div className='relative w-full p-2 flex flex-row items-center justify-center'>
        <h1 className='relative text-center md:text-left text-2xl md:text-3xl lg:text-4xl font-light font-poppins'>
          <div className='absolute -top-5 left-2 md:-top-5 md:-left-10 lg:-top-5 lg:-left-10 text-5xl md:text-7xl font-playfair font-bold'>"</div>
          Timeless Wood Products, Expertly Crafted for Your <br className='hidden md:block' /> Space with{" "}
          <span className='text-emerald-800 font-playfair font-bold'>
            Durability.
          </span>
        </h1>
      </div >

      {/* Trending Products */}
      < ProductSection
        title="Trending Now"
        products={trendingProducts}
        viewAllLink="/products?sort=trending"
        icon={Star}
      />

      {/* New Arrivals */}
      < ProductSection
        title="New Arrivals"
        products={newArrivals}
        viewAllLink="/products?sort=newest"
        icon={Star}
      />

      {/* Individual Collection Sections */}
      {
        !collectionsLoading && collections.map((collection) => {
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
        })
      }
    </div >
  )
}

export default Home

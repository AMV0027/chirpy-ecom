import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const CollectionCard = ({ collection, getCollectionProducts }) => {
  const collectionProducts = getCollectionProducts(collection.id)
  const productCount = collectionProducts.length

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 min-w-[300px]">
      <Link to={`/collections/${collection.id}`} className="block">
        {/* Image Container */}
        <div className="relative h-[400px] w-[300px] overflow-hidden bg-gray-50">
          <img
            src={collection.image_url || 'https://placehold.co/600x600?text=Loading'}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 border-b-2 border-gray-200"
          />

          {/* Product Count Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-black text-white border-0 px-2 py-1 text-xs font-medium">
              {productCount} {productCount === 1 ? 'Product' : 'Products'}
            </Badge>
          </div>

          {/* Explore Button Overlay */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="bg-gray-800/90 text-white hover:bg-gray-800 border-0 px-4 py-2 text-sm font-medium"
            >
              Explore Collection
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Collection Name */}
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2">
            {collection.name}
          </h3>
        </div>
      </Link>
    </div>
  )
}

export default CollectionCard 
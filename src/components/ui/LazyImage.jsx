import React, { useState, useRef, useEffect } from 'react'

// Global cache to store loaded images
const imageCache = new Set()

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'https://placehold.co/600x600?text=Loading',
  fallback = 'https://placehold.co/600x600?text=Loading',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(() => {
    // If image is already cached, use it immediately
    return imageCache.has(src) ? src : placeholder
  })
  const [imageLoading, setImageLoading] = useState(() => {
    // If image is cached, it's not loading
    return !imageCache.has(src)
  })
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    // If image is already cached, don't set up intersection observer
    if (imageCache.has(src)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [src])

  const handleLoad = () => {
    setImageLoading(false)
    setImageError(false)
    // Cache the successfully loaded image
    imageCache.add(src)
  }

  const handleError = () => {
    setImageLoading(false)
    setImageError(true)
    setImageSrc(fallback)
  }

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity w-full h-full object-cover duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
        {...props}
      />

      {/* Loading skeleton */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-xs">Image unavailable</div>
        </div>
      )}
    </div>
  )
}

export default LazyImage 
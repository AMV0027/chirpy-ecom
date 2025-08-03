import React, { useState, useEffect } from 'react'

function Loader() {
  const [currentSlogan, setCurrentSlogan] = useState(0)

  const slogans = [
    "Your Furniture Tales",
    "Crafting Comfort",
    "Nature Meets Design",
    "Quality You Can Trust"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length)
    }, 2000) // Change slogan every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      {/* Logo Container */}
      <div className="mb-6">
        <img
          src="/logo.png"
          alt="CHIRPY Logo"
          className="w-64 h-64 object-contain animate-pulse"
        />
      </div>

      {/* Three Dot Loader */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-gray-600 text-sm font-medium">Loading...</p>

      {/* Alternating Slogan */}
      <div className="mt-3 h-6 flex items-center justify-center">
        <p className="text-gray-500 text-xs font-medium transition-opacity duration-500">
          {slogans[currentSlogan]}
        </p>
      </div>
    </div>
  )
}

export default Loader

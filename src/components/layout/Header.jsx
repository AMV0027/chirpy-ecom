import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, Heart, Package, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useCartStore from '@/stores/useCartStore'
import useAuthStore from '@/stores/useAuthStore'
import useWishlistStore from '@/stores/useWishlistStore'
import { supabase } from '@/db/supabase'
import Loader from '@/components/ui/Loader'

const Header = () => {
  const { cartItems } = useCartStore()
  const { user, isAuthenticated, signOut } = useAuthStore()
  const { getWishlistCount } = useWishlistStore()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const cartItemCount = useMemo(() => cartItems.length, [cartItems])
  const wishlistCount = useMemo(() => getWishlistCount(), [getWishlistCount])

  // Fetch collections from Supabase
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('collections')
          .select('id, name, description')
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
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  // Debounced search functionality
  useEffect(() => {
    const searchProductsAndCollections = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setShowSearchDropdown(false)
        return
      }

      try {
        setSearchLoading(true)
        setShowSearchDropdown(true)

        // Search products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, images')
          .ilike('name', `%${searchQuery}%`)
          .eq('hide', false)
          .limit(5)

        // Search collections
        const { data: collections, error: collectionsError } = await supabase
          .from('collections')
          .select('id, name, description')
          .ilike('name', `%${searchQuery}%`)
          .eq('hide', false)
          .limit(3)

        if (productsError) {
          console.error('Error searching products:', productsError)
        }
        if (collectionsError) {
          console.error('Error searching collections:', collectionsError)
        }

        const results = [
          ...(products || []).map(product => ({ ...product, type: 'product' })),
          ...(collections || []).map(collection => ({ ...collection, type: 'collection' }))
        ]

        setSearchResults(results)
      } catch (error) {
        console.error('Error searching:', error)
      } finally {
        setSearchLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProductsAndCollections, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Handle collection selection
  const handleCollectionChange = useCallback((collectionId) => {
    setSelectedCollection(collectionId)
    if (collectionId) {
      navigate(`/collections/${collectionId}`)
    }
  }, [navigate])

  const handleSearchResultClick = useCallback((result) => {
    setSearchQuery('')
    setShowSearchDropdown(false)
    setSearchResults([])
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }, [isMobileMenuOpen])

  const handleLogout = useCallback(async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }, [signOut])

  const getInitials = useCallback((name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }, [])

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[10vh]">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              {/* <img src="/logo.png" alt="Logo" className="h-12" /> */}
              <span className="text-xl font-bold font-poppins">CHIRPY</span>
            </Link>
            <nav className="hidden md:flex items-end space-x-6">
              <Link
                to="/products"
                className="text-white hover:text-gray-300 transition-colors font-medium text-sm"
              >
                Products
              </Link>
              <Link
                to="/collections"
                className="text-white hover:text-gray-300 transition-colors font-medium text-sm"
              >
                Collections
              </Link>
            </nav>
          </div>

          {/* Search and Collections - Center */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            {/* Search Box */}
            <div className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products and collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
                  className="pl-10 pr-4 py-2 border-none bg-white focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="w-6 h-6">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result, index) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          to={result.type === 'product' ? `/product/${result.id}` : `/collections/${result.id}`}
                          onClick={() => handleSearchResultClick(result)}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 mr-3">
                            {result.type === 'product' && result.images && result.images[0] ? (
                              <img
                                src={result.images[0]}
                                alt={result.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {result.name}
                              </p>
                              <p className={`ml-2 px-2 py-1 text-xs rounded-full ${result.type === 'product'
                                ? 'bg-blue-100 text-emerald-950'
                                : 'bg-green-100 text-green-800'
                                }`}>
                                {result.type === 'product' ? 'Product' : 'Collection'}
                              </p>
                            </div>
                            {result.type === 'product' && result.price && (
                              <p className="text-sm text-gray-500">
                                ${parseFloat(result.price).toFixed(2)}
                              </p>
                            )}
                            {result.type === 'collection' && result.description && (
                              <p className="text-sm text-gray-500 truncate">
                                {result.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Collections Dropdown */}
            {/* <Select value={selectedCollection} onValueChange={handleCollectionChange}>
              <SelectTrigger className="w-32 bg-white text-black border-none">
                <SelectValue placeholder={loading ? "Loading..." : "Collections"} />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                    <AvatarFallback className="bg-emerald-950 text-white text-sm font-medium">
                      {getInitials(user?.full_name || user?.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                  {user?.full_name || user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-orders" className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products and collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Mobile Search Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="py-2">
                    {searchResults.map((result, index) => (
                      <Link
                        key={`mobile-${result.type}-${result.id}`}
                        to={result.type === 'product' ? `/product/${result.id}` : `/collections/${result.id}`}
                        onClick={() => {
                          handleSearchResultClick(result)
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mr-3">
                          {result.type === 'product' && result.images && result.images[0] ? (
                            <img
                              src={result.images[0]}
                              alt={result.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {result.name}
                            </p>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${result.type === 'product'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                              }`}>
                              {result.type === 'product' ? 'Product' : 'Collection'}
                            </span>
                          </div>
                          {result.type === 'product' && result.price && (
                            <p className="text-sm text-gray-500">
                              ${parseFloat(result.price).toFixed(2)}
                            </p>
                          )}
                          {result.type === 'collection' && result.description && (
                            <p className="text-sm text-gray-500 truncate">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Collections */}
            <Select value={selectedCollection} onValueChange={handleCollectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Loading..." : "Select Collection"} />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <nav className="space-y-4">
              <Link
                to="/"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                to="/collections"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collections
              </Link>
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.id}`}
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {collection.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wishlist
              </Link>
              <Link
                to="/my-orders"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Orders
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                    {getInitials(user?.full_name || user?.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">
                  {user?.full_name || user?.email}
                </span>
              </div>
              <div className="space-y-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-red-600">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close search dropdown */}
      {showSearchDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSearchDropdown(false)}
        />
      )}
    </header>
  )
}

export default Header 
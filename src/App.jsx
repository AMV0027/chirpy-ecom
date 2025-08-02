import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/layout/Layout'
import ProtectedRoute from './routing/ProtectedRoute'
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Collections from './pages/Collections/Collections'
import Cart from './pages/Cart/Cart'
import Login from './pages/Login/Login'

import Profile from './pages/Profile/Profile'
import MyOrders from './pages/MyOrders/MyOrders'
import Checkout from './pages/Checkout/Checkout'
import useAuthStore from './stores/useAuthStore'

function App() {
  const { getCurrentSession } = useAuthStore()

  useEffect(() => {
    // Initialize authentication on app load
    getCurrentSession()
  }, [getCurrentSession])

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public routes - no authentication required */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes - authentication required */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/product/:id" element={
            <ProtectedRoute>
              <Layout>
                <ProductDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/collections/:id" element={
            <ProtectedRoute>
              <Layout>
                <Collections />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Layout>
                <Cart />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute>
              <Layout>
                <MyOrders />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Layout>
                <Checkout />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App

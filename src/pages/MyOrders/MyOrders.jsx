import React, { useState } from 'react'
import useMyOrders from './useMyOrders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ArrowUpDown, Package, Clock, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react'
import LazyImage from '@/components/ui/LazyImage'
import Breadcrumb from '@/components/ui/Breadcrumb'

const MyOrders = () => {
  const {
    orders,
    loading,
    error,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    getStatusColor,
    getStatusText,
    formatDate,
    calculateTotalPrice,
    getFilterOptions,
    getSortOptions,
    refetch
  } = useMyOrders()

  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'confirmed':
        return <AlertCircle className="w-4 h-4" />
      case 'processing':
        return <Package className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading orders: {error}
            </AlertDescription>
          </Alert>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'My Orders' }
        ]}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track your order history and current orders</p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full pl-10">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilterOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {getSortOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {filter === 'all'
                    ? "You haven't placed any orders yet."
                    : `No ${filter} orders found.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Mobile View - Cards */}
                <div className="block md:hidden space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {order.products?.images?.[0] && (
                              <LazyImage
                                src={order.products.images[0]}
                                alt={order.products.name}
                                className="w-16 h-16 rounded-md object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.products?.name || 'Product not found'}
                              </p>
                              <p className="text-sm text-gray-500">
                                ₹{order.products?.price || 0}
                                {order.products?.discount > 0 && (
                                  <span className="ml-1 text-green-600">
                                    -{order.products.discount}%
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(order.order_status)}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(order.order_status)}
                              <span className="hidden sm:inline">{getStatusText(order.order_status)}</span>
                            </span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Order ID:</span>
                            <p className="font-mono">{order.id.slice(0, 8)}...</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Quantity:</span>
                            <p>{order.quantity}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <p className="font-medium">₹{calculateTotalPrice(order)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p>{formatDate(order.created_at)}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          >
                            {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                          </Button>
                        </div>

                        {/* Order Details for Mobile */}
                        {selectedOrder?.id === order.id && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Requirements:</span>
                              <p className="text-sm mt-1">{order.requirements || 'None'}</p>
                            </div>
                            {order.notes && (
                              <div>
                                <span className="text-sm font-medium text-gray-500">Notes:</span>
                                <p className="text-sm mt-1">{order.notes}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                              <p className="text-sm">{formatDate(order.updated_at)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {order.products?.images?.[0] && (
                                <LazyImage
                                  src={order.products.images[0]}
                                  alt={order.products.name}
                                  className="w-12 h-12 rounded-md object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {order.products?.name || 'Product not found'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ₹{order.products?.price || 0}
                                  {order.products?.discount > 0 && (
                                    <span className="ml-1 text-green-600">
                                      -{order.products.discount}%
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{order.quantity}</TableCell>
                          <TableCell className="font-medium">
                            ₹{calculateTotalPrice(order)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.order_status)}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(order.order_status)}
                                <span>{getStatusText(order.order_status)}</span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            >
                              {selectedOrder?.id === order.id ? 'Hide' : 'Details'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal - Desktop Only */}
        {selectedOrder && (
          <Card className="mt-6 hidden md:block">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Order Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Order ID:</span>
                      <p className="font-mono text-sm">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <Badge className={`mt-1 ${getStatusColor(selectedOrder.order_status)}`}>
                        {getStatusText(selectedOrder.order_status)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Order Date:</span>
                      <p className="text-sm">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                      <p className="text-sm">{formatDate(selectedOrder.updated_at)}</p>
                    </div>
                    {selectedOrder.requirements && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Requirements:</span>
                        <p className="text-sm mt-1">{selectedOrder.requirements}</p>
                      </div>
                    )}
                    {selectedOrder.notes && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Notes:</span>
                        <p className="text-sm mt-1">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Product Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Product Name:</span>
                      <p className="text-sm">{selectedOrder.products?.name || 'Product not found'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Quantity:</span>
                      <p className="text-sm">{selectedOrder.quantity}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Unit Price:</span>
                      <p className="text-sm">₹{selectedOrder.products?.price || 0}</p>
                    </div>
                    {selectedOrder.products?.discount > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Discount:</span>
                        <p className="text-sm text-green-600">{selectedOrder.products.discount}%</p>
                      </div>
                    )}
                    <Separator />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Total Amount:</span>
                      <p className="text-lg font-bold">₹{calculateTotalPrice(selectedOrder)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default MyOrders

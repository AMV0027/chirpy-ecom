import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertCircle, Package, CheckCircle, XCircle } from 'lucide-react'

const OrderStatusBadge = ({ status, className = '' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'confirmed':
        return 'Confirmed'
      case 'processing':
        return 'Processing'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'confirmed':
        return <AlertCircle className="w-3 h-3" />
      case 'processing':
        return <Package className="w-3 h-3" />
      case 'completed':
        return <CheckCircle className="w-3 h-3" />
      case 'cancelled':
        return <XCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  return (
    <Badge className={`${getStatusColor(status)} ${className}`}>
      <span className="flex items-center space-x-1">
        {getStatusIcon(status)}
        <span>{getStatusText(status)}</span>
      </span>
    </Badge>
  )
}

export default OrderStatusBadge 
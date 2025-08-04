// WhatsApp integration utility
export const formatWhatsAppMessage = (cartItems, user, orderId) => {
  const itemsList = cartItems.map(item => 
    `• ${item.name} - Qty: ${item.quantity} - Price: $${item.price.toFixed(2)}`
  ).join('\n')

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  const message = `🛒 *New Order Request*

*Customer:* ${user?.name || 'Guest'}
*Phone:* ${user?.phone || user?.mobile || 'Not provided'}
*Email:* ${user?.email || 'Not provided'}

*Order Items:*
${itemsList}

*Total Amount:* $${totalAmount.toFixed(2)}

*Order ID:* ${orderId}

Please contact the customer to complete the order.`

  return encodeURIComponent(message)
}

export const sendToWhatsApp = (message, phoneNumber = null) => {
  const defaultNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '917094296432'
  const targetNumber = phoneNumber || defaultNumber
  
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${message}`
  
  // Open WhatsApp in new tab
  window.open(whatsappUrl, '_blank')
  
  return whatsappUrl
}

export const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

export const formatOrderForWhatsApp = (orderData) => {
  const { cartItems, user, orderId, totalAmount } = orderData
  
  return formatWhatsAppMessage(cartItems, user, orderId)
} 
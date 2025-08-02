import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isLoading: false,

      // Add item to cart
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cartItems.find(item => item.id === product.id)
          
          if (existingItem) {
            // Update quantity if item already exists
            const updatedItems = state.cartItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
            return { cartItems: updatedItems }
          } else {
            // Add new item
            const newItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || product.image,
              quantity,
              stock_quantity: product.stock_quantity
            }
            return { cartItems: [...state.cartItems, newItem] }
          }
        })
      },

      // Remove item from cart
      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== productId)
        }))
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }

        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        }))
      },

      // Clear cart
      clearCart: () => {
        set({ cartItems: [] })
      },

      // Get cart total
      getCartTotal: () => {
        const { cartItems } = get()
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      // Get cart item count
      getCartItemCount: () => {
        const { cartItems } = get()
        return cartItems.reduce((count, item) => count + item.quantity, 0)
      },

      // Check if item is in cart
      isInCart: (productId) => {
        const { cartItems } = get()
        return cartItems.some(item => item.id === productId)
      },

      // Get item quantity in cart
      getItemQuantity: (productId) => {
        const { cartItems } = get()
        const item = cartItems.find(item => item.id === productId)
        return item ? item.quantity : 0
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

export default useCartStore 
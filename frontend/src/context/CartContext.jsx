import { createContext, useEffect, useState } from 'react'
import {
  addToCart as addToCartRequest,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../api/cartApi'
import { useAuth } from '../hooks/useAuth'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState({ items: [], totalPrice: 0 })
  const [loading, setLoading] = useState(false)

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalPrice: 0 })
      return
    }

    setLoading(true)
    try {
      const data = await fetchCart()
      setCart(data)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (watchId, quantity = 1) => {
    const data = await addToCartRequest({ watchId, quantity })
    setCart(data)
    return data
  }

  const updateItem = async (watchId, quantity) => {
    const data = await updateCartItem(watchId, { quantity })
    setCart(data)
    return data
  }

  const removeItem = async (watchId) => {
    const data = await removeCartItem(watchId)
    setCart(data)
    return data
  }

  useEffect(() => {
    refreshCart()
  }, [isAuthenticated])

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

import api from './client'

export const fetchCart = async () => {
  const { data } = await api.get('/cart')
  return data
}

export const addToCart = async (payload) => {
  const { data } = await api.post('/cart', payload)
  return data
}

export const updateCartItem = async (watchId, payload) => {
  const { data } = await api.put(`/cart/${watchId}`, payload)
  return data
}

export const removeCartItem = async (watchId) => {
  const { data } = await api.delete(`/cart/${watchId}`)
  return data
}

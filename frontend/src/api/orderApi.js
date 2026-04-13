import api from './client'

export const checkoutCart = async (payload = {}) => {
  const { data } = await api.post('/orders/checkout', payload)
  return data
}

export const fetchUpiConfig = async () => {
  const { data } = await api.get('/orders/upi-config')
  return data
}

export const fetchMyOrders = async () => {
  const { data } = await api.get('/orders/my-orders')
  return data
}

export const fetchAllOrders = async () => {
  const { data } = await api.get('/orders')
  return data
}

export const verifyOrderPayment = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/verify-payment`)
  return data
}

export const dispatchOrder = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/dispatch`)
  return data
}

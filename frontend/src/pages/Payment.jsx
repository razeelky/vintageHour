import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { checkoutCart, fetchMyOrders, fetchUpiConfig } from '../api/orderApi'
import { useCart } from '../hooks/useCart'

function Payment() {
  const { cart, refreshCart } = useCart()
  const [orders, setOrders] = useState([])
  const [upiConfig, setUpiConfig] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loadOrders = async () => {
    try {
      const data = await fetchMyOrders()
      setOrders(data)
    } catch {
      setOrders([])
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    const loadUpiConfig = async () => {
      try {
        const data = await fetchUpiConfig()
        setUpiConfig(data)
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load UPI payment details.')
      }
    }

    loadUpiConfig()
  }, [])

  useEffect(() => {
    if (!upiConfig?.upiId || !cart.totalPrice) {
      setQrCodeUrl('')
      return
    }

    const upiLink = [
      'upi://pay',
      `?pa=${encodeURIComponent(upiConfig.upiId)}`,
      `&pn=${encodeURIComponent(upiConfig.payeeName)}`,
      `&am=${encodeURIComponent(Number(cart.totalPrice).toFixed(2))}`,
      `&cu=${encodeURIComponent(upiConfig.currency || 'INR')}`,
      `&tn=${encodeURIComponent(upiConfig.note || 'Vintage Hour order')}`,
    ].join('')

    QRCode.toDataURL(upiLink, { width: 240, margin: 1 })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(''))
  }, [cart.totalPrice, upiConfig])

  const upiLink = upiConfig?.upiId && cart.totalPrice
    ? [
        'upi://pay',
        `?pa=${encodeURIComponent(upiConfig.upiId)}`,
        `&pn=${encodeURIComponent(upiConfig.payeeName)}`,
        `&am=${encodeURIComponent(Number(cart.totalPrice).toFixed(2))}`,
        `&cu=${encodeURIComponent(upiConfig.currency || 'INR')}`,
        `&tn=${encodeURIComponent(upiConfig.note || 'Vintage Hour order')}`,
      ].join('')
    : ''

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await checkoutCart({ paymentReference })
      setMessage('UPI payment submitted. Your order is now pending confirmation.')
      setPaymentReference('')
      await refreshCart()
      await loadOrders()
    } catch (apiError) {
      setError(apiError.response?.data?.message || apiError.message || 'Checkout failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container py-5'>
      <h2 className='mb-4'>Payment</h2>
      <p>Cart Total: Rs. {cart.totalPrice || 0}</p>
      {upiConfig && (
        <div className='card mb-4'>
          <div className='card-body'>
            <h5 className='mb-3'>Pay by UPI</h5>
            <p className='mb-2'>UPI ID: <strong>{upiConfig.upiId}</strong></p>
            <p className='mb-3'>Payee: <strong>{upiConfig.payeeName}</strong></p>
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt='UPI payment QR code'
                style={{ width: '240px', maxWidth: '100%' }}
                className='mb-3'
              />
            )}
            <div className='d-flex flex-wrap gap-2 mb-3'>
              <a
                className='btn btn-dark'
                href={upiLink || '#'}
                onClick={(event) => {
                  if (!upiLink) {
                    event.preventDefault()
                  }
                }}
              >
                Open UPI App
              </a>
              <button
                type='button'
                className='btn btn-outline-dark'
                onClick={() => navigator.clipboard?.writeText(upiConfig.upiId)}
              >
                Copy UPI ID
              </button>
            </div>
            <label className='form-label'>UTR / Reference Number</label>
            <input
              className='form-control mb-2'
              type='text'
              placeholder='Enter transaction reference after payment'
              value={paymentReference}
              onChange={(event) => setPaymentReference(event.target.value)}
            />
            <small className='text-muted'>
              UPI payment can be started automatically, but payment confirmation is recorded after you submit the order details here.
            </small>
          </div>
        </div>
      )}
      <button
        className='btn btn-dark mb-4'
        onClick={handleCheckout}
        disabled={!cart.items.length || loading}
      >
        {loading ? 'Submitting UPI order...' : 'Submit UPI Order'}
      </button>
      {message && <div className='alert alert-success'>{message}</div>}
      {error && <div className='alert alert-danger'>{error}</div>}

      <h4>Your Orders</h4>
      {!orders.length ? (
        <p>No orders yet.</p>
      ) : (
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Reference</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.status}</td>
                  <td>Rs. {order.totalPrice}</td>
                  <td>{order.paymentStatus || 'n/a'}</td>
                  <td>{order.paymentReference || '-'}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Payment

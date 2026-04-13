import React, { useEffect, useState } from 'react'
import { fetchMyOrders } from '../api/orderApi'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders()
        setOrders(data)
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Unable to load your orders.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  return (
    <div className='container py-5'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h2 className='mb-2'>My Orders</h2>
          <p className='text-secondary mb-0'>Review your recent purchases and order status.</p>
        </div>
      </div>

      {loading && <div className='alert alert-secondary'>Loading your orders...</div>}
      {error && <div className='alert alert-danger'>{error}</div>}

      {!loading && !error && !orders.length && (
        <div className='alert alert-light border'>
          You have not placed any orders yet.
        </div>
      )}

      <div className='d-grid gap-4'>
        {orders.map((order) => (
          <section key={order._id} className='border rounded p-4 shadow-sm bg-white'>
            <div className='d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4'>
              <div>
                <h5 className='mb-1'>Order #{order._id.slice(-8).toUpperCase()}</h5>
                <p className='mb-0 text-secondary'>
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className='text-md-end'>
                <div className='fw-semibold text-uppercase'>{order.status}</div>
                <div className='text-secondary'>Total: Rs. {order.totalPrice}</div>
              </div>
            </div>

            <div className='table-responsive'>
              <table className='table align-middle mb-0'>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Brand</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={`${order._id}-${item.watch || index}`}>
                      <td>
                        <div className='d-flex align-items-center gap-3'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='rounded border'
                            style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>{item.brand}</td>
                      <td>{item.quantity}</td>
                      <td>Rs. {item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Orders

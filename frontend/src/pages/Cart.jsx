import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart()

  if (loading) {
    return <div className='container py-5'>Loading cart...</div>
  }

  return (
    <div className='container py-5'>
      <h2 className='mb-4'>Cart</h2>
      {!cart.items.length ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Watch</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.watch._id}>
                    <td>{item.watch.name}</td>
                    <td>{item.watch.brand}</td>
                    <td>Rs. {item.watch.price}</td>
                    <td style={{ maxWidth: '140px' }}>
                      <input
                        type='number'
                        min='1'
                        className='form-control'
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(item.watch._id, Number(event.target.value))
                        }
                      />
                    </td>
                    <td>Rs. {item.subtotal}</td>
                    <td>
                      <button
                        className='btn btn-outline-danger btn-sm'
                        onClick={() => removeItem(item.watch._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <h4>Total: Rs. {cart.totalPrice}</h4>
            <Link to='/payment' className='btn btn-dark'>
              Proceed to Payment
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart

import React, { useEffect, useState } from 'react'
import { dispatchOrder, fetchAllOrders, verifyOrderPayment } from '../api/orderApi'
import {
  createWatch,
  deleteWatch,
  fetchWatches,
  updateWatch,
} from '../api/watchApi'
import { audienceOptions, normalizeAudience } from '../utils/audience'
import { movementOptions, normalizeMovement } from '../utils/movement'

const initialForm = {
  name: '',
  brand: '',
  price: '',
  description: '',
  image: '',
  condition: '',
  movement: '',
  audience: '',
  galleryImages: '',
  aboutWatch: '',
  calibre: '',
  caseSize: '',
  caseShape: '',
  caseMaterial: '',
  glassMaterial: '',
  dialColor: '',
  strapMaterial: '',
  strapColor: '',
  waterResistance: '',
  countryOfOrigin: '',
  movementBrand: '',
  powerReserve: '',
  frequency: '',
  dateDisplay: '',
}

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Unable to read the selected image.'))
    reader.readAsDataURL(file)
  })

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'paid':
    case 'verified':
    case 'delivered':
      return 'admin-status-badge admin-status-badge--success'
    case 'submitted':
    case 'shipped':
      return 'admin-status-badge admin-status-badge--info'
    case 'cancelled':
    case 'failed':
      return 'admin-status-badge admin-status-badge--danger'
    default:
      return 'admin-status-badge admin-status-badge--warning'
  }
}

function Admin() {
  const [watches, setWatches] = useState([])
  const [orders, setOrders] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isDraggingImage, setIsDraggingImage] = useState(false)

  const loadData = async () => {
    const [watchData, orderData] = await Promise.all([
      fetchWatches(),
      fetchAllOrders(),
    ])
    setWatches(watchData)
    setOrders(orderData)
  }

  useEffect(() => {
    loadData().catch(() => {
      setError('Unable to load admin data.')
    })
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]:
        name === 'movement'
          ? normalizeMovement(value)
          : name === 'audience'
            ? normalizeAudience(value)
            : value,
    }))
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingId(null)
    setIsDraggingImage(false)
  }

  const updateImageValue = (image) => {
    setFormData((current) => ({
      ...current,
      image,
    }))
  }

  const handleImageFile = async (file) => {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Please choose an image file.')
    }

    const image = await readFileAsDataUrl(file)
    updateImageValue(image)
  }

  const handleImageSelect = async (event) => {
    try {
      setError('')
      await handleImageFile(event.target.files?.[0])
    } catch (fileError) {
      setError(fileError.message)
    } finally {
      event.target.value = ''
    }
  }

  const handleImageDrop = async (event) => {
    event.preventDefault()
    setIsDraggingImage(false)

    try {
      setError('')
      await handleImageFile(event.dataTransfer.files?.[0])
    } catch (fileError) {
      setError(fileError.message)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      if (editingId) {
        await updateWatch(editingId, { ...formData, price: Number(formData.price) })
        setMessage('Watch updated successfully.')
      } else {
        await createWatch({ ...formData, price: Number(formData.price) })
        setMessage('Watch created successfully.')
      }

      resetForm()
      await loadData()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to save watch.')
    }
  }

  const handleEdit = (watch) => {
    setEditingId(watch._id)
    setFormData({
      name: watch.name,
      brand: watch.brand,
      price: watch.price,
      description: watch.description,
      image: watch.image,
      condition: watch.condition,
      movement: normalizeMovement(watch.movement) || '',
      audience: normalizeAudience(watch.audience) || '',
      galleryImages: (watch.galleryImages || []).join('\n'),
      aboutWatch: watch.aboutWatch || '',
      calibre: watch.calibre || '',
      caseSize: watch.caseSize || '',
      caseShape: watch.caseShape || '',
      caseMaterial: watch.caseMaterial || '',
      glassMaterial: watch.glassMaterial || '',
      dialColor: watch.dialColor || '',
      strapMaterial: watch.strapMaterial || '',
      strapColor: watch.strapColor || '',
      waterResistance: watch.waterResistance || '',
      countryOfOrigin: watch.countryOfOrigin || '',
      movementBrand: watch.movementBrand || '',
      powerReserve: watch.powerReserve || '',
      frequency: watch.frequency || '',
      dateDisplay: watch.dateDisplay || '',
    })
  }

  const handleDelete = async (watchId) => {
    try {
      await deleteWatch(watchId)
      setMessage('Watch deleted successfully.')
      await loadData()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to delete watch.')
    }
  }

  const handleVerifyPayment = async (orderId) => {
    try {
      setMessage('')
      setError('')
      await verifyOrderPayment(orderId)
      setMessage('Order payment verified successfully.')
      await loadData()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to verify payment.')
    }
  }

  const handleDispatchOrder = async (orderId) => {
    try {
      setMessage('')
      setError('')
      await dispatchOrder(orderId)
      setMessage('Order marked as dispatched.')
      await loadData()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to dispatch order.')
    }
  }

  return (
    <div className='container py-5'>
      <h2 className='mb-4'>Admin Dashboard</h2>
      {message && <div className='alert alert-success'>{message}</div>}
      {error && <div className='alert alert-danger'>{error}</div>}

      <form className='admin-form mb-5' onSubmit={handleSubmit}>
        <div className='admin-form__section'>
          <div className='admin-form__heading'>
            <h4 className='mb-1'>Core Info</h4>
            <p className='text-secondary mb-0'>Basic watch details and storefront essentials.</p>
          </div>
          <div className='row g-3'>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='name' placeholder='Name' value={formData.name} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='brand' placeholder='Brand' value={formData.brand} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='price' type='number' placeholder='Price' value={formData.price} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='condition' placeholder='Condition' value={formData.condition} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <label className='form-label'>Movement Type</label>
              <select className='form-select' name='movement' value={formData.movement} onChange={handleChange}>
                <option value='' disabled>
                  Select movement type
                </option>
                {movementOptions.map((movement) => (
                  <option key={movement} value={movement}>
                    {movement}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-12 col-md-6'>
              <label className='form-label'>Watch Section</label>
              <select className='form-select' name='audience' value={formData.audience} onChange={handleChange}>
                <option value='' disabled>
                  Select section
                </option>
                {audienceOptions.map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-12'>
              <textarea className='form-control' name='description' rows='3' placeholder='Description' value={formData.description} onChange={handleChange} />
            </div>
            <div className='col-12'>
              <textarea className='form-control' name='aboutWatch' rows='4' placeholder='About Watch' value={formData.aboutWatch} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className='admin-form__section'>
          <div className='admin-form__heading'>
            <h4 className='mb-1'>Images</h4>
            <p className='text-secondary mb-0'>Cover image, gallery URLs, and drag-and-drop upload.</p>
          </div>
          <div className='row g-3'>
            <div className='col-12'>
              <input
                className='form-control'
                name='image'
                placeholder='Image URL'
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            <div className='col-12'>
              <textarea
                className='form-control'
                name='galleryImages'
                rows='3'
                placeholder='Additional image URLs, one per line'
                value={formData.galleryImages}
                onChange={handleChange}
              />
            </div>
            <div className='col-12'>
              <div
                className={`border rounded p-4 text-center ${isDraggingImage ? 'border-dark bg-light' : ''}`}
                onDragEnter={(event) => {
                  event.preventDefault()
                  setIsDraggingImage(true)
                }}
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDraggingImage(true)
                }}
                onDragLeave={(event) => {
                  event.preventDefault()
                  if (event.currentTarget === event.target) {
                    setIsDraggingImage(false)
                  }
                }}
                onDrop={handleImageDrop}
              >
                <p className='mb-2'>Drag and drop an image here</p>
                <p className='text-secondary mb-3'>or choose a file from your device</p>
                <input
                  className='form-control'
                  type='file'
                  accept='image/*'
                  onChange={handleImageSelect}
                />
              </div>
            </div>
            {formData.image && (
              <div className='col-12'>
                <div className='mt-1'>
                  <p className='mb-2 fw-semibold'>Image preview</p>
                  <img
                    src={formData.image}
                    alt='Watch preview'
                    className='img-fluid rounded border'
                    style={{ maxHeight: '260px', objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='admin-form__section'>
          <div className='admin-form__heading'>
            <h4 className='mb-1'>Watch Info</h4>
            <p className='text-secondary mb-0'>Movement, case, dial, strap, and reference details.</p>
          </div>
          <div className='row g-3'>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='calibre' placeholder='Calibre' value={formData.calibre} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='caseSize' placeholder='Case Size' value={formData.caseSize} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='caseShape' placeholder='Case Shape' value={formData.caseShape} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='caseMaterial' placeholder='Case Material' value={formData.caseMaterial} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='glassMaterial' placeholder='Glass Material' value={formData.glassMaterial} onChange={handleChange} />
            </div>
            <div className='col-12'>
              <input className='form-control' name='dialColor' placeholder='Dial Colour' value={formData.dialColor} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='strapMaterial' placeholder='Strap Material' value={formData.strapMaterial} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='strapColor' placeholder='Strap Colour' value={formData.strapColor} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='waterResistance' placeholder='Water Resistance' value={formData.waterResistance} onChange={handleChange} />
            </div>
            <div className='col-12'>
              <input className='form-control' name='countryOfOrigin' placeholder='Country of Origin' value={formData.countryOfOrigin} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className='admin-form__section'>
          <div className='admin-form__heading'>
            <h4 className='mb-1'>Movement Details</h4>
            <p className='text-secondary mb-0'>Technical movement specs for the product page.</p>
          </div>
          <div className='row g-3'>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='movementBrand' placeholder='Movement Brand' value={formData.movementBrand} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='powerReserve' placeholder='Power Reserve' value={formData.powerReserve} onChange={handleChange} />
            </div>
            <div className='col-12 col-md-6'>
              <input className='form-control' name='frequency' placeholder='Frequency' value={formData.frequency} onChange={handleChange} />
            </div>
            <div className='col-12'>
              <input className='form-control' name='dateDisplay' placeholder='Date' value={formData.dateDisplay} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className='col-12 d-flex flex-column flex-sm-row gap-2'>
          <button className='btn btn-dark' type='submit'>
            {editingId ? 'Update Watch' : 'Add Watch'}
          </button>
          {editingId && (
            <button className='btn btn-outline-secondary' type='button' onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h4 className='mb-3'>Manage Watches</h4>
      <div className='table-responsive mb-5'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Condition</th>
              <th>Movement</th>
              <th>Section</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {watches.map((watch) => (
              <tr key={watch._id}>
                <td>{watch.name}</td>
                <td>{watch.brand}</td>
                <td>Rs. {watch.price}</td>
                <td>{watch.condition}</td>
                <td>{watch.movement}</td>
                <td>{watch.audience}</td>
                <td className='d-flex gap-2'>
                  <button className='btn btn-sm btn-outline-dark' onClick={() => handleEdit(watch)}>
                    Edit
                  </button>
                  <button className='btn btn-sm btn-outline-danger' onClick={() => handleDelete(watch._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className='mb-3'>Orders</h4>
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Reference</th>
              <th>Total</th>
              <th>Placed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userId?.email || 'Unknown user'}</td>
                <td>
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(order.paymentStatus || 'pending')}>
                    {order.paymentStatus || 'pending'}
                  </span>
                </td>
                <td>{order.paymentReference || '-'}</td>
                <td>Rs. {order.totalPrice}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className='d-flex gap-2'>
                  {order.paymentStatus !== 'verified' && (
                    <button
                      className='btn btn-sm btn-outline-dark'
                      onClick={() => handleVerifyPayment(order._id)}
                    >
                      Mark Paid
                    </button>
                  )}
                  {order.paymentStatus === 'verified' && order.status !== 'shipped' && (
                    <button
                      className='btn btn-sm btn-outline-primary'
                      onClick={() => handleDispatchOrder(order._id)}
                    >
                      Dispatch
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Admin

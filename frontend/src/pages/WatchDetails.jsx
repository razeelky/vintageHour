import React, { useEffect, useMemo, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchWatchById, fetchWatches } from '../api/watchApi'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'

const recentlyViewedKey = 'vintageHourRecentlyViewed'

const infoSections = [
  {
    title: 'Movement',
    items: [
      ['Movement', 'movement'],
      ['Calibre', 'calibre'],
      ['Brand', 'movementBrand'],
      ['Power Reserve', 'powerReserve'],
      ['Frequency', 'frequency'],
      ['Date', 'dateDisplay'],
    ],
  },
  {
    title: 'Case',
    items: [
      ['Case Size', 'caseSize'],
      ['Case Shape', 'caseShape'],
      ['Case Material', 'caseMaterial'],
      ['Glass Material', 'glassMaterial'],
    ],
  },
  {
    title: 'Dial',
    items: [
      ['Dial Colour', 'dialColor'],
    ],
  },
  {
    title: 'Strap',
    items: [
      ['Strap Material', 'strapMaterial'],
      ['Strap Colour', 'strapColor'],
    ],
  },
  {
    title: 'Other',
    items: [
      ['Gender', 'audience'],
      ['Water Resistance', 'waterResistance'],
      ['Country of Origin', 'countryOfOrigin'],
    ],
  },
]

const readRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(recentlyViewedKey) || '[]')
  } catch {
    return []
  }
}

function WatchDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [watch, setWatch] = useState(null)
  const [allWatches, setAllWatches] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [activeSpecTab, setActiveSpecTab] = useState('full-specification')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadWatch = async () => {
      setLoading(true)
      setError('')

      try {
        const [watchData, watchesData] = await Promise.all([
          fetchWatchById(id),
          fetchWatches(),
        ])

        setActiveSpecTab('full-specification')
        setWatch(watchData)
        setAllWatches(watchesData)

        const recentIds = [watchData._id, ...readRecentlyViewed().filter((itemId) => itemId !== watchData._id)].slice(0, 8)
        localStorage.setItem(recentlyViewedKey, JSON.stringify(recentIds))
        setRecentlyViewed(watchesData.filter((item) => recentIds.includes(item._id) && item._id !== watchData._id))

        const images = [watchData.image, ...(watchData.galleryImages || [])].filter(Boolean)
        setSelectedImage(images[0] || '')
      } catch {
        setError('Unable to load this watch right now.')
      } finally {
        setLoading(false)
      }
    }

    loadWatch()
  }, [id])

  const handleAddToCart = async () => {
    if (!watch) {
      return
    }

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    await addItem(watch._id, 1)
    navigate('/cart')
  }

  const imageGallery = useMemo(
    () => (watch ? [watch.image, ...(watch.galleryImages || [])].filter(Boolean) : []),
    [watch]
  )

  const similarWatches = useMemo(() => {
    if (!watch) {
      return []
    }

    return allWatches
      .filter((item) => item._id !== watch._id)
      .sort((left, right) => {
        const leftScore =
          Number(left.brand === watch.brand) +
          Number(left.movement === watch.movement) +
          Number(left.audience === watch.audience)
        const rightScore =
          Number(right.brand === watch.brand) +
          Number(right.movement === watch.movement) +
          Number(right.audience === watch.audience)

        return rightScore - leftScore
      })
      .slice(0, 4)
  }, [allWatches, watch])

  if (loading) {
    return <div className='container py-5'>Loading watch details...</div>
  }

  if (error || !watch) {
    return <div className='container py-5 text-danger'>{error || 'Watch not found.'}</div>
  }

  return (
    <div className='watch-details-page py-5'>
      <div className='container'>
      <div className='row g-5 align-items-start mb-5'>
        <div className='col-12 col-lg-6'>
          <div className='watch-details__image-shell mb-3'>
            <img
              src={selectedImage || watch.image}
              alt={watch.name}
              className='w-100 watch-details__hero-image'
            />
          </div>
          {imageGallery.length > 1 && (
            <div className='row g-2'>
              {imageGallery.map((image, index) => (
                <div key={`${image}-${index}`} className='col-3 col-sm-3'>
                  <button
                    type='button'
                    className={`watch-details__thumb-button w-100 overflow-hidden ${selectedImage === image ? 'is-active' : ''}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${watch.name} ${index + 1}`}
                      className='w-100 watch-details__thumb'
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='col-12 col-lg-6'>
          <div className='watch-details__summary'>
            <div className='watch-details__summary-top'>
              <div>
                <p className='watch-details__eyebrow mb-2'>{watch.brand}</p>
                <h1 className='mb-0 watch-details__title'>{watch.name}</h1>
              </div>
            </div>

            <div className='watch-details__summary-band'>
              <div className='watch-details__price-block'>
                <span className='watch-details__price-label'>Price</span>
                <p className='watch-details__price mb-0'>Rs. {watch.price}</p>
              </div>
              <div className='watch-details__condition-block'>
                <span className='watch-details__price-label'>Condition</span>
                <strong>{watch.condition || 'Not specified'}</strong>
              </div>
            </div>

            <p className='watch-details__description mb-0'>{watch.description}</p>

            <div className='watch-details__fact-list'>
              <div className='watch-details__fact'>
                <span>Calibre</span>
                <strong>{watch.calibre || 'Not specified'}</strong>
              </div>
              <div className='watch-details__fact'>
                <span>Case</span>
                <strong>{watch.caseMaterial || 'Not specified'}</strong>
              </div>
              <div className='watch-details__fact'>
                <span>Dial</span>
                <strong>{watch.dialColor || 'Not specified'}</strong>
              </div>
              <div className='watch-details__fact'>
                <span>Strap</span>
                <strong>{watch.strapMaterial || 'Not specified'}</strong>
              </div>
            </div>

            <div className='watch-details__purchase-panel'>
              <button className='btn btn-dark btn-lg px-4 watch-details__cta' onClick={handleAddToCart}>
                Add to Cart
              </button>
              <p className='watch-details__purchase-note mb-0'>
                A considered addition for collectors who value provenance, condition, and detail.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className='watch-details__specifications mb-5'>
        <div className='watch-details__spec-tabs'>
          <button
            type='button'
            className={`watch-details__spec-tab ${activeSpecTab === 'full-specification' ? 'is-active' : ''}`}
            onClick={() => setActiveSpecTab('full-specification')}
          >
            Full Specification
          </button>
          <button
            type='button'
            className={`watch-details__spec-tab ${activeSpecTab === 'about-watch' ? 'is-active' : ''}`}
            onClick={() => setActiveSpecTab('about-watch')}
          >
            About Watch
          </button>
          <button
            type='button'
            className={`watch-details__spec-tab ${activeSpecTab === 'movement' ? 'is-active' : ''}`}
            onClick={() => setActiveSpecTab('movement')}
          >
            Movement
          </button>
        </div>

        {activeSpecTab === 'full-specification' && (
          <>
            <div className='watch-details__spec-summary'>
              <div className='watch-details__spec-summary-item'>
                <span>Brand</span>
                <strong>{watch.brand || 'Not specified'}</strong>
              </div>
              <div className='watch-details__spec-summary-item'>
                <span>Collection</span>
                <strong>{watch.audience || 'Vintage Hour'}</strong>
              </div>
              <div className='watch-details__spec-summary-item'>
                <span>Series</span>
                <strong>{watch.movement || 'Not specified'}</strong>
              </div>
              <div className='watch-details__spec-summary-item'>
                <span>Model No</span>
                <strong>{watch.ean || watch._id?.slice(-8) || 'Not specified'}</strong>
              </div>
            </div>
            <div className='row g-0'>
              {infoSections.map((section) => (
                <div key={section.title} className='col-12 col-md-6 col-xl'>
                  <div className='watch-details__spec-column h-100'>
                    <h4 className='watch-details__spec-column-title'>{section.title}</h4>
                    <div className='watch-details__spec-list'>
                      {section.items.map(([label, key]) => (
                        <div key={label} className='watch-details__spec-item'>
                          <span>{label}</span>
                          <strong>{watch[key] || 'Not specified'}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSpecTab === 'about-watch' && (
          <div className='watch-details__spec-panel'>
            <div className='watch-details__spec-panel-inner'>
              <p className='watch-details__section-kicker mb-2'>About Watch</p>
              <h3 className='mb-3'>{watch.name}</h3>
              <p className='mb-0 watch-details__spec-copy'>
                {watch.aboutWatch || 'No additional watch details have been added yet.'}
              </p>
            </div>
          </div>
        )}

        {activeSpecTab === 'movement' && (
          <div className='watch-details__spec-panel'>
            <div className='watch-details__spec-panel-inner'>
              <p className='watch-details__section-kicker mb-2'>Movement Details</p>
              <div className='watch-details__spec-list'>
                {infoSections[0].items.map(([label, key]) => (
                  <div key={label} className='watch-details__spec-item'>
                    <span>{label}</span>
                    <strong>{watch[key] || 'Not specified'}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className='mb-5'>
        <div className='d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4'>
          <h2 className='mb-0'>Similar Watches</h2>
          <Link to='/watches' className='watch-details__section-link'>
            View all
          </Link>
        </div>
        <div className='row g-4'>
          {similarWatches.map((item) => (
            <div key={item._id} className='col-12 col-sm-6 col-xl-3'>
              <Link to={`/watches/${item._id}`} className='text-decoration-none text-dark'>
                <Card className='h-100 shadow-sm watch-details__related-card'>
                  <Card.Img src={item.image} style={{ height: '240px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text className='mb-1'>{item.brand}</Card.Text>
                    <Card.Text className='text-secondary mb-1'>{item.movement}</Card.Text>
                    <Card.Text className='fw-semibold mb-0'>Rs. {item.price}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className='d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4'>
          <h2 className='mb-0'>Recently Viewed</h2>
          <Link to='/watches' className='watch-details__section-link'>
            Browse more
          </Link>
        </div>
        <div className='row g-4'>
          {recentlyViewed.length ? (
            recentlyViewed.map((item) => (
              <div key={item._id} className='col-12 col-sm-6 col-xl-3'>
                <Link to={`/watches/${item._id}`} className='text-decoration-none text-dark'>
                  <Card className='h-100 shadow-sm watch-details__related-card'>
                    <Card.Img src={item.image} style={{ height: '240px', objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text className='mb-1'>{item.brand}</Card.Text>
                      <Card.Text className='text-secondary mb-1'>{item.audience || 'Vintage'}</Card.Text>
                      <Card.Text className='fw-semibold mb-0'>Rs. {item.price}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            ))
          ) : (
            <div className='col-12'>
              <div className='alert alert-light border mb-0'>
                Recently viewed watches will appear here as you browse.
              </div>
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  )
}

export default WatchDetails

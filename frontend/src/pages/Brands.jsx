import React, { useEffect, useMemo, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { fetchWatches } from '../api/watchApi'

function Brands() {
  const [watches, setWatches] = useState([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadWatches = async () => {
      try {
        const data = await fetchWatches()
        setWatches(data)

        const firstBrand = Array.from(
          new Set(data.map((watch) => watch.brand).filter(Boolean))
        )[0]

        if (firstBrand) {
          setSelectedBrand(firstBrand)
        }
      } catch {
        setError('Unable to load brands.')
      } finally {
        setLoading(false)
      }
    }

    loadWatches()
  }, [])

  const brands = useMemo(
    () => Array.from(new Set(watches.map((watch) => watch.brand).filter(Boolean))),
    [watches]
  )

  const filteredWatches = useMemo(
    () => watches.filter((watch) => watch.brand === selectedBrand),
    [selectedBrand, watches]
  )

  return (
    <section className='catalog-page py-5'>
      <div className='container'>
        <div className='landing-section__header mb-5'>
          <div>
            <p className='landing-section__eyebrow'>Brands</p>
            <h2 className='landing-section__title'>Browse the catalogue by maker</h2>
          </div>
          <p className='landing-section__copy'>
            Each brand section is generated from the watches you add, giving the
            catalogue a living showroom feel as the collection evolves.
          </p>
        </div>

        {loading && <div className='alert alert-secondary'>Loading brands...</div>}
        {error && <div className='alert alert-danger'>{error}</div>}

        {!loading && !error && !brands.length && (
          <div className='catalog-empty'>No brands are available yet.</div>
        )}

        {!loading && !error && brands.length > 0 && (
          <>
          <div className='row g-3 mb-4'>
            {brands.map((brand) => {
              const count = watches.filter((watch) => watch.brand === brand).length
              const isActive = selectedBrand === brand

              return (
                <div key={brand} className='col-12 col-sm-6 col-lg-4 col-xl-3'>
                  <button
                    type='button'
                    className={`catalog-chip w-100 h-100 text-start ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    <h5 className='mb-2'>{brand}</h5>
                    <p className='mb-0'>
                      {count} watch{count === 1 ? '' : 'es'}
                    </p>
                  </button>
                </div>
              )
            })}
          </div>

          <div className='d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4'>
            <div>
              <h4 className='mb-1'>{selectedBrand}</h4>
              <p className='text-secondary mb-0'>
                Showing {filteredWatches.length} watch{filteredWatches.length === 1 ? '' : 'es'}
              </p>
            </div>
          </div>

          <div className='row g-4'>
            {filteredWatches.map((watch) => (
              <div key={watch._id} className='col-12 col-sm-6 col-xl-3'>
                <Card className='store-card h-100'>
                  <Link to={`/watches/${watch._id}`} className='store-card__image-link'>
                    <Card.Img
                      variant='top'
                      src={watch.image}
                      className='store-card__image'
                    />
                  </Link>
                  <Card.Body className='store-card__body'>
                    <div className='store-card__meta'>
                      <span>{watch.brand}</span>
                      <span>{watch.audience}</span>
                    </div>
                    <Card.Title className='store-card__title'>
                      <Link to={`/watches/${watch._id}`} className='store-card__title-link'>
                        {watch.name}
                      </Link>
                    </Card.Title>
                    <Card.Text className='store-card__detail'>{watch.condition}</Card.Text>
                    <Card.Text className='store-card__detail'>{watch.movement}</Card.Text>
                    <Card.Text className='store-card__price'>Rs. {watch.price}</Card.Text>
                    <Card.Text className='store-card__excerpt'>{watch.description}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </section>
  )
}

export default Brands

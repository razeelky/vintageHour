import React, { useEffect, useMemo, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { fetchWatches } from '../api/watchApi'
import { movementOptions } from '../utils/movement'

function Movements() {
  const [watches, setWatches] = useState([])
  const [selectedMovement, setSelectedMovement] = useState(movementOptions[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadWatches = async () => {
      try {
        const data = await fetchWatches()
        setWatches(data)
      } catch {
        setError('Unable to load movement categories.')
      } finally {
        setLoading(false)
      }
    }

    loadWatches()
  }, [])

  useEffect(() => {
    if (!watches.length) {
      return
    }

    const selectedMovementExists = watches.some(
      (watch) => watch.movement === selectedMovement
    )

    if (selectedMovementExists) {
      return
    }

    const firstMovementWithWatches = movementOptions.find((movement) =>
      watches.some((watch) => watch.movement === movement)
    )

    if (firstMovementWithWatches) {
      setSelectedMovement(firstMovementWithWatches)
    }
  }, [selectedMovement, watches])

  const movementCounts = useMemo(
    () =>
      movementOptions.reduce((counts, movement) => {
        counts[movement] = watches.filter((watch) => watch.movement === movement).length
        return counts
      }, {}),
    [watches]
  )

  const filteredWatches = useMemo(
    () => watches.filter((watch) => watch.movement === selectedMovement),
    [selectedMovement, watches]
  )

  return (
    <section className='catalog-page py-5'>
      <div className='container'>
        <div className='landing-section__header mb-5'>
          <div>
            <p className='landing-section__eyebrow'>Movement</p>
            <h2 className='landing-section__title'>Browse by what drives the watch</h2>
          </div>
          <p className='landing-section__copy'>
            Filter the collection by movement character, from everyday quartz precision
            to the tactile appeal of automatic and mechanical watches.
          </p>
        </div>

        <div className='row g-3 mb-4'>
        {movementOptions.map((movement) => {
          const isActive = selectedMovement === movement

          return (
            <div key={movement} className='col-12 col-sm-6 col-lg-3'>
              <button
                type='button'
                className={`catalog-chip w-100 h-100 text-start ${isActive ? 'is-active' : ''}`}
                onClick={() => setSelectedMovement(movement)}
              >
                <div className='d-flex justify-content-between align-items-start gap-3'>
                  <div>
                    <h5 className='mb-2'>{movement}</h5>
                    <p className='mb-0'>
                      {movementCounts[movement] || 0} watches
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )
        })}
        </div>

        {loading && <div className='alert alert-secondary'>Loading movements...</div>}
        {error && <div className='alert alert-danger'>{error}</div>}

        {!loading && !error && (
          <>
          <div className='d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4'>
            <div>
              <h4 className='mb-1'>{selectedMovement}</h4>
              <p className='text-secondary mb-0'>
                Showing {filteredWatches.length} watch{filteredWatches.length === 1 ? '' : 'es'}
              </p>
            </div>
          </div>

          {!filteredWatches.length ? (
            <div className='catalog-empty'>
              No watches are available in this movement category yet.
            </div>
          ) : (
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
          )}
        </>
      )}
      </div>
    </section>
  )
}

export default Movements

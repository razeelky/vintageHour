import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchWatches } from '../api/watchApi'
import { audienceOptions, getAudienceSearchTerms } from '../utils/audience'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { getMovementSearchTerms, getSearchNeedles, movementOptions } from '../utils/movement'

const movementFilterOptions = ['All Movements', ...movementOptions]
const audienceFilterOptions = ['All Sections', ...audienceOptions]

function Watches() {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [movementFilter, setMovementFilter] = useState('All Movements')
  const [audienceFilter, setAudienceFilter] = useState('All Sections')
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const nextSearchTerm = searchParams.get('q') || ''
    setSearchTerm(nextSearchTerm)
  }, [searchParams])

  useEffect(() => {
    const loadWatches = async () => {
      try {
        const data = await fetchWatches()
        setWatches(data)
      } catch {
        setError('Unable to load watches.')
      } finally {
        setLoading(false)
      }
    }

    loadWatches()
  }, [])

  const handleAddToCart = async (watchId) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    await addItem(watchId, 1)
    navigate('/cart')
  }

  const handleSearchChange = (event) => {
    const nextValue = event.target.value
    setSearchTerm(nextValue)

    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextValue.trim()) {
      nextSearchParams.set('q', nextValue.trim())
    } else {
      nextSearchParams.delete('q')
    }

    setSearchParams(nextSearchParams, { replace: true })
  }

  const searchNeedles = getSearchNeedles(searchTerm)

  const filteredWatches = watches.filter((watch) => {
    const matchesSearch =
      !searchNeedles.length ||
      [watch.name, watch.brand]
        .filter(Boolean)
        .some((value) =>
          searchNeedles.some((needle) => value.toLowerCase().includes(needle))
        ) ||
      getMovementSearchTerms(watch.movement).some((term) =>
        searchNeedles.some((needle) => term.includes(needle))
      ) ||
      getAudienceSearchTerms(watch.audience).some((term) =>
        searchNeedles.some((needle) => term.includes(needle))
      )

    const matchesMovement =
      movementFilter === 'All Movements' || watch.movement === movementFilter
    const matchesAudience =
      audienceFilter === 'All Sections' || watch.audience === audienceFilter

    return matchesSearch && matchesMovement && matchesAudience
  })

  const searchSuggestions = Array.from(
    new Set(
      watches
        .flatMap((watch) => [watch.name, watch.brand, watch.movement, watch.audience])
        .filter(Boolean)
    )
  ).slice(0, 20)

  return (
    <>
      <section className='catalog-hero'>
        <video
          src='https://www.pexels.com/download/video/4601287/'
          autoPlay
          loop
          muted
          className='catalog-hero__video'
        ></video>
        <div className='catalog-hero__overlay'>
          <div className='container catalog-hero__content'>
            <p className='catalog-hero__eyebrow'>Vintage Watch Catalogue</p>
            <h1 className='catalog-hero__title'>A sharper edit of vintage watches worth wearing.</h1>
            <p className='catalog-hero__copy'>
              Explore a considered collection of vintage pieces across automatic,
              quartz, and mechanical movements, with refined proportions, honest
              condition, and enduring design from respected makers.
            </p>
            <div className='catalog-hero__pills'>
              <span>Omega</span>
              <span>Longines</span>
              <span>Seiko</span>
              <span>Zenith</span>
            </div>
          </div>
        </div>
      </section>

      <section className='catalog-page'>
        <div className='container pb-5'>
          <div className='catalog-toolbar'>
            <div className='row g-3 align-items-end'>
              <div className='col-12 col-lg-8'>
                <label className='form-label catalog-toolbar__label'>Search by name, brand, movement, or section</label>
                <input
                  className='form-control catalog-toolbar__input'
                  type='text'
                  list='watch-search-suggestions'
                  placeholder='Search watches'
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <datalist id='watch-search-suggestions'>
                  {searchSuggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
              </div>
              <div className='col-12 col-md-6 col-lg-2'>
                <label className='form-label catalog-toolbar__label'>Movement</label>
                <select
                  className='form-select catalog-toolbar__select'
                  value={movementFilter}
                  onChange={(event) => setMovementFilter(event.target.value)}
                >
                  {movementFilterOptions.map((movement) => (
                    <option key={movement} value={movement}>
                      {movement}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-12 col-md-6 col-lg-2'>
                <label className='form-label catalog-toolbar__label'>Section</label>
                <select
                  className='form-select catalog-toolbar__select'
                  value={audienceFilter}
                  onChange={(event) => setAudienceFilter(event.target.value)}
                >
                  {audienceFilterOptions.map((audience) => (
                    <option key={audience} value={audience}>
                      {audience}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {!loading && !error && (
              <div className='catalog-toolbar__footer'>
                <p className='mb-0'>
                  Showing {filteredWatches.length} of {watches.length} watches
                </p>
              </div>
            )}
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
                    <button className='btn btn-dark w-100 store-card__button mt-auto' onClick={() => handleAddToCart(watch._id)}>
                      Add to Cart
                    </button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>

          {!loading && !error && !filteredWatches.length && (
            <div className='catalog-empty'>
              <p className='mb-2'>No watches match your filters right now.</p>
              <span>Try a different brand, movement, or section.</span>
            </div>
          )}
          {loading && <p className='text-center py-5'>Loading watches...</p>}
          {error && <p className='text-center text-danger py-4'>{error}</p>}
        </div>
      </section>
    </>
  )
}

export default Watches

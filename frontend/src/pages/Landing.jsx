import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate } from 'react-router-dom'
import { fetchWatches } from '../api/watchApi'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'

function Landing() {
  const [watches, setWatches] = useState([])
  const [error, setError] = useState('')
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

const fetchWatches = async () => {
  const res = await axios.get(
    "https://vintagehour.onrender.com/api/watches"
  );
  console.log(res.data);
};

  useEffect(() => {
    const loadWatches = async () => {
      try {
        const data = await fetchWatches({ latest: true, limit: 4 })
        setWatches(data)
      } catch {
        setError('Unable to load new arrivals right now.')
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

  return (
    <>
      <section className='landing-hero'>
        <div className='landing-hero__backdrop'>
          <div className='container landing-hero__content'>
            <div className='landing-hero__panel'>
              <p className='landing-hero__eyebrow'>Curated Vintage Timepieces</p>
              <h1 className='landing-hero__title'>Watches With History, Chosen With Taste.</h1>
              <p className='landing-hero__copy'>
                Vintage Hour brings together serviced, authentic watches from the
                1960s through the 1990s with a collector-first eye for proportion,
                patina, and mechanical character. Every piece is selected to feel
                timeless on the wrist and credible in a serious collection.
              </p>
              <div className='landing-hero__actions'>
                <Link to='/watches' className='btn btn-dark btn-lg px-4'>
                  Explore Watches
                </Link>
                <Link to='/brands' className='landing-hero__link'>
                  Browse by Brand
                </Link>
              </div>
              <div className='landing-hero__metrics'>
                <div>
                  <span>1960s-1990s</span>
                  <strong>Vintage focus</strong>
                </div>
                <div>
                  <span>12 months</span>
                  <strong>Warranty support</strong>
                </div>
                <div>
                  <span>Collector-first</span>
                  <strong>Authenticity checks</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='landing-section container py-5'>
        <div className='landing-section__header'>
          <div>
            <p className='landing-section__eyebrow'>New In Store</p>
            <h2 className='landing-section__title'>Fresh arrivals with collector appeal</h2>
          </div>
          <p className='landing-section__copy'>
            A rotating edit of recently added watches chosen for strong design,
            reliable mechanics, and everyday wearability.
          </p>
        </div>

        <div className='row g-4'>
          {watches.map((watch) => (
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
                  <Card.Text className='store-card__detail'>{watch.movement}</Card.Text>
                  <Card.Text className='store-card__price'>Rs. {watch.price}</Card.Text>
                  <button className='btn btn-dark w-100 store-card__button' onClick={() => handleAddToCart(watch._id)}>
                    Add to Cart
                  </button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {error && <p className='text-center text-danger mt-4'>{error}</p>}
      </section>

      <section className='landing-cta container pb-5'>
        <div className='landing-cta__panel'>
          <div>
            <p className='landing-section__eyebrow mb-2'>Full Collection</p>
            <h3 className='landing-cta__title'>See the complete vintage catalogue</h3>
          </div>
          <Link to='/collections' className='btn btn-outline-dark btn-lg px-4'>
            Shop All Watches
          </Link>
        </div>
      </section>
    </>
  )
}

export default Landing

import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { fetchWatches } from '../api/watchApi'

function Collections() {
  const [watches, setWatches] = useState([])

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchWatches({ limit: 6 })
        setWatches(data)
      } catch {
        setWatches([])
      }
    }

    loadCollections()
  }, [])

  return (
    <section className='catalog-page py-5'>
      <div className='container'>
        <div className='landing-section__header mb-5'>
          <div>
            <p className='landing-section__eyebrow'>Collections</p>
            <h2 className='landing-section__title'>A tighter edit of standout pieces</h2>
          </div>
          <p className='landing-section__copy'>
            A compact showcase of vintage watches selected to highlight the range,
            personality, and craftsmanship across the broader catalogue.
          </p>
        </div>
        <div className='row g-4'>
          {watches.map((watch) => (
            <div className='col-12 col-md-6 col-xl-4' key={watch._id}>
              <Card className='store-card h-100'>
                <Link to={`/watches/${watch._id}`} className='store-card__image-link'>
                  <Card.Img src={watch.image} className='store-card__image' />
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
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Collections

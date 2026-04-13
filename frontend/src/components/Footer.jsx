import React from 'react'
import { Container } from 'react-bootstrap'
import { FaEnvelope, FaInstagram, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className='site-footer'>
      <Container fluid className='site-footer__container'>
        <div className='row g-4 align-items-start'>
          <div className='col-12 col-lg-4 site-footer__brand'>
            <p className='site-footer__eyebrow'>Vintage Hour</p>
            <h4 className='site-footer__headline'>Timeless watches, restored with care.</h4>
            <p className='mb-0 site-footer__copy'>
              Discover curated vintage pieces, trusted servicing, and a collector-first
              buying experience built around authenticity and detail.
            </p>
          </div>

          <div className='col-6 col-md-4 col-lg-2'>
            <h6 className='site-footer__section-title'>Explore</h6>
            <div className='site-footer__links'>
              <Link className='site-footer__link' to='/collections'>
                Collections
              </Link>
              <Link className='site-footer__link' to='/watches'>
                All Watches
              </Link>
              <Link className='site-footer__link' to='/brands'>
                Brands
              </Link>
              <Link className='site-footer__link' to='/movement'>
                Movement
              </Link>
            </div>
          </div>

          <div className='col-6 col-md-4 col-lg-3'>
            <h6 className='site-footer__section-title'>Customer Care</h6>
            <div className='site-footer__links'>
              <Link className='site-footer__link' to='/support'>
                Support & Info
              </Link>
              <Link className='site-footer__link' to='/contact'>
                Contact
              </Link>
              <Link className='site-footer__link' to='/orders'>
                My Orders
              </Link>
              <Link className='site-footer__link' to='/cart'>
                Cart
              </Link>
            </div>
          </div>

          <div className='col-12 col-md-4 col-lg-3'>
            <h6 className='site-footer__section-title'>Contact</h6>
            <div className='site-footer__contact-list site-footer__contact'>
              <div className='site-footer__contact-item'>
                <FaMapMarkerAlt />
                <span>Kerala, India. Vintage sourcing and collector support by appointment.</span>
              </div>
              <div className='site-footer__contact-item'>
                <FaEnvelope />
                <span>gt101390@gmail.com</span>
              </div>
              <div className='site-footer__contact-item'>
                <FaPhoneAlt />
                <span>+91 7012727128</span>
              </div>
              <div className='site-footer__contact-item'>
                <FaInstagram />
                <span>@vintagehour</span>
              </div>
            </div>
          </div>
        </div>

        <div className='site-footer__bottom'>
          <p className='site-footer__bottom-note'>
            © 2026 Vintage Hour. Curated vintage timepieces for modern collectors.
          </p>
          <p className='site-footer__bottom-tagline'>
            Authenticity. Service. Legacy.
          </p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

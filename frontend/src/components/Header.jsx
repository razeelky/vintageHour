import React, { useEffect, useState } from 'react'
import { Container, Form, NavDropdown, Nav, Navbar } from 'react-bootstrap'
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const [expanded, setExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (location.pathname === '/watches') {
      setSearchTerm(searchParams.get('q') || '')
      return
    }

    setSearchTerm('')
  }, [location.pathname, searchParams])

  const handleLogout = () => {
    logout()
    setExpanded(false)
    navigate('/')
  }

  const handleNavClose = () => {
    setExpanded(false)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const trimmedSearch = searchTerm.trim()
    const nextSearchParams = new URLSearchParams()

    if (trimmedSearch) {
      nextSearchParams.set('q', trimmedSearch)
    }

    navigate({
      pathname: '/watches',
      search: nextSearchParams.toString() ? `?${nextSearchParams.toString()}` : '',
    })
    setExpanded(false)
  }

  return (
    <div>
      <Navbar
        bg='dark'
        variant='dark'
        expand='lg'
        expanded={expanded}
        onToggle={setExpanded}
        style={{ padding: '0.5rem 0', fontWeight: '600' }}
        className='site-navbar'
      >
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to='/'
            onClick={handleNavClose}
            style={{ fontFamily: 'inherit', letterSpacing: '2px', fontSize: '1.5rem' }}
          >
            VINTAGE <span className='text-danger'>HOUR</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='main-navbar-nav' />
          <Navbar.Collapse id='main-navbar-nav'>
            <Nav className='mx-auto site-navbar__links' style={{ gap: '1.2em' }}>
              <Nav.Link as={Link} to='/' onClick={handleNavClose}>
                HOME
              </Nav.Link>
              <Nav.Link as={Link} to='/collections' onClick={handleNavClose}>
                COLLECTIONS
              </Nav.Link>
              <Nav.Link as={Link} to='/watches' onClick={handleNavClose}>
                ALL WATCHES
              </Nav.Link>
              <Nav.Link as={Link} to='/support' onClick={handleNavClose}>
                SUPPORT & INFO
              </Nav.Link>
              <Nav.Link as={Link} to='/contact' onClick={handleNavClose}>
                CONTACT
              </Nav.Link>
              {user?.role === 'admin' && (
                <Nav.Link as={Link} to='/admin' onClick={handleNavClose}>
                  ADMIN
                </Nav.Link>
              )}
            </Nav>

            <Nav className='ms-auto align-items-lg-center site-navbar__actions' style={{ gap: '1em' }}>
              <Form className='site-navbar__search' onSubmit={handleSearchSubmit}>
                <Form.Control
                  type='search'
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder='Search watches'
                  aria-label='Search watches'
                  className='site-navbar__search-input'
                />
                <button type='submit' className='site-navbar__search-button' aria-label='Search'>
                  <FaSearch size={16} />
                </button>
              </Form>
              {isAuthenticated ? (
                <NavDropdown title={user?.name || 'Account'} id='account-dropdown' align='end'>
                  <NavDropdown.ItemText>{user?.email}</NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to='/orders' onClick={handleNavClose}>
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/payment' onClick={handleNavClose}>
                    Orders & Payment
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/login' onClick={handleNavClose} className='px-0'>
                  <FaUser color='#fff' size={18} />
                </Nav.Link>
              )}
              <Nav.Link as={Link} to={isAuthenticated ? '/cart' : '/login'} onClick={handleNavClose} className='px-0'>
                <FaShoppingCart color='#fff' size={18} />
                {itemCount > 0 && <span className='ms-1'>{itemCount}</span>}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default Header

import { Route, Routes } from 'react-router-dom'
import './bootstrap.min.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Omega from './Brand/Omega'
import Longines from './Brand/Longines'
import Seiko from './Brand/Seiko'
import Zenith from './Brand/Zenith'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Collections from './pages/Collections'
import Support from './pages/Support'
import Watches from './pages/Watches'
import WatchDetails from './pages/WatchDetails'
import Movements from './pages/Movements'
import Brands from './pages/Brands'
import Types from './pages/Types'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import Pnf from './pages/Pnf'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/collections' element={<Collections />} />
        <Route path='/support' element={<Support />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/omega' element={<Omega />} />
        <Route path='/longines' element={<Longines />} />
        <Route path='/seiko' element={<Seiko />} />
        <Route path='/zenith' element={<Zenith />} />
        <Route path='/watches' element={<Watches />} />
        <Route path='/watches/:id' element={<WatchDetails />} />
        <Route path='/movement' element={<Movements />} />
        <Route path='/brands' element={<Brands />} />
        <Route path='/type' element={<Types />} />
        <Route
          path='/cart'
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path='/payment'
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin'
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Pnf />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App

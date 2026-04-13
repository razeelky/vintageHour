import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await login(formData)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '400px', width: '100%' }}
        className='shadow p-4 border rounded'
      >
        <h3 className='text-center mb-4'>Login</h3>
        {error && <div className='alert alert-danger py-2'>{error}</div>}

        <div className='mb-3'>
          <label className='form-label'>Email</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='form-control'
            placeholder='Enter Your Email'
          />
        </div>

        <div className='mb-3'>
          <label className='form-label'>Password</label>
          <div className='input-group'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='form-control'
              placeholder='Enter Your Password'
            />
            <button
              type='button'
              className='btn btn-outline-secondary'
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div>
          <button type='submit' className='btn btn-dark w-100' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className='mt-3'>
          Dont have an Account? <Link to='/register'> Create one</Link>
        </p>
      </form>
    </div>
  )
}

export default Login

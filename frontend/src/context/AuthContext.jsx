import { createContext, useEffect, useState } from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '../api/authApi'
import { storageKeys } from '../api/client'

export const AuthContext = createContext(null)

const getStoredUser = () => {
  const user = localStorage.getItem(storageKeys.user)

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(storageKeys.token))
  const [user, setUser] = useState(getStoredUser())
  const [loading, setLoading] = useState(Boolean(token))

  const persistAuth = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem(storageKeys.token, nextToken)
    localStorage.setItem(storageKeys.user, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  const clearAuth = () => {
    localStorage.removeItem(storageKeys.token)
    localStorage.removeItem(storageKeys.user)
    setToken(null)
    setUser(null)
  }

  const handleLogin = async (payload) => {
    const data = await loginUser(payload)
    persistAuth(data)
    return data
  }

  const handleRegister = async (payload) => {
    const data = await registerUser(payload)
    persistAuth(data)
    return data
  }

  useEffect(() => {
    const syncUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { user: currentUser } = await fetchCurrentUser()
        localStorage.setItem(storageKeys.user, JSON.stringify(currentUser))
        setUser(currentUser)
      } catch {
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    syncUser()
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token && user),
        login: handleLogin,
        register: handleRegister,
        logout: clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

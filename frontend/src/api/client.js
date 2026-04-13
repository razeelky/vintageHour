import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api'

export const storageKeys = {
  token: 'vintageHourToken',
  user: 'vintageHourUser',
}

export const getStoredToken = () => localStorage.getItem(storageKeys.token)

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api

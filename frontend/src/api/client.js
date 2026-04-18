import axios from 'axios'
import { API_BASE_URL } from './api'

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

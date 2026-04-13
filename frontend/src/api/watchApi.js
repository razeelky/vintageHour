import api from './client'
import { normalizeAudience, normalizeAudienceWatch, normalizeAudienceWatchList } from '../utils/audience'
import { normalizeMovement, normalizeWatch, normalizeWatchList } from '../utils/movement'

const normalizeApiWatch = (watch) => normalizeAudienceWatch(normalizeWatch(watch))
const normalizeApiWatchList = (watches) =>
  normalizeAudienceWatchList(normalizeWatchList(watches))

export const fetchWatches = async (params = {}) => {
  const { data } = await api.get('/watches', { params })
  return normalizeApiWatchList(data)
}

export const fetchWatchById = async (id) => {
  const { data } = await api.get(`/watches/${id}`)
  return normalizeApiWatch(data)
}

export const createWatch = async (payload) => {
  const { data } = await api.post('/watches', {
    ...payload,
    audience: normalizeAudience(payload?.audience),
    movement: normalizeMovement(payload?.movement),
  })
  return normalizeApiWatch(data)
}

export const updateWatch = async (id, payload) => {
  const { data } = await api.put(`/watches/${id}`, {
    ...payload,
    audience: payload?.audience === undefined ? undefined : normalizeAudience(payload.audience),
    movement: payload?.movement === undefined ? undefined : normalizeMovement(payload.movement),
  })
  return normalizeApiWatch(data)
}

export const deleteWatch = async (id) => {
  const { data } = await api.delete(`/watches/${id}`)
  return data
}

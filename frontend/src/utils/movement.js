export const movementOptions = ['Automatic', 'Quartz', 'Mechanical']

const movementAliases = {
  Automatic: ['automatic', 'auto', 'self winding', 'self-winding', 'self winding automatic'],
  Quartz: ['quartz', 'quarts', 'battery', 'battery powered', 'battery-powered'],
  Mechanical: [
    'mechanical',
    'mechanic',
    'hand wound',
    'handwound',
    'hand-wound',
    'manual',
    'manual wind',
    'manual winding',
    'hand winding',
  ],
}

const normalizeKey = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

export const normalizeMovement = (movement) => {
  if (!movement || typeof movement !== 'string') {
    return ''
  }

  const normalizedMovement = normalizeKey(movement)

  for (const option of movementOptions) {
    const aliases = [option, ...(movementAliases[option] || [])]

    if (aliases.some((alias) => normalizeKey(alias) === normalizedMovement)) {
      return option
    }
  }

  return movement.trim()
}

export const normalizeWatch = (watch) => ({
  ...watch,
  movement: normalizeMovement(watch?.movement),
})

export const normalizeWatchList = (watches = []) => watches.map(normalizeWatch)

export const getMovementSearchTerms = (movement) => {
  const normalizedMovement = normalizeMovement(movement)

  if (!normalizedMovement) {
    return []
  }

  return Array.from(
    new Set(
      [normalizedMovement, ...(movementAliases[normalizedMovement] || [])].map((value) =>
        normalizeKey(value)
      )
    )
  )
}

export const getSearchNeedles = (searchTerm) => {
  const rawNeedle = normalizeKey(searchTerm || '')
  const normalizedMovement = normalizeMovement(searchTerm)
  const movementNeedle = normalizeKey(normalizedMovement)

  return Array.from(new Set([rawNeedle, movementNeedle].filter(Boolean)))
}

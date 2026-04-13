export const audienceOptions = ['Men', 'Women', 'Unisex']

const audienceAliases = {
  Men: ['men', 'mens', "men's", 'male', 'gents', "gent's"],
  Women: ['women', 'womens', "women's", 'female', 'ladies', "ladies'"],
  Unisex: ['unisex', 'all', 'everyone'],
}

const normalizeKey = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

export const normalizeAudience = (audience) => {
  if (!audience || typeof audience !== 'string') {
    return ''
  }

  const normalizedAudience = normalizeKey(audience)

  for (const option of audienceOptions) {
    const aliases = [option, ...(audienceAliases[option] || [])]

    if (aliases.some((alias) => normalizeKey(alias) === normalizedAudience)) {
      return option
    }
  }

  return audience.trim()
}

export const normalizeAudienceWatch = (watch) => ({
  ...watch,
  audience: normalizeAudience(watch?.audience),
})

export const normalizeAudienceWatchList = (watches = []) => watches.map(normalizeAudienceWatch)

export const getAudienceSearchTerms = (audience) => {
  const normalizedAudience = normalizeAudience(audience)

  if (!normalizedAudience) {
    return []
  }

  return Array.from(
    new Set(
      [normalizedAudience, ...(audienceAliases[normalizedAudience] || [])].map((value) =>
        normalizeKey(value)
      )
    )
  )
}

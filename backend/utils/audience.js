const audienceOptions = ['Men', 'Women', 'Unisex'];

const audienceAliases = {
  Men: ['men', 'mens', "men's", 'male', 'gents', "gent's"],
  Women: ['women', 'womens', "women's", 'female', 'ladies', "ladies'"],
  Unisex: ['unisex', 'all', 'everyone'],
};

const normalizeKey = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const normalizeAudience = (audience) => {
  if (!audience || typeof audience !== 'string') {
    return '';
  }

  const normalizedAudience = normalizeKey(audience);

  for (const option of audienceOptions) {
    const aliases = [option, ...(audienceAliases[option] || [])];

    if (aliases.some((alias) => normalizeKey(alias) === normalizedAudience)) {
      return option;
    }
  }

  return '';
};

const serializeWatchAudience = (watch) => {
  const normalizedAudience = normalizeAudience(watch?.audience);

  if (!normalizedAudience) {
    return watch;
  }

  return {
    ...watch,
    audience: normalizedAudience,
  };
};

module.exports = {
  audienceOptions,
  normalizeAudience,
  serializeWatchAudience,
};

const movementOptions = ['Automatic', 'Quartz', 'Mechanical'];

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
};

const normalizeKey = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const normalizeMovement = (movement) => {
  if (!movement || typeof movement !== 'string') {
    return '';
  }

  const normalizedMovement = normalizeKey(movement);

  for (const option of movementOptions) {
    const aliases = [option, ...(movementAliases[option] || [])];

    if (aliases.some((alias) => normalizeKey(alias) === normalizedMovement)) {
      return option;
    }
  }

  return '';
};

const serializeWatchMovement = (watch) => {
  const normalizedMovement = normalizeMovement(watch?.movement);

  if (!normalizedMovement) {
    return watch;
  }

  return {
    ...watch,
    movement: normalizedMovement,
  };
};

module.exports = {
  movementOptions,
  normalizeMovement,
  serializeWatchMovement,
};

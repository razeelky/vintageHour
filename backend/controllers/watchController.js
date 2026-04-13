const Watch = require('../models/Watch');
const { normalizeMovement, serializeWatchMovement } = require('../utils/movement');
const { normalizeAudience, serializeWatchAudience } = require('../utils/audience');

const serializeWatch = (watch) => serializeWatchAudience(serializeWatchMovement(watch));
const detailFields = [
  'galleryImages',
  'aboutWatch',
  'features',
  'calibre',
  'caseSize',
  'caseShape',
  'caseMaterial',
  'glassMaterial',
  'dialColor',
  'hands',
  'indexes',
  'strapMaterial',
  'strapColor',
  'ean',
  'waterResistance',
  'countryOfOrigin',
  'movementBrand',
  'movementBase',
  'powerReserve',
  'frequency',
  'dateDisplay',
  'diameter',
];

const normalizeGalleryImages = (galleryImages) => {
  if (Array.isArray(galleryImages)) {
    return galleryImages.map((image) => String(image).trim()).filter(Boolean);
  }

  if (typeof galleryImages === 'string') {
    return galleryImages
      .split('\n')
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
};

const getWatches = async (req, res, next) => {
  try {
    const { brand, latest, limit } = req.query;
    const query = brand ? { brand: new RegExp(`^${brand}$`, 'i') } : {};
    const parsedLimit = Number(limit) || (latest ? 4 : 0);

    let watchQuery = Watch.find(query).sort({ createdAt: -1 });

    if (parsedLimit > 0) {
      watchQuery = watchQuery.limit(parsedLimit);
    }

    const watches = await watchQuery.lean();
    res.json(watches.map(serializeWatch));
  } catch (error) {
    next(error);
  }
};

const getWatchById = async (req, res, next) => {
  try {
    const watch = await Watch.findById(req.params.id).lean();

    if (!watch) {
      res.status(404);
      throw new Error('Watch not found.');
    }

    res.json(serializeWatch(watch));
  } catch (error) {
    next(error);
  }
};

const createWatch = async (req, res, next) => {
  try {
    const { name, brand, price, description, image, condition, movement, audience } = req.body;
    const normalizedMovement = normalizeMovement(movement);
    const normalizedAudience = normalizeAudience(audience);

    if (!name || !brand || !price || !description || !image || !condition || !normalizedMovement || !normalizedAudience) {
      res.status(400);
      throw new Error('All watch fields are required.');
    }

    const watch = await Watch.create({
      name,
      brand,
      price,
      description,
      image,
      condition,
      movement: normalizedMovement,
      audience: normalizedAudience,
      galleryImages: normalizeGalleryImages(req.body.galleryImages),
      ...Object.fromEntries(
        detailFields
          .filter((field) => field !== 'galleryImages')
          .map((field) => [field, req.body[field] || ''])
      ),
    });

    res.status(201).json(serializeWatch(watch.toObject()));
  } catch (error) {
    next(error);
  }
};

const updateWatch = async (req, res, next) => {
  try {
    const watch = await Watch.findById(req.params.id);

    if (!watch) {
      res.status(404);
      throw new Error('Watch not found.');
    }

    const fields = [
      'name',
      'brand',
      'price',
      'description',
      'image',
      'condition',
      'movement',
      'audience',
      ...detailFields,
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'movement') {
          const normalizedMovement = normalizeMovement(req.body[field]);

          if (!normalizedMovement) {
            res.status(400);
            throw new Error('Please choose a valid movement type.');
          }

          watch[field] = normalizedMovement;
          return;
        }

        if (field === 'audience') {
          const normalizedAudience = normalizeAudience(req.body[field]);

          if (!normalizedAudience) {
            res.status(400);
            throw new Error('Please choose a valid watch section.');
          }

          watch[field] = normalizedAudience;
          return;
        }

        if (field === 'galleryImages') {
          watch[field] = normalizeGalleryImages(req.body[field]);
          return;
        }

        watch[field] = req.body[field];
      }
    });

    const updatedWatch = await watch.save();
    res.json(serializeWatch(updatedWatch.toObject()));
  } catch (error) {
    next(error);
  }
};

const deleteWatch = async (req, res, next) => {
  try {
    const watch = await Watch.findById(req.params.id);

    if (!watch) {
      res.status(404);
      throw new Error('Watch not found.');
    }

    await watch.deleteOne();
    res.json({ message: 'Watch deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch,
};

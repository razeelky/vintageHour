const mongoose = require('mongoose');
const { movementOptions, normalizeMovement } = require('../utils/movement');
const { audienceOptions, normalizeAudience } = require('../utils/audience');

const optionalTrimmedString = {
  type: String,
  trim: true,
  default: '',
};

const watchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    movement: {
      type: String,
      required: true,
      trim: true,
      set: normalizeMovement,
      enum: movementOptions,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
      set: normalizeAudience,
      enum: audienceOptions,
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    aboutWatch: optionalTrimmedString,
    features: optionalTrimmedString,
    calibre: optionalTrimmedString,
    caseSize: optionalTrimmedString,
    caseShape: optionalTrimmedString,
    caseMaterial: optionalTrimmedString,
    glassMaterial: optionalTrimmedString,
    dialColor: optionalTrimmedString,
    hands: optionalTrimmedString,
    indexes: optionalTrimmedString,
    strapMaterial: optionalTrimmedString,
    strapColor: optionalTrimmedString,
    ean: optionalTrimmedString,
    waterResistance: optionalTrimmedString,
    countryOfOrigin: optionalTrimmedString,
    movementBrand: optionalTrimmedString,
    movementBase: optionalTrimmedString,
    powerReserve: optionalTrimmedString,
    frequency: optionalTrimmedString,
    dateDisplay: optionalTrimmedString,
    diameter: optionalTrimmedString,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Watch', watchSchema);

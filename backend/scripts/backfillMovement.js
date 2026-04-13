require('dotenv').config();
const mongoose = require('mongoose');
const Watch = require('../models/Watch');
const { buildMongoConfig } = require('../config/mongo');
const { movementOptions } = require('../utils/movement');
const fallbackMovement = process.argv[2] || 'Mechanical';

if (!movementOptions.includes(fallbackMovement)) {
  console.error(
    `Invalid movement "${fallbackMovement}". Use one of: ${movementOptions.join(', ')}.`
  );
  process.exit(1);
}

const run = async () => {
  const { uri, options } = buildMongoConfig();
  await mongoose.connect(uri, options);

  const result = await Watch.updateMany(
    {
      $or: [{ movement: { $exists: false } }, { movement: null }, { movement: '' }],
    },
    { $set: { movement: fallbackMovement } }
  );

  console.log(
    JSON.stringify({
      movement: fallbackMovement,
      matched: result.matchedCount,
      updated: result.modifiedCount,
    })
  );

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

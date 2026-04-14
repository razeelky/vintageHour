require('dotenv').config();
const mongoose = require('mongoose');

const { buildMongoConfig, DEFAULT_DB_NAME } = require('../config/mongo');

const EXPECTED_PORT = '5001';

const fail = (message) => {
  console.error(`Preflight failed: ${message}`);
  process.exit(1);
};

const run = async () => {
  const nodeEnv = (process.env.NODE_ENV || '').trim().toLowerCase();
  const isProduction = nodeEnv === 'production';
  const port = String(process.env.PORT || '').trim();
  const configuredDbName = (process.env.MONGO_DB_NAME || '').trim();

  if (!isProduction && port !== EXPECTED_PORT) {
    fail(`PORT must be ${EXPECTED_PORT} for local development. Current value: ${port || '(missing)'}`);
  }

  if (!configuredDbName) {
    fail('MONGO_DB_NAME is missing.');
  }

  if (!isProduction && configuredDbName !== DEFAULT_DB_NAME) {
    fail(
      `MONGO_DB_NAME must be ${DEFAULT_DB_NAME}. Current value: ${configuredDbName || '(missing)'}`
    );
  }

  if (!(process.env.UPI_ID || '').trim()) {
    console.log('Preflight warning: UPI_ID is missing. UPI checkout will not work until it is set.');
  }

  const { uri, options, dbName } = buildMongoConfig();

  await mongoose.connect(uri, options);

  const adminDb = mongoose.connection.db.admin();
  const { databases } = await adminDb.listDatabases();
  const dbNames = databases.map((db) => db.name);

  if (dbNames.includes('vintagehour') && dbName === DEFAULT_DB_NAME) {
    console.log(
      'Preflight warning: found an extra "vintagehour" database on the cluster. The app will keep using "vintage-hour".'
    );
  }

  console.log(`Preflight passed: backend will run on port ${port} using MongoDB database ${dbName}.`);

  await mongoose.disconnect();
};

run().catch((error) => {
  fail(error.message);
});

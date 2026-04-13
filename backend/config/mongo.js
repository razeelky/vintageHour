const DEFAULT_DB_NAME = 'vintage-hour';

const buildMongoConfig = () => {
  const rawUri = (process.env.MONGO_URI || '').trim();
  const dbName = (process.env.MONGO_DB_NAME || DEFAULT_DB_NAME).trim() || DEFAULT_DB_NAME;

  if (!rawUri) {
    throw new Error('MONGO_URI is required.');
  }

  let parsedUri;

  try {
    parsedUri = new URL(rawUri);
  } catch {
    throw new Error('MONGO_URI must be a valid MongoDB connection string.');
  }

  if (!/^mongodb(\+srv)?:$/.test(parsedUri.protocol)) {
    throw new Error('MONGO_URI must start with mongodb:// or mongodb+srv://');
  }

  if (parsedUri.searchParams.has('vintagehour')) {
    parsedUri.searchParams.delete('vintagehour');
  }

  parsedUri.pathname = `/${dbName}`;

  return {
    dbName,
    uri: parsedUri.toString(),
    options: {
      dbName,
      serverSelectionTimeoutMS: 8000,
    },
  };
};

module.exports = { buildMongoConfig, DEFAULT_DB_NAME };

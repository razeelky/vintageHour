const mongoose = require('mongoose');
const { buildMongoConfig } = require('./mongo');

const connectDB = async () => {
  try {
    const { uri, options, dbName } = buildMongoConfig();
    const connection = await mongoose.connect(uri, options);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    console.log(`MongoDB database: ${dbName}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

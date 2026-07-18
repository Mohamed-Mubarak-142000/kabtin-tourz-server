const mongoose = require('mongoose');
const env = require('./env');

// Connects to MongoDB. Deliberately does NOT crash the process on failure
// during development — it logs a clear error so the rest of the API
// (and health checks) keep working while the developer fixes MONGODB_URI.
async function connectDB() {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    // eslint-disable-next-line no-console
    console.log(`[db] MongoDB connected -> ${mongoose.connection.name}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      '[db] MongoDB connection failed. The server will keep running, but any endpoint ' +
        'that touches the database will fail until this is fixed.\n' +
        `[db] Reason: ${err.message}\n` +
        '[db] Check MONGODB_URI in your .env (see .env.example) — e.g. a MongoDB Atlas ' +
        'connection string, or a locally running mongod instance.'
    );
  }

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('[db] MongoDB disconnected.');
  });
}

module.exports = connectDB;

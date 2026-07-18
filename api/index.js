const app = require('../src/app');
const connectDB = require('../src/config/db');

// Vercel reuses warm lambda instances between invocations, so cache the
// connection attempt at module scope instead of reconnecting per request.
let dbReady = null;

module.exports = async (req, res) => {
  if (!dbReady) {
    dbReady = connectDB();
  }
  await dbReady;
  return app(req, res);
};

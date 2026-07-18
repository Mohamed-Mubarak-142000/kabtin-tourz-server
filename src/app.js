const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { fail } = require('./utils/apiResponse');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header, e.g. curl/Postman/server-to-server).
      if (!origin) return callback(null, true);
      if (env.CORS_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } });
});

app.use('/api', routes);

// 404 for unknown routes
app.use((req, res) => {
  fail(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
});

// Centralized error handler — must be last.
app.use(errorHandler);

module.exports = app;

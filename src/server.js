const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

async function start() {
  // Start listening immediately — DB connection failures are logged but
  // must not prevent the HTTP server from booting (see config/db.js).
  const server = app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Kabtin Brez API listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  await connectDB();

  process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error('[server] Unhandled promise rejection:', reason);
  });

  process.on('SIGTERM', () => {
    // eslint-disable-next-line no-console
    console.log('[server] SIGTERM received, shutting down gracefully.');
    server.close(() => process.exit(0));
  });
}

start();

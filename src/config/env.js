// Centralized, validated access to environment variables.
// Loads .env once and exposes a plain object with sane defaults so the
// rest of the app never touches process.env directly.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  return value;
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(required('PORT', '5000'), 10),
  MONGODB_URI: required('MONGODB_URI', 'mongodb://localhost:27017/kabtin-brez'),
  JWT_SECRET: required('JWT_SECRET', 'dev_insecure_secret_change_me'),
  JWT_EXPIRES_IN: required('JWT_EXPIRES_IN', '7d'),
  CLOUDINARY_CLOUD_NAME: required('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: required('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: required('CLOUDINARY_API_SECRET', ''),
  CORS_ORIGINS: required(
    'CORS_ORIGINS',
    'http://localhost:3000,http://localhost:5173,http://localhost:5174,https://kabtin-tourz-client.vercel.app,https://kabtin-tourz-dashboard.vercel.app'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  ADMIN_USERNAME: required('ADMIN_USERNAME', 'admin'),
  ADMIN_PASSWORD: required('ADMIN_PASSWORD', 'ChangeMe123!'),
  PUBLIC_SITE_URL: required('PUBLIC_SITE_URL', 'https://kabtin-tourz-client.vercel.app'),
};

if (env.NODE_ENV !== 'test') {
  if (!process.env.JWT_SECRET) {
    // eslint-disable-next-line no-console
    console.warn(
      '[env] Warning: JWT_SECRET is not set in .env — using an insecure development default. Set it before deploying.'
    );
  }
  if (!process.env.MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.warn(
      '[env] Warning: MONGODB_URI is not set in .env — using local default mongodb://localhost:27017/kabtin-brez.'
    );
  }
}

module.exports = env;

const rateLimit = require('express-rate-limit');

const commonOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
};

const loginLimiter = rateLimit(commonOptions);
const leadsLimiter = rateLimit(commonOptions);

module.exports = { loginLimiter, leadsLimiter };

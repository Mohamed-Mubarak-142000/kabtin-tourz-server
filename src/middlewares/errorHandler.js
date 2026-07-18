const { fail } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Centralized error handler. Must be registered last, after all routes.
// Normalizes Mongoose validation/cast errors and JSON parse errors into
// the { success:false, error } envelope with an appropriate status code.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(`Error in ${req.method} ${req.path}`, err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).reduce((acc, e) => {
      acc[e.path] = e.message;
      return acc;
    }, {});
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return fail(res, message || 'Validation error', 422, details);
  }

  // Mongoose bad ObjectId / cast error
  if (err.name === 'CastError') {
    return fail(res, `Invalid ${err.path}: ${err.value}`, 400, {
      field: err.path,
      value: err.value,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue?.[field];
    return fail(
      res,
      `${field} already exists`,
      409,
      { field, value }
    );
  }

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return fail(res, 'Malformed JSON body', 400);
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    const message =
      err.code === 'FILE_TOO_LARGE'
        ? 'File too large'
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'Too many files'
          : err.message;
    return fail(res, message, 400);
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return fail(res, message, status);
}

module.exports = errorHandler;

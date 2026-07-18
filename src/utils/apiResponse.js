// Shared response envelope so every controller responds consistently:
// { success: boolean, data?: any, error?: string, timestamp, meta }

function success(res, data = null, status = 200, message = null) {
  const body = {
    success: true,
    timestamp: new Date().toISOString(),
    meta: {
      status: status,
      message: message || 'Request successful',
    },
  };
  if (data !== undefined) body.data = data;
  return res.status(status).json(body);
}

function fail(res, error = 'Something went wrong', status = 400, details = null) {
  const body = {
    success: false,
    error: error,
    timestamp: new Date().toISOString(),
    meta: {
      status: status,
      errorCode: getErrorCode(status),
    },
  };
  if (details) body.details = details;
  return res.status(status).json(body);
}

function getErrorCode(status) {
  const codes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_SERVER_ERROR',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE',
  };
  return codes[status] || 'ERROR';
}

module.exports = { success, fail };

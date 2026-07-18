const { verifyToken } = require('../utils/jwt');
const { fail } = require('../utils/apiResponse');

function getTokenFromHeader(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme === 'Bearer' && token) return token;
  return null;
}

// Requires a valid JWT. 401s if missing/invalid. Attaches req.admin.
function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return fail(res, 'Unauthorized: missing token', 401);
  }
  try {
    const payload = verifyToken(token);
    req.admin = payload;
    return next();
  } catch (err) {
    return fail(res, 'Unauthorized: invalid or expired token', 401);
  }
}

// Never rejects. Sets req.admin if a valid token is present, otherwise
// req.admin = null and the request continues.
function optionalAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) {
    req.admin = null;
    return next();
  }
  try {
    req.admin = verifyToken(token);
  } catch (err) {
    req.admin = null;
  }
  return next();
}

module.exports = { requireAuth, optionalAuth };

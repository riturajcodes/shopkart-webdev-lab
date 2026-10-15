// CORS for a cookie-authenticated API.
//
// CLIENT_URL may hold one or more comma-separated frontend origins, e.g.
//   CLIENT_URL=https://shopkart.onrender.com,https://www.shopkart.in
// When it is not set, any origin is reflected so the API is never blocked
// (a warning is logged in production). http://localhost:3000 is always
// allowed outside production.

const LOCAL_ORIGIN = 'http://localhost:3000';

const normalise = (origin) => origin.trim().replace(/\/+$/, '');

function getAllowedOrigins() {
  const configured = (process.env.CLIENT_URL || '')
    .split(',')
    .map(normalise)
    .filter(Boolean);

  if (configured.length === 0) return null;
  return process.env.NODE_ENV === 'production'
    ? configured
    : [...configured, LOCAL_ORIGIN];
}

const allowedOrigins = getAllowedOrigins();

if (!allowedOrigins && process.env.NODE_ENV === 'production') {
  console.warn(
    'CLIENT_URL is not set: CORS will accept requests from any origin. ' +
      'Set it to your frontend URL to lock this down.',
  );
}

function isAllowed(origin) {
  return !allowedOrigins || allowedOrigins.includes(normalise(origin));
}

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  // Same-origin, curl and server-to-server calls send no Origin header.
  if (origin && isAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }

  if (req.method === 'OPTIONS') {
    if (origin && isAllowed(origin)) {
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        req.headers['access-control-request-headers'] ||
          'Content-Type, Authorization',
      );
      res.setHeader('Access-Control-Max-Age', '86400');
    }
    return res.sendStatus(204);
  }

  return next();
}

module.exports = corsMiddleware;

const jwt = require('jsonwebtoken');

const AUTH_COOKIE = 'shopkart_token';

function generateToken(customerId) {
  return jwt.sign({ customerId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// In production the frontend and API usually live on different sites, so the
// cookie must be SameSite=None (which browsers only accept with Secure).
function baseCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  };
}

function authCookieOptions() {
  return { ...baseCookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 };
}

module.exports = { AUTH_COOKIE, generateToken, authCookieOptions, baseCookieOptions };

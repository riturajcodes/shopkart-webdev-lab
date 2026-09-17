const jwt = require('jsonwebtoken');

const AUTH_COOKIE = 'shopkart_token';

function generateToken(customerId) {
  return jwt.sign({ customerId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

module.exports = { AUTH_COOKIE, generateToken, authCookieOptions };

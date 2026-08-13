const rateLimit = require('express-rate-limit');

// Limits repeated requests to auth endpoints - without this, someone could
// script thousands of login attempts per second to brute-force a password,
// or spam signup to fill the database with junk accounts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 20, // allow 20 attempts per IP per window - generous for real users, restrictive for scripts
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false,
});

module.exports = authLimiter;

// Loads and validates environment variables once, so the rest of the app
// can just `require('./config/env')` instead of reading process.env everywhere.
require('dotenv').config();

const required = ['JWT_SECRET', 'DB_HOST', 'DB_NAME', 'DB_USER', 'GEMINI_API_KEY'];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `[env] Warning: missing environment variables: ${missing.join(', ')}. ` +
      'Some features will not work until these are set in your .env file.'
    );
  }
}

validateEnv();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
};

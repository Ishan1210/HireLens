const jwt = require('jsonwebtoken');
const env = require('../config/env');

// Protects routes by requiring a valid JWT in the Authorization header.
// Expected format: "Authorization: Bearer <token>"
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    // Attach the decoded payload to the request so downstream route handlers
    // can access req.user.id without re-verifying the token themselves.
    req.user = decoded;
    next();
  } catch (err) {
    // jwt.verify throws on expired or tampered tokens - both are just "unauthorized" to the client
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = requireAuth;

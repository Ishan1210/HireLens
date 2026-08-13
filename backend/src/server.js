const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - useful for confirming the server + deployment is alive
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'hirelens-backend',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler (routes/middleware can call next(err) to land here)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(env.port, () => {
  console.log(`HireLens backend running on port ${env.port} [${env.nodeEnv}]`);
});

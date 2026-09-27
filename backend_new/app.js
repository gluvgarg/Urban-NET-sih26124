const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const edgeRoutes = require('./routes/edgeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const busRoutes = require('./routes/busRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Configure CORS
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
  origin: clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Section 19)
app.use('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const status = isDbConnected ? 'ok' : 'degraded';

  return res.status(isDbConnected ? 200 : 503).json({
    status: status,
    database: isDbConnected ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/v1/edge', edgeRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/buses', busRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// 404 and Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

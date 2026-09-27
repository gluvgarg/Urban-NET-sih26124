const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Main Edge AI Ingestion Endpoint
router.post('/events', eventController.handleEdgeEvent);

module.exports = router;

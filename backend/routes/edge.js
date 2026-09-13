const express = require('express');
const router = express.Router();
const { handleEdgeEvent } = require('../controllers/edgeController');

router.post('/events', handleEdgeEvent);

module.exports = router;

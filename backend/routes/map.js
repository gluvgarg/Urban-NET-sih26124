const express = require('express');
const router = express.Router();
const { getMapEvents } = require('../controllers/gisController');

router.get('/events', getMapEvents);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getBuses, getBusById, getBusTelemetry } = require('../controllers/busController');

router.get('/', getBuses);
router.get('/:id', getBusById);
router.get('/:id/telemetry', getBusTelemetry);

module.exports = router;

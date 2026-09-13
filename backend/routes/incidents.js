const express = require('express');
const router = express.Router();
const { getIncidents, getIncidentById, updateIncidentStatus } = require('../controllers/incidentController');

router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.patch('/:id/status', updateIncidentStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getCurrentTraffic, getTrafficObservations, getCongestion } = require('../controllers/trafficController');

router.get('/current', getCurrentTraffic);
router.get('/observations', getTrafficObservations);
router.get('/congestion', getCongestion);

module.exports = router;

const express = require('express');
const router = express.Router();
const { 
  getAnalyticsSummary, 
  getEventsByType, 
  getEventsByDay, 
  getBusPerformance, 
  getCongestionAnalytics 
} = require('../controllers/analyticsController');

router.get('/summary', getAnalyticsSummary);
router.get('/events-by-type', getEventsByType);
router.get('/events-by-day', getEventsByDay);
router.get('/bus-performance', getBusPerformance);
router.get('/congestion', getCongestionAnalytics);

module.exports = router;

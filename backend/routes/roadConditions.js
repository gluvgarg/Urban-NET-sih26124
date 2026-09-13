const express = require('express');
const router = express.Router();
const { 
  getRoadConditions, 
  getPotholes, 
  getWaterlogging, 
  updateDefectStatus 
} = require('../controllers/roadConditionController');

router.get('/', getRoadConditions);
router.get('/potholes', getPotholes);
router.get('/waterlogging', getWaterlogging);
router.patch('/:id/status', updateDefectStatus);

module.exports = router;

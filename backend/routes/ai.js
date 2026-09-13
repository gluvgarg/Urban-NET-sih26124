const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
  analyzePothole, 
  analyzeWaterlogging, 
  analyzeInfrastructure, 
  analyzeHitAndRun, 
  generateDemoEvent 
} = require('../controllers/aiController');

router.post('/pothole/analyze', upload.single('file'), analyzePothole);
router.post('/waterlogging/analyze', upload.single('file'), analyzeWaterlogging);
router.post('/infrastructure/analyze', upload.single('file'), analyzeInfrastructure);
router.post('/hit-and-run/analyze', upload.single('file'), analyzeHitAndRun);

module.exports = router;

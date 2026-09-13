const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', (req, res) => {
  res.json({
    status: 'UP',
    platform: 'SIH 2026 Mobile Urban Intelligence Platform (PS 124)',
    aiMode: config.aiMode,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

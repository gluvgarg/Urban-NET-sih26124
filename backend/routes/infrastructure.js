const express = require('express');
const router = express.Router();
const { getInfrastructure, getFootpaths } = require('../controllers/infrastructureController');

router.get('/', getInfrastructure);
router.get('/footpaths', getFootpaths);

module.exports = router;

const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/', busController.getBuses);
router.get('/:busId', busController.getBusById);
router.post('/', busController.createBus);
router.patch('/:busId', busController.updateBus);

module.exports = router;

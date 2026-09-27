const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.patch('/:id/status', eventController.updateEventStatus);

module.exports = router;

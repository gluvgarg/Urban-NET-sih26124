const { processEdgeEvent } = require('../services/ai/aiAdapter');

function validateEdgePayload(body) {
  const errors = [];

  if (!body) {
    return ['Request body is required'];
  }

  const supportedTypes = ['POTHOLE', 'WATERLOGGING', 'FOOTPATH_DAMAGE', 'INFRASTRUCTURE', 'HIT_AND_RUN'];
  if (!body.eventType || typeof body.eventType !== 'string' || !supportedTypes.includes(body.eventType.toUpperCase())) {
    errors.push(`eventType must be one of: ${supportedTypes.join(', ')}`);
  }

  if (!body.busId || typeof body.busId !== 'string') {
    errors.push('busId is required and must be a string');
  }

  if (!body.location || typeof body.location !== 'object') {
    errors.push('location object is required containing latitude and longitude');
  } else {
    const lat = parseFloat(body.location.latitude);
    const lng = parseFloat(body.location.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('location.latitude must be a number between -90 and 90');
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('location.longitude must be a number between -180 and 180');
    }
  }

  if (!body.detection || typeof body.detection !== 'object') {
    errors.push('detection object is required containing confidence and severity');
  } else {
    const conf = parseFloat(body.detection.confidence);
    if (isNaN(conf) || conf < 0 || conf > 1) {
      errors.push('detection.confidence must be a number between 0 and 1');
    }
    const supportedSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    if (!body.detection.severity || typeof body.detection.severity !== 'string' || !supportedSeverities.includes(body.detection.severity.toUpperCase())) {
      errors.push(`detection.severity must be one of: ${supportedSeverities.join(', ')}`);
    }
  }

  return errors;
}

async function handleEdgeEvent(req, res, next) {
  try {
    const validationErrors = validateEdgePayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const result = await processEdgeEvent(req.body);

    // Broadcast via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('event:new', result.event);
      if (result.entityDetails) {
        io.emit('defect:new', result.entityDetails);
      }
      if (result.alert) {
        io.emit('alert:new', result.alert);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Edge event received successfully',
      event: result.event,
      entityDetails: result.entityDetails,
      isDuplicate: result.isDuplicate,
      alert: result.alert
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleEdgeEvent
};

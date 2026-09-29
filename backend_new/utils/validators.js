const ALLOWED_CATEGORIES = ['ROAD', 'INFRASTRUCTURE', 'SAFETY', 'TRAFFIC'];
const ALLOWED_HANDLING = ['REAL_TIME', 'PERSISTENT'];
const ALLOWED_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const ALLOWED_STATUSES = ['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'];

/**
 * Validates and normalizes Edge AI ingested event payload
 */
const validateEdgeEventPayload = (payload) => {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { isValid: false, errors: ['Payload must be a non-null object'], normalizedPayload: null };
  }

  const {
    observationId,
    busId,
    category,
    type,
    handling,
    severity,
    confidence,
    location,
    capturedAt,
    evidence,
    vehicleNumber,
    model,
    speed
  } = payload;

  if (!observationId || typeof observationId !== 'string' || !observationId.trim()) {
    errors.push('observationId is required and must be a non-empty string');
  }

  if (!busId || typeof busId !== 'string' || !busId.trim()) {
    errors.push('busId is required and must be a non-empty string');
  }

  if (!category || !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`category is required and must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  if (!type || typeof type !== 'string' || !type.trim()) {
    errors.push('type is required and must be a non-empty string');
  }

  if (!handling || !ALLOWED_HANDLING.includes(handling)) {
    errors.push(`handling is required and must be one of: ${ALLOWED_HANDLING.join(', ')}`);
  }

  if (!severity || !ALLOWED_SEVERITIES.includes(severity)) {
    errors.push(`severity is required and must be one of: ${ALLOWED_SEVERITIES.join(', ')}`);
  }

  const numericConfidence = Number(confidence);
  if (confidence === undefined || isNaN(numericConfidence) || numericConfidence < 0 || numericConfidence > 1) {
    errors.push('confidence is required and must be a number between 0 and 1');
  }

  // Location Normalization & Validation
  let geoPoint = null;
  if (!location) {
    errors.push('location is required');
  } else if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      errors.push('Invalid location latitude or longitude values out of range');
    } else {
      geoPoint = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }
  } else if (location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
    const [lng, lat] = location.coordinates.map(Number);
    if (isNaN(lng) || isNaN(lat) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      errors.push('Invalid GeoJSON coordinates in location');
    } else {
      geoPoint = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }
  } else if (Array.isArray(location) && location.length === 2) {
    const [lng, lat] = location.map(Number);
    if (isNaN(lng) || isNaN(lat) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      errors.push('Invalid array location coordinates');
    } else {
      geoPoint = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }
  } else {
    errors.push('location must be an object with latitude/longitude or valid GeoJSON Point');
  }

  // CapturedAt validation
  let parsedDate = new Date();
  if (capturedAt) {
    parsedDate = new Date(capturedAt);
    if (isNaN(parsedDate.getTime())) {
      errors.push('capturedAt must be a valid date or timestamp string');
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors, normalizedPayload: null };
  }

  const normalizedPayload = {
    observationId: observationId.trim(),
    busId: busId.trim(),
    category,
    type: type.trim().toUpperCase(),
    handling,
    severity,
    confidence: numericConfidence,
    location: geoPoint,
    capturedAt: parsedDate,
    evidence: {
      imageUrl: evidence && evidence.imageUrl ? String(evidence.imageUrl).trim() : ''
    },
    vehicleNumber:
    vehicleNumber !== undefined && vehicleNumber !== null
        ? String(vehicleNumber).trim().toUpperCase()
        : '',
    model: {
      name: model && model.name ? String(model.name).trim() : '',
      version: model && model.version ? String(model.version).trim() : ''
    },
    speed: speed !== undefined && !isNaN(Number(speed)) ? Number(speed) : undefined
  };

  return { isValid: true, errors: [], normalizedPayload };
};

module.exports = {
  validateEdgeEventPayload,
  ALLOWED_CATEGORIES,
  ALLOWED_HANDLING,
  ALLOWED_SEVERITIES,
  ALLOWED_STATUSES
};

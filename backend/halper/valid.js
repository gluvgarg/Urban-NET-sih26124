const validateAccInput = (data) => {
  const errors = [];

  if (!data.bus_id || typeof data.bus_id !== 'string') {
    errors.push("bus_id is required and must be a string");
  }
  if (!data.route_id || typeof data.route_id !== 'string') {
    errors.push("route_id is required and must be a string");
  }
  if (data.latitude === undefined || typeof data.latitude !== 'number') {
    errors.push("latitude is required and must be a number");
  }
  if (data.longitude === undefined || typeof data.longitude !== 'number') {
    errors.push("longitude is required and must be a number");
  }
  if (!data.acc_type || typeof data.acc_type !== 'string') {
    errors.push("acc_type is required and must be a string");
  }
  if (data.confidence === undefined || typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) {
    errors.push("confidence is required and must be a number between 0 and 1");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validatePotholeInput = (data) => {
  const errors = [];

  if (!data.bus_id || typeof data.bus_id !== 'string') {
    errors.push("bus_id is required and must be a string");
  }
  if (!data.route_id || typeof data.route_id !== 'string') {
    errors.push("route_id is required and must be a string");
  }
  if (data.latitude === undefined || typeof data.latitude !== 'number') {
    errors.push("latitude is required and must be a number");
  }
  if (data.longitude === undefined || typeof data.longitude !== 'number') {
    errors.push("longitude is required and must be a number");
  }
  if (!data.defect_type || typeof data.defect_type !== 'string') {
    errors.push("defect_type is required and must be a string");
  }
  if (data.number === undefined || typeof data.number !== 'number') {
    errors.push("number is required and must be a number");
  }
  if (data.confidence === undefined || typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) {
    errors.push("confidence is required and must be a number between 0 and 1");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateAccInput,
  validatePotholeInput
};

const Bus = require('../models/Bus');
const { validateEdgeEventPayload } = require('../utils/validators');
const { processEventDeduplication } = require('./deduplicationService');
const { emitEventNew, emitEventUpdated, emitBusUpdated } = require('../sockets/socket');

/**
 * Service to process Edge AI ingested event
 */
const ingestEdgeEvent = async (payload) => {
  // 1. Validate payload
  const { isValid, errors, normalizedPayload } = validateEdgeEventPayload(payload);
  if (!isValid) {
    const error = new Error(`Validation Error: ${errors.join('; ')}`);
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  // 2. Update Bus location & telemetry
  const busUpdateData = {
    location: normalizedPayload.location,
    lastSeenAt: normalizedPayload.capturedAt || new Date(),
    status: 'ONLINE'
  };

  if (normalizedPayload.speed !== undefined) {
    busUpdateData.speed = normalizedPayload.speed;
  }

  const bus = await Bus.findOneAndUpdate(
    { busId: normalizedPayload.busId },
    { $set: busUpdateData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // Emit real-time bus telemetry update
  emitBusUpdated(bus);

  // 3. Process event idempotency & deduplication
  const result = await processEventDeduplication(normalizedPayload);

  // 4. Emit Socket.IO events accordingly
  if (!result.isDuplicateObservation) {
    if (result.isNew) {
      emitEventNew(result.event);
    } else {
      emitEventUpdated(result.event);
    }
  }

  return {
    event: result.event,
    isNew: result.isNew,
    isDuplicateObservation: result.isDuplicateObservation
  };
};

module.exports = {
  ingestEdgeEvent
};

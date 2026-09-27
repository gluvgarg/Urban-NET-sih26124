const Event = require('../models/Event');

// Maximum distance in meters for geographic deduplication of persistent events
const DEDUPLICATION_RADIUS_METERS = 50;

/**
 * Service to handle event idempotency and persistent event deduplication
 */
const processEventDeduplication = async (eventData) => {
  // 1. Idempotency check using observationId
  const existingObservation = await Event.findOne({ observationId: eventData.observationId });
  if (existingObservation) {
    return {
      isDuplicateObservation: true,
      isNew: false,
      event: existingObservation
    };
  }

  // 2. REAL-TIME handling: skip spatial deduplication, always create new event
  if (eventData.handling === 'REAL_TIME') {
    const newRealTimeEvent = new Event({
      ...eventData,
      status: 'NEW',
      detectionCount: 1,
      detectedBy: [eventData.busId],
      firstDetectedAt: eventData.capturedAt || new Date(),
      lastDetectedAt: eventData.capturedAt || new Date()
    });

    await newRealTimeEvent.save();
    return {
      isDuplicateObservation: false,
      isNew: true,
      event: newRealTimeEvent
    };
  }

  // 3. PERSISTENT handling: perform geospatial search for existing unresolved event of same type
  const matchingEvent = await Event.findOne({
    type: eventData.type,
    status: { $in: ['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS'] },
    location: {
      $nearSphere: {
        $geometry: eventData.location,
        $maxDistance: DEDUPLICATION_RADIUS_METERS
      }
    }
  });

  if (matchingEvent) {
    // Persistent event deduplication match found
    matchingEvent.detectionCount += 1;

    if (!matchingEvent.detectedBy.includes(eventData.busId)) {
      matchingEvent.detectedBy.push(eventData.busId);
    }

    matchingEvent.lastDetectedAt = eventData.capturedAt || new Date();

    if (eventData.confidence > matchingEvent.confidence) {
      matchingEvent.confidence = eventData.confidence;
    }

    if (eventData.evidence && eventData.evidence.imageUrl) {
      matchingEvent.evidence = eventData.evidence;
    }

    await matchingEvent.save();

    return {
      isDuplicateObservation: false,
      isNew: false,
      event: matchingEvent
    };
  }

  // No nearby matching persistent event found: create a new Event
  const newPersistentEvent = new Event({
    ...eventData,
    status: 'NEW',
    detectionCount: 1,
    detectedBy: [eventData.busId],
    firstDetectedAt: eventData.capturedAt || new Date(),
    lastDetectedAt: eventData.capturedAt || new Date()
  });

  await newPersistentEvent.save();

  return {
    isDuplicateObservation: false,
    isNew: true,
    event: newPersistentEvent
  };
};

module.exports = {
  processEventDeduplication,
  DEDUPLICATION_RADIUS_METERS
};

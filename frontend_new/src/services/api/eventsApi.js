// eventsApi.js - REST API Client / Mock Service for Urban Net Events

import { MOCK_EVENTS } from '../../data/mockEvents';

// Local transient state for mock provider
let eventsState = [...MOCK_EVENTS];

/**
 * Fetch events matching optional filters.
 * Target backend endpoint: GET /api/v1/events
 */
export async function fetchEvents(filters = {}) {
  // Simulate standard network latency (50-150ms)
  await new Promise((resolve) => setTimeout(resolve, 80));

  let result = [...eventsState];

  if (filters.category && filters.category !== 'ALL') {
    result = result.filter((e) => e.category === filters.category);
  }
  if (filters.type && filters.type !== 'ALL') {
    result = result.filter((e) => e.type === filters.type);
  }
  if (filters.severity && filters.severity !== 'ALL') {
    result = result.filter((e) => e.severity === filters.severity);
  }
  if (filters.status && filters.status !== 'ALL') {
    result = result.filter((e) => e.status === filters.status);
  }
  if (filters.handling && filters.handling !== 'ALL') {
    result = result.filter((e) => e.handling === filters.handling);
  }
  if (filters.busId && filters.busId !== 'ALL') {
    result = result.filter((e) => e.busId === filters.busId || (e.detectedBy && e.detectedBy.includes(filters.busId)));
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.observationId.toLowerCase().includes(query) ||
        e.type.toLowerCase().includes(query) ||
        e.location.address.toLowerCase().includes(query) ||
        e.busId.toLowerCase().includes(query)
    );
  }

  // Sort by capturedAt descending by default
  return result.sort((a, b) => new Date(b.capturedAt) - new Date(a.capturedAt));
}

/**
 * Fetch single event by ID.
 * Target backend endpoint: GET /api/v1/events/:id
 */
export async function fetchEventById(id) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const event = eventsState.find((e) => e.observationId === id);
  if (!event) {
    throw new Error(`Event with ID ${id} not found`);
  }
  return { ...event };
}

/**
 * Update event status (NEW -> ACKNOWLEDGED -> IN_PROGRESS -> RESOLVED).
 * Target backend endpoint: PATCH /api/v1/events/:id/status
 */
export async function updateEventStatus(id, status) {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const index = eventsState.findIndex((e) => e.observationId === id);
  if (index === -1) {
    throw new Error(`Event with ID ${id} not found`);
  }

  eventsState[index] = {
    ...eventsState[index],
    status,
    updatedAt: new Date().toISOString()
  };

  return { ...eventsState[index] };
}

/**
 * Ingest edge events batch.
 * Target backend endpoint: POST /api/v1/edge/events/batch
 */
export async function ingestEventBatch(newEvents) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  eventsState = [...newEvents, ...eventsState];
  return { success: true, count: newEvents.length };
}

// busesApi.js - REST API Client / Mock Service for Urban Net Bus Sensing Fleet

import { MOCK_BUSES } from '../../data/mockBuses';

let busesState = [...MOCK_BUSES];

/**
 * Fetch buses matching optional filters.
 * Target backend endpoint: GET /api/v1/buses
 */
export async function fetchBuses(filters = {}) {
  await new Promise((resolve) => setTimeout(resolve, 60));

  let result = [...busesState];

  if (filters.status && filters.status !== 'ALL') {
    result = result.filter((b) => b.status === filters.status);
  }
  if (filters.edgeStatus && filters.edgeStatus !== 'ALL') {
    result = result.filter((b) => b.edgeStatus === filters.edgeStatus);
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (b) =>
        b.busId.toLowerCase().includes(query) ||
        b.registrationNo.toLowerCase().includes(query) ||
        b.routeName.toLowerCase().includes(query) ||
        b.routeId.toLowerCase().includes(query)
    );
  }

  return result;
}

/**
 * Fetch single bus by ID.
 * Target backend endpoint: GET /api/v1/buses/:id
 */
export async function fetchBusById(id) {
  await new Promise((resolve) => setTimeout(resolve, 40));
  const bus = busesState.find((b) => b.busId === id);
  if (!bus) {
    throw new Error(`Bus with ID ${id} not found`);
  }
  return { ...bus };
}

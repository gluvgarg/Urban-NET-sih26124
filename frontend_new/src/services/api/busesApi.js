// busesApi.js - REST API Client for Real Backend Bus Sensing Fleet

import { normalizeBus } from './normalizers';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://urban-net-sih26124-backend.onrender.com/api/v1';

/**
 * Fetch buses matching optional filters from backend GET /api/v1/buses
 */
export async function fetchBuses(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== 'ALL') {
    params.append('status', filters.status);
  }
  if (filters.route && filters.route !== 'ALL') {
    params.append('route', filters.route);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/buses${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch buses: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const rawBuses = json.data || [];
  let buses = rawBuses.map(normalizeBus);

  if (filters.search) {
    const query = filters.search.toLowerCase();
    buses = buses.filter(
      (b) =>
        b.busId?.toLowerCase().includes(query) ||
        b.route?.toLowerCase().includes(query)
    );
  }

  return buses;
}

/**
 * Fetch single bus by ID from backend GET /api/v1/buses/:busId
 */
export async function fetchBusById(busId) {
  const url = `${API_BASE_URL}/buses/${encodeURIComponent(busId)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch bus ${busId}: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return normalizeBus(json.data);
}

// eventsApi.js - REST API Client for Real Backend Events

import { normalizeEvent } from './normalizers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Fetch events matching optional filters from backend GET /api/v1/events
 */
export async function fetchEvents(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== 'ALL') {
    params.append('category', filters.category);
  }
  if (filters.type && filters.type !== 'ALL') {
    params.append('type', filters.type);
  }
  if (filters.severity && filters.severity !== 'ALL') {
    params.append('severity', filters.severity);
  }
  if (filters.status && filters.status !== 'ALL') {
    params.append('status', filters.status);
  }
  if (filters.handling && filters.handling !== 'ALL') {
    params.append('handling', filters.handling);
  }
  if (filters.busId && filters.busId !== 'ALL') {
    params.append('busId', filters.busId);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/events${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const rawEvents = json.data || [];
  let events = rawEvents.map(normalizeEvent);

  if (filters.search) {
    const query = filters.search.toLowerCase();
    events = events.filter(
      (e) =>
        e.observationId?.toLowerCase().includes(query) ||
        e.type?.toLowerCase().includes(query) ||
        e.busId?.toLowerCase().includes(query) ||
        e.category?.toLowerCase().includes(query)
    );
  }

  return events;
}

/**
 * Fetch single event by ID from backend GET /api/v1/events/:id
 */
export async function fetchEventById(id) {
  const url = `${API_BASE_URL}/events/${encodeURIComponent(id)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch event ${id}: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return normalizeEvent(json.data);
}

/**
 * Update event status via backend PATCH /api/v1/events/:id/status
 */
export async function updateEventStatus(id, status) {
  const url = `${API_BASE_URL}/events/${encodeURIComponent(id)}/status`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error(`Failed to update event status: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return normalizeEvent(json.data);
}

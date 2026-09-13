const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Fetch failed for ${endpoint}, falling back:`, err.message);
    return null;
  }
}

export async function fetchDashboardOverview() {
  return fetchApi('/dashboard/overview');
}

export async function fetchBuses() {
  return fetchApi('/buses');
}

export async function fetchEvents() {
  return fetchApi('/events');
}

export async function fetchRoadConditions() {
  return fetchApi('/road-conditions');
}

export async function fetchInfrastructure() {
  return fetchApi('/infrastructure');
}

export async function fetchTrafficCurrent() {
  return fetchApi('/traffic/current');
}

export async function fetchTrafficObservations() {
  return fetchApi('/traffic/observations');
}

export async function fetchTrafficCongestion() {
  return fetchApi('/traffic/congestion');
}

export async function fetchIncidents() {
  return fetchApi('/incidents');
}

export async function fetchGisMapData() {
  return fetchApi('/map/events');
}

export async function fetchAnalyticsSummary() {
  return fetchApi('/analytics/summary');
}

export async function fetchAnalyticsEventsByType() {
  return fetchApi('/analytics/events-by-type');
}

export async function fetchAnalyticsEventsByDay() {
  return fetchApi('/analytics/events-by-day');
}

export async function fetchAnalyticsBusPerformance() {
  return fetchApi('/analytics/bus-performance');
}

export async function fetchAnalyticsCongestion() {
  return fetchApi('/analytics/congestion');
}

export async function generateDemoEventApi(type, locationDetails = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/demo/generate-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...locationDetails })
    });
    return await res.json();
  } catch (err) {
    console.error('[API] Demo generation failed:', err);
    return null;
  }
}

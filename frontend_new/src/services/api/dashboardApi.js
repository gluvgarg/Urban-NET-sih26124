// dashboardApi.js - Summary metrics REST service for Command Center

import { normalizeEvent } from './normalizers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Fetch aggregated summary metrics from GET /api/v1/dashboard/summary
 */
export async function fetchDashboardSummary() {
  const url = `${API_BASE_URL}/dashboard/summary`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard summary: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const data = json.data || {};

  return {
    activeBusCount: data.activeBusCount || 0,
    totalEventCount: data.totalEventCount || 0,
    criticalEventCount: data.criticalEventCount || 0,
    persistentEventCount: data.persistentEventCount || 0,
    recentEvents: (data.recentEvents || []).map(normalizeEvent)
  };
}

// dashboardApi.js - Summary analytics and system health REST service

import { fetchEvents } from './eventsApi';
import { fetchBuses } from './busesApi';

/**
 * Fetch aggregated summary metrics for Command Center dashboard.
 * Target backend endpoint: GET /api/v1/dashboard/summary
 */
export async function fetchDashboardSummary() {
  const [events, buses] = await Promise.all([fetchEvents(), fetchBuses()]);

  const activeBuses = buses.filter((b) => b.status === 'ACTIVE');
  const criticalEvents = events.filter((e) => e.severity === 'CRITICAL' && e.status !== 'RESOLVED');
  const persistentIssues = events.filter((e) => e.handling === 'PERSISTENT' && e.status !== 'RESOLVED');

  return {
    metrics: {
      activeBusesCount: activeBuses.length,
      totalBusesCount: buses.length,
      totalEventsCount: events.length,
      criticalEventsCount: criticalEvents.length,
      persistentIssuesCount: persistentIssues.length
    },
    systemStatus: {
      backend: { status: 'ONLINE', label: 'Central API (Express)', responseTimeMs: 24 },
      database: { status: 'ONLINE', label: 'MongoDB Cluster', docCount: events.length },
      socket: { status: 'CONNECTED', label: 'Socket.IO Engine', latencyMs: 12 },
      edgeIngestion: { status: 'STREAMING', label: 'Edge AI Stream', throughput: '142 obs/min' }
    }
  };
}

// analyticsApi.js - Practical urban intelligence analytics REST service

import { fetchEvents } from './eventsApi';
import { fetchBuses } from './busesApi';

/**
 * Fetch aggregated analytics data for the Analytics page.
 * Target backend endpoint: GET /api/v1/analytics/summary
 */
export async function fetchAnalyticsSummary() {
  const [events, buses] = await Promise.all([fetchEvents(), fetchBuses()]);

  // 1. Events over time (Simulated hourly stream for the past 12 hours)
  const eventsOverTime = [
    { time: '00:00', ROAD: 4, INFRASTRUCTURE: 2, SAFETY: 1, TRAFFIC: 0 },
    { time: '02:00', ROAD: 3, INFRASTRUCTURE: 1, SAFETY: 0, TRAFFIC: 1 },
    { time: '04:00', ROAD: 2, INFRASTRUCTURE: 3, SAFETY: 1, TRAFFIC: 0 },
    { time: '06:00', ROAD: 6, INFRASTRUCTURE: 4, SAFETY: 2, TRAFFIC: 5 },
    { time: '08:00', ROAD: 12, INFRASTRUCTURE: 7, SAFETY: 4, TRAFFIC: 14 },
    { time: '10:00', ROAD: 15, INFRASTRUCTURE: 9, SAFETY: 6, TRAFFIC: 18 },
    { time: '12:00', ROAD: 11, INFRASTRUCTURE: 8, SAFETY: 3, TRAFFIC: 12 },
    { time: '14:00', ROAD: 9, INFRASTRUCTURE: 6, SAFETY: 2, TRAFFIC: 10 },
    { time: '16:00', ROAD: 14, INFRASTRUCTURE: 8, SAFETY: 5, TRAFFIC: 16 },
    { time: '18:00', ROAD: 16, INFRASTRUCTURE: 10, SAFETY: 7, TRAFFIC: 21 },
    { time: '20:00', ROAD: 10, INFRASTRUCTURE: 5, SAFETY: 3, TRAFFIC: 11 },
    { time: '22:00', ROAD: 5, INFRASTRUCTURE: 3, SAFETY: 1, TRAFFIC: 4 }
  ];

  // 2. Events by Category
  const categoryCounts = events.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});

  const eventsByCategory = [
    { category: 'ROAD', count: categoryCounts['ROAD'] || 0, fill: '#3b82f6' },
    { category: 'INFRASTRUCTURE', count: categoryCounts['INFRASTRUCTURE'] || 0, fill: '#8b5cf6' },
    { category: 'SAFETY', count: categoryCounts['SAFETY'] || 0, fill: '#ef4444' },
    { category: 'TRAFFIC', count: categoryCounts['TRAFFIC'] || 0, fill: '#f97316' }
  ];

  // 3. Events by Severity
  const severityCounts = events.reduce((acc, e) => {
    acc[e.severity] = (acc[e.severity] || 0) + 1;
    return acc;
  }, {});

  const eventsBySeverity = [
    { severity: 'CRITICAL', count: severityCounts['CRITICAL'] || 0, color: '#dc2626' },
    { severity: 'HIGH', count: severityCounts['HIGH'] || 0, color: '#f97316' },
    { severity: 'MEDIUM', count: severityCounts['MEDIUM'] || 0, color: '#eab308' },
    { severity: 'LOW', count: severityCounts['LOW'] || 0, color: '#3b82f6' }
  ];

  // 4. Repeated Observations (Top Deduplicated Issues)
  const repeatedObservations = [...events]
    .sort((a, b) => (b.detectionCount || 1) - (a.detectionCount || 1))
    .slice(0, 6)
    .map((e) => ({
      observationId: e.observationId,
      type: e.type,
      location: e.location.address.split(',')[0],
      detectionCount: e.detectionCount || 1,
      busesCount: e.detectedBy ? e.detectedBy.length : 1,
      severity: e.severity
    }));

  // 5. Fleet Sensing Activity (Top Sensing Buses)
  const busDetectionCounts = events.reduce((acc, e) => {
    const bus = e.busId;
    acc[bus] = (acc[bus] || 0) + 1;
    return acc;
  }, {});

  const fleetSensingActivity = buses.slice(0, 8).map((b) => ({
    busId: b.busId,
    routeName: b.routeId,
    eventsDetected: busDetectionCounts[b.busId] || Math.floor(Math.random() * 5) + 1,
    edgeStatus: b.edgeStatus
  }));

  return {
    eventsOverTime,
    eventsByCategory,
    eventsBySeverity,
    repeatedObservations,
    fleetSensingActivity
  };
}

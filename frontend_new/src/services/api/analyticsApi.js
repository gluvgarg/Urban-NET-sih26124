// analyticsApi.js - Sensing Analytics service using real backend data only

import { fetchEvents } from './eventsApi';
import { fetchBuses } from './busesApi';

/**
 * Fetch aggregated analytics data from real events and buses
 */
export async function fetchAnalyticsSummary() {
  const [events, buses] = await Promise.all([fetchEvents(), fetchBuses()]);

  // 1. Events over time (grouped by date/hour from actual capturedAt values)
  const timeMap = {};
  events.forEach((e) => {
    if (!e.capturedAt) return;
    const date = new Date(e.capturedAt);
    const hourStr = `${String(date.getHours()).padStart(2, '0')}:00`;
    if (!timeMap[hourStr]) {
      timeMap[hourStr] = { time: hourStr, ROAD: 0, INFRASTRUCTURE: 0, SAFETY: 0, TRAFFIC: 0 };
    }
    if (e.category && timeMap[hourStr][e.category] !== undefined) {
      timeMap[hourStr][e.category] += 1;
    }
  });

  const eventsOverTime = Object.keys(timeMap)
    .sort()
    .map((k) => timeMap[k]);

  // 2. Events by Category
  const categoryCounts = events.reduce((acc, e) => {
    if (e.category) {
      acc[e.category] = (acc[e.category] || 0) + 1;
    }
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
    if (e.severity) {
      acc[e.severity] = (acc[e.severity] || 0) + 1;
    }
    return acc;
  }, {});

  const eventsBySeverity = [
    { severity: 'CRITICAL', count: severityCounts['CRITICAL'] || 0, color: '#dc2626' },
    { severity: 'HIGH', count: severityCounts['HIGH'] || 0, color: '#f97316' },
    { severity: 'MEDIUM', count: severityCounts['MEDIUM'] || 0, color: '#eab308' },
    { severity: 'LOW', count: severityCounts['LOW'] || 0, color: '#3b82f6' }
  ];

  // 4. Repeated Observations (Top Deduplicated Issues sorted by detectionCount)
  const repeatedObservations = [...events]
    .sort((a, b) => (b.detectionCount || 1) - (a.detectionCount || 1))
    .slice(0, 10)
    .map((e) => ({
      observationId: e.observationId,
      type: e.type,
      location: e.location?.address || `${e.location?.lat?.toFixed(4) || 0}, ${e.location?.lng?.toFixed(4) || 0}`,
      detectionCount: e.detectionCount || 1,
      busesCount: Array.isArray(e.detectedBy) ? e.detectedBy.length : 1,
      severity: e.severity
    }));

  // 5. Fleet Sensing Activity (Real events captured per bus)
  const busDetectionCounts = events.reduce((acc, e) => {
    if (e.busId) {
      acc[e.busId] = (acc[e.busId] || 0) + 1;
    }
    return acc;
  }, {});

  const fleetSensingActivity = buses.map((b) => ({
    busId: b.busId,
    route: b.route,
    eventsDetected: busDetectionCounts[b.busId] || 0,
    status: b.status
  }));

  return {
    eventsOverTime,
    eventsByCategory,
    eventsBySeverity,
    repeatedObservations,
    fleetSensingActivity
  };
}

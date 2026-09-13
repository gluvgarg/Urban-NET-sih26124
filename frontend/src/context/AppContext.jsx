import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { MOCK_BUSES } from '../data/buses';
import { MOCK_EVENTS } from '../data/events';
import { MOCK_DEFECTS, ROAD_DEFECT_STATS } from '../data/defects';
import { MOCK_INFRASTRUCTURE, INFRASTRUCTURE_STATS } from '../data/infrastructure';
import { MOCK_INCIDENTS, SAFETY_STATS } from '../data/incidents';
import { CITY_CONFIG } from '../data/config';
import { 
  TRAFFIC_SUMMARY, 
  CONGESTED_ZONES, 
  HOURLY_TRAFFIC_TREND, 
  VEHICLE_CLASSIFICATION, 
  ROUTE_PERFORMANCE 
} from '../data/traffic';
import { 
  ORIGIN_DESTINATION_MATRIX, 
  ACTIONABLE_URBAN_INSIGHTS, 
  BUS_CONTRIBUTION_LEADERBOARD, 
  DEFECTS_OVER_TIME_TREND, 
  REPORT_TYPES 
} from '../data/analytics';
import { 
  fetchDashboardOverview, 
  fetchBuses, 
  fetchEvents, 
  fetchRoadConditions, 
  fetchInfrastructure, 
  fetchTrafficCurrent, 
  fetchTrafficCongestion, 
  fetchIncidents, 
  fetchAnalyticsEventsByDay, 
  fetchAnalyticsBusPerformance, 
  fetchAnalyticsCongestion, 
  fetchAnalyticsSummary,
  fetchApi, 
  generateDemoEventApi 
} from '../services/api';

const AppContext = createContext();
const BACKEND_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export const AppProvider = ({ children }) => {
  // Live State with Mock Data as initial / fallback values
  const [buses, setBuses] = useState(MOCK_BUSES);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [defects, setDefects] = useState(MOCK_DEFECTS);
  const [infrastructure, setInfrastructure] = useState(MOCK_INFRASTRUCTURE);
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  
  // Traffic & Analytics Live State
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [trafficSummary, setTrafficSummary] = useState(TRAFFIC_SUMMARY);
  const [congestedZones, setCongestedZones] = useState(CONGESTED_ZONES);
  const [hourlyTrafficTrend, setHourlyTrafficTrend] = useState(HOURLY_TRAFFIC_TREND);
  const [defectsOverTimeTrend, setDefectsOverTimeTrend] = useState(DEFECTS_OVER_TIME_TREND);
  const [busLeaderboard, setBusLeaderboard] = useState(BUS_CONTRIBUTION_LEADERBOARD);
  
  const [backendConnected, setBackendConnected] = useState(false);
  
  // Selection drawers / modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [trackingVehicleIncident, setTrackingVehicleIncident] = useState(null);

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [mapFilters, setMapFilters] = useState({
    eventType: 'ALL',
    severity: 'ALL',
    timeRange: 'TODAY',
    busId: 'ALL'
  });

  // Notifications & Toast system
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Live event ticker feed
  const [liveTickerFeed, setLiveTickerFeed] = useState([
    { id: 'TICK_01', time: '10:32:14', bus: 'BUS_17', type: 'Pothole', location: 'MG Road' },
    { id: 'TICK_02', time: '10:31:52', bus: 'BUS_12', type: 'Waterlogging', location: 'Sector 14' },
    { id: 'TICK_03', time: '10:30:41', bus: 'BUS_31', type: 'Traffic Jam', location: 'Dhaula Kuan' },
    { id: 'TICK_04', time: '10:29:17', bus: 'BUS_07', type: 'Missing Divider', location: 'NH-48' }
  ]);

  // Load all backend APIs (Primary source of truth)
  const loadBackendData = useCallback(async () => {
    try {
      const dashRes = await fetchDashboardOverview();
      if (dashRes && dashRes.summary) {
        setDashboardSummary(dashRes.summary);
        setBackendConnected(true);
      }

      const busRes = await fetchBuses();
      if (busRes && busRes.buses) {
        setBuses(busRes.buses);
        setBackendConnected(true);
      }

      const eventRes = await fetchEvents();
      if (eventRes && eventRes.events) {
        setEvents(eventRes.events);
      }

      const roadRes = await fetchRoadConditions();
      if (roadRes && roadRes.roadDefects) {
        const mergedDefects = [
          ...roadRes.roadDefects,
          ...(roadRes.waterlogging || []).map(w => ({ ...w, type: 'Waterlogging' }))
        ];
        setDefects(mergedDefects);
      }

      const infraRes = await fetchInfrastructure();
      if (infraRes && infraRes.infrastructure) {
        setInfrastructure(infraRes.infrastructure);
      }

      const incRes = await fetchIncidents();
      if (incRes && incRes.incidents) {
        setIncidents(incRes.incidents);
      }

      const trafCurrentRes = await fetchTrafficCurrent();
      if (trafCurrentRes && trafCurrentRes.summary) {
        setTrafficSummary(trafCurrentRes.summary);
      }

      const trafCongestionRes = await fetchTrafficCongestion();
      if (trafCongestionRes && trafCongestionRes.congestedZones) {
        setCongestedZones(trafCongestionRes.congestedZones);
      }

      const analyticsCongestionRes = await fetchAnalyticsCongestion();
      if (analyticsCongestionRes && analyticsCongestionRes.hourlyTrend) {
        setHourlyTrafficTrend(analyticsCongestionRes.hourlyTrend);
      }

      const analyticsEventsByDayRes = await fetchAnalyticsEventsByDay();
      if (analyticsEventsByDayRes && analyticsEventsByDayRes.weeklyTrend) {
        setDefectsOverTimeTrend(analyticsEventsByDayRes.weeklyTrend);
      }

      const analyticsBusRes = await fetchAnalyticsBusPerformance();
      if (analyticsBusRes && analyticsBusRes.leaderboard) {
        setBusLeaderboard(analyticsBusRes.leaderboard);
      }
    } catch (err) {
      console.warn('[AppContext] Could not connect to backend, running in static fallback mode.', err);
      setBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();

    // Setup Socket.IO listener for real-time updates
    const socket = io(BACKEND_URL, {
      reconnectionAttempts: 5,
      timeout: 3000
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to backend WebSocket server');
      setBackendConnected(true);
    });

    socket.on('event:new', (newEvent) => {
      console.log('[Socket.IO] New Event received in real time:', newEvent);
      
      setEvents(prev => [newEvent, ...prev]);

      const newTicker = {
        id: `TICK_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        bus: newEvent.busId || 'BUS_EDGE',
        type: newEvent.type || 'AI Detection',
        location: newEvent.location || 'City Corridor'
      };
      setLiveTickerFeed(prev => [newTicker, ...prev.slice(0, 5)]);

      // Refresh data models from backend
      loadBackendData();
    });

    socket.on('alert:new', (newAlert) => {
      console.log('[Socket.IO] New Alert received:', newAlert);
      showToast(`${newAlert.severity} ALERT: ${newAlert.message}`, newAlert.severity === 'CRITICAL' ? 'warning' : 'info');
    });

    socket.on('defect:new', () => {
      loadBackendData();
    });

    socket.on('incident:new', () => {
      loadBackendData();
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [loadBackendData, showToast]);

  // Demo event trigger helper
  const triggerDemoEvent = async (type = 'POTHOLE', details = {}) => {
    showToast(`Generating ${type} AI Detection Event...`, 'info');
    const res = await generateDemoEventApi(type, details);
    if (res && res.success) {
      showToast(`AI Event '${type}' generated successfully!`, 'success');
      loadBackendData();
    } else {
      showToast(`Failed to generate ${type} event`, 'warning');
    }
  };

  // Interactive Maintenance Workflow State Machine:
  // Detected -> Assigned -> In Progress -> Resolved
  const updateDefectStatus = async (defectId, newStatus, assignedCrew = '') => {
    // Optimistic UI update
    setDefects(prev => prev.map(d => {
      if (d.id === defectId) {
        const updated = {
          ...d,
          status: newStatus,
          assignedTo: assignedCrew || d.assignedTo || 'Municipal Maintenance Crew 1'
        };
        if (selectedDefect && selectedDefect.id === defectId) {
          setSelectedDefect(updated);
        }
        return updated;
      }
      return d;
    }));

    showToast(`Defect ${defectId} status updated to '${newStatus}'`, 'success');

    // Call backend endpoint
    await fetchApi(`/road-conditions/${defectId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, assignedTo: assignedCrew })
    });
  };

  // Incident Actions
  const acknowledgeIncident = async (incidentId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const updated = { ...inc, status: 'Acknowledged' };
        if (selectedIncident && selectedIncident.id === incidentId) setSelectedIncident(updated);
        return updated;
      }
      return inc;
    }));

    showToast(`Incident ${incidentId} acknowledged by Operator`, 'success');

    await fetchApi(`/incidents/${incidentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Acknowledged' })
    });
  };

  const escalateIncident = async (incidentId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const updated = { ...inc, status: 'Escalated to Traffic Police' };
        if (selectedIncident && selectedIncident.id === incidentId) setSelectedIncident(updated);
        return updated;
      }
      return inc;
    }));

    showToast(`Incident ${incidentId} escalated to Traffic Police Command`, 'warning');

    await fetchApi(`/incidents/${incidentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Escalated to Traffic Police' })
    });
  };

  return (
    <AppContext.Provider value={{
      cityConfig: CITY_CONFIG,
      buses,
      events,
      defects,
      infrastructure,
      incidents,
      dashboardSummary,
      trafficSummary,
      congestedZones,
      hourlyTrafficTrend,
      defectsOverTimeTrend,
      busLeaderboard,
      backendConnected,
      triggerDemoEvent,
      selectedEvent, setSelectedEvent,
      selectedBus, setSelectedBus,
      selectedDefect, setSelectedDefect,
      selectedIncident, setSelectedIncident,
      trackingVehicleIncident, setTrackingVehicleIncident,
      searchQuery, setSearchQuery,
      mapFilters, setMapFilters,
      liveTickerFeed,
      updateDefectStatus,
      acknowledgeIncident,
      escalateIncident,
      toast,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

// AppContext.jsx - Global Application State & Provider for Urban Net Command Center

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchEvents, updateEventStatus as apiUpdateStatus } from '../services/api/eventsApi';
import { fetchBuses } from '../services/api/busesApi';
import { fetchDashboardSummary } from '../services/api/dashboardApi';
import { initSocket, disconnectSocket } from '../services/socket/socketService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMockMode, setIsMockMode] = useState(true);

  // Global Filter State
  const [filters, setFilters] = useState({
    category: 'ALL',
    type: 'ALL',
    severity: 'ALL',
    status: 'ALL',
    handling: 'ALL',
    busId: 'ALL',
    search: ''
  });

  // Load initial data through API abstraction
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsData, busesData, summaryData] = await Promise.all([
        fetchEvents(),
        fetchBuses(),
        fetchDashboardSummary()
      ]);
      setEvents(eventsData);
      setBuses(busesData);
      setSummary(summaryData);
    } catch (err) {
      console.error('[Urban Net] Data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Initialize socket connection or live simulation
    initSocket({
      isMock: isMockMode,
      onNewEvent: (newEvent) => {
        setEvents((prev) => [newEvent, ...prev]);
      },
      onUpdatedEvent: (updatedEvent) => {
        setEvents((prev) =>
          prev.map((e) => (e.observationId === updatedEvent.observationId ? updatedEvent : e))
        );
      },
      onUpdatedBus: (updatedBus) => {
        setBuses((prev) =>
          prev.map((b) => (b.busId === updatedBus.busId ? updatedBus : b))
        );
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [loadData, isMockMode]);

  // Update Event Status handler
  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      const updated = await apiUpdateStatus(eventId, newStatus);
      setEvents((prev) =>
        prev.map((e) => (e.observationId === eventId ? updated : e))
      );
      if (selectedEvent && selectedEvent.observationId === eventId) {
        setSelectedEvent(updated);
      }
    } catch (err) {
      console.error('Failed to update event status:', err);
    }
  };

  const value = {
    events,
    buses,
    summary,
    loading,
    selectedEvent,
    setSelectedEvent,
    isMockMode,
    setIsMockMode,
    filters,
    setFilters,
    updateEventStatus: handleUpdateStatus,
    refreshData: loadData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

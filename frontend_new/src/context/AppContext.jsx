// AppContext.jsx - Global Application State & Real Backend Synchronization

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
  const [serverError, setServerError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  // Load initial data from real backend APIs
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setServerError(null);

      const [eventsData, busesData, summaryData] = await Promise.all([
        fetchEvents(),
        fetchBuses(),
        fetchDashboardSummary()
      ]);

      setEvents(eventsData);
      setBuses(busesData);
      setSummary(summaryData);
    } catch (err) {
      console.error('[Urban Net] Central server connection failed:', err);
      setServerError('Central server unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Initialize real-time Socket.IO listeners
    initSocket({
      onNewEvent: (newEvent) => {
        setEvents((prev) => {
          const index = prev.findIndex((e) => e.observationId === newEvent.observationId);
          if (index >= 0) {
            const copy = [...prev];
            copy[index] = newEvent;
            return copy;
          }
          return [newEvent, ...prev];
        });

        // Update dashboard summary metrics dynamically
        setSummary((prev) => {
          if (!prev) return prev;
          const isCritical = newEvent.severity === 'CRITICAL';
          const isPersistent = newEvent.handling === 'PERSISTENT';
          const updatedRecent = [
            newEvent,
            ...prev.recentEvents.filter((e) => e.observationId !== newEvent.observationId)
          ].slice(0, 10);

          return {
            ...prev,
            totalEventCount: prev.totalEventCount + 1,
            criticalEventCount: isCritical ? prev.criticalEventCount + 1 : prev.criticalEventCount,
            persistentEventCount: isPersistent ? prev.persistentEventCount + 1 : prev.persistentEventCount,
            recentEvents: updatedRecent
          };
        });
      },
      onUpdatedEvent: (updatedEvent) => {
        setEvents((prev) =>
          prev.map((e) =>
            e.observationId === updatedEvent.observationId || (e._id && e._id === updatedEvent._id)
              ? updatedEvent
              : e
          )
        );

        setSelectedEvent((prev) =>
          prev && (prev.observationId === updatedEvent.observationId || (prev._id && prev._id === updatedEvent._id))
            ? updatedEvent
            : prev
        );

        // Update recent events inside summary if present
        setSummary((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            recentEvents: prev.recentEvents.map((e) =>
              e.observationId === updatedEvent.observationId ? updatedEvent : e
            )
          };
        });
      },
      onUpdatedBus: (updatedBus) => {
        setBuses((prev) => {
          const index = prev.findIndex((b) => b.busId === updatedBus.busId);
          if (index >= 0) {
            const next = [...prev];
            next[index] = updatedBus;
            return next;
          }
          return [...prev, updatedBus];
        });
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [loadData]);

  // Update Event Status handler targeting real API PATCH /events/:id/status
  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      const updated = await apiUpdateStatus(eventId, newStatus);
      setEvents((prev) =>
        prev.map((e) => (e.observationId === eventId || e._id === eventId ? updated : e))
      );
      if (selectedEvent && (selectedEvent.observationId === eventId || selectedEvent._id === eventId)) {
        setSelectedEvent(updated);
      }
      // Reload summary stats to reflect status change
      fetchDashboardSummary().then(setSummary).catch(() => {});
    } catch (err) {
      console.error('Failed to update event status:', err);
    }
  };

  const value = {
    events,
    buses,
    summary,
    loading,
    serverError,
    selectedEvent,
    setSelectedEvent,
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

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { MOCK_BUSES } from "../data/buses";
import { MOCK_EVENTS } from "../data/events";
import { MOCK_DEFECTS, ROAD_DEFECT_STATS } from "../data/defects";
import {
  MOCK_INFRASTRUCTURE,
  INFRASTRUCTURE_STATS,
} from "../data/infrastructure";
import { MOCK_INCIDENTS, SAFETY_STATS } from "../data/incidents";
import { CITY_CONFIG } from "../data/config";
import {
  TRAFFIC_SUMMARY,
  CONGESTED_ZONES,
  HOURLY_TRAFFIC_TREND,
  VEHICLE_CLASSIFICATION,
  ROUTE_PERFORMANCE,
} from "../data/traffic";
import {
  ORIGIN_DESTINATION_MATRIX,
  ACTIONABLE_URBAN_INSIGHTS,
  BUS_CONTRIBUTION_LEADERBOARD,
  DEFECTS_OVER_TIME_TREND,
  REPORT_TYPES,
} from "../data/analytics";
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
  generateDemoEventApi,
} from "../services/api";

const AppContext = createContext();
const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "https://urban-net-sih26124.onrender.com";

// Normalize any event object (from REST API or Socket.IO) into a clean, unified shape
export const normalizeEventData = (evt) => {
  if (!evt) return null;

  let lat = 28.6139;
  let lng = 77.209;
  if (
    evt.latitude !== undefined &&
    evt.latitude !== null &&
    !isNaN(parseFloat(evt.latitude))
  ) {
    lat = parseFloat(evt.latitude);
  } else if (
    evt.location &&
    typeof evt.location === "object" &&
    evt.location.latitude !== undefined &&
    !isNaN(parseFloat(evt.location.latitude))
  ) {
    lat = parseFloat(evt.location.latitude);
  }

  if (
    evt.longitude !== undefined &&
    evt.longitude !== null &&
    !isNaN(parseFloat(evt.longitude))
  ) {
    lng = parseFloat(evt.longitude);
  } else if (
    evt.location &&
    typeof evt.location === "object" &&
    evt.location.longitude !== undefined &&
    !isNaN(parseFloat(evt.location.longitude))
  ) {
    lng = parseFloat(evt.location.longitude);
  }

  let locationStr = "City Corridor";
  if (typeof evt.location === "string" && evt.location.trim().length > 0) {
    locationStr = evt.location;
  } else if (
    evt.location &&
    typeof evt.location === "object" &&
    evt.location.address
  ) {
    locationStr = evt.location.address;
  } else if (lat && lng) {
    locationStr = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  let confidence = 0.94;
  if (
    evt.confidence !== undefined &&
    evt.confidence !== null &&
    !isNaN(parseFloat(evt.confidence))
  ) {
    confidence = parseFloat(evt.confidence);
  } else if (
    evt.detection &&
    evt.detection.confidence !== undefined &&
    !isNaN(parseFloat(evt.detection.confidence))
  ) {
    confidence = parseFloat(evt.detection.confidence);
  }

  let severity = "HIGH";
  if (evt.severity) {
    severity = evt.severity.toUpperCase();
  } else if (evt.detection && evt.detection.severity) {
    severity = evt.detection.severity.toUpperCase();
  }

  let type = evt.type;
  if (!type && evt.eventType) {
    if (evt.eventType === "HIT_AND_RUN") type = "Hit-and-Run Incident";
    else if (evt.eventType === "POTHOLE") type = "Pothole";
    else if (evt.eventType === "WATERLOGGING") type = "Waterlogging";
    else if (
      evt.eventType === "FOOTPATH_DAMAGE" ||
      evt.eventType === "INFRASTRUCTURE"
    )
      type = "Damaged Infrastructure";
    else type = evt.eventType;
  }
  if (!type) type = "AI Detection";

  let category = evt.category;
  if (!category) {
    if (
      type.includes("Hit-and-Run") ||
      type.includes("RASH_DRIVING") ||
      evt.eventType === "HIT_AND_RUN"
    )
      category = "SAFETY_INCIDENT";
    else if (
      type.includes("Pothole") ||
      type.includes("Waterlogging") ||
      evt.eventType === "POTHOLE" ||
      evt.eventType === "WATERLOGGING"
    )
      category = "ROAD_DEFECT";
    else category = "INFRASTRUCTURE";
  }

  let parsedMeta = {};
  if (typeof evt.metadata === "string") {
    try {
      parsedMeta = JSON.parse(evt.metadata);
    } catch (err) {}
  } else if (typeof evt.metadata === "object" && evt.metadata !== null) {
    parsedMeta = evt.metadata;
  }

  const offendingVehicleReg =
    evt.offendingVehicleReg ||
    parsedMeta.offendingVehicleReg ||
    parsedMeta.offendingVehicle?.registrationNo ||
    (evt.offendingVehicle
      ? typeof evt.offendingVehicle === "string"
        ? evt.offendingVehicle
        : evt.offendingVehicle.registrationNo
      : null);

  const offendingVehicleDetails =
    evt.offendingVehicleDetails ||
    parsedMeta.offendingVehicleDetails ||
    parsedMeta.offendingVehicle?.makeModel ||
    null;

  return {
    ...evt,
    id: evt.id || `EVT_${Date.now()}`,
    type,
    category,
    busId: evt.busId || "BUS_EDGE",
    location: locationStr,
    latitude: lat,
    longitude: lng,
    confidence,
    severity,
    offendingVehicleReg,
    offendingVehicleDetails,
    timeAgo: evt.timeAgo || "Just now",
    timestamp: evt.timestamp || new Date().toISOString(),
    status:
      evt.status ||
      (severity === "CRITICAL" ? "Under Investigation" : "Pending Maintenance"),
    evidenceImage:
      evt.evidenceImage ||
      evt.evidence?.imageUrl ||
      "https://www.123rf.com/photo_15876305_car-accident-insurance-concept.html",
    source: "EDGE_AI",
  };
};

export const AppProvider = ({ children }) => {
  // Initial normalized events from mock fallback
  const [buses, setBuses] = useState(MOCK_BUSES);
  const [events, setEvents] = useState(() =>
    MOCK_EVENTS.map((e) => normalizeEventData(e)),
  );
  const [defects, setDefects] = useState(MOCK_DEFECTS);
  const [infrastructure, setInfrastructure] = useState(MOCK_INFRASTRUCTURE);
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);

  // Traffic & Analytics Live State
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [trafficSummary, setTrafficSummary] = useState(TRAFFIC_SUMMARY);
  const [congestedZones, setCongestedZones] = useState(CONGESTED_ZONES);
  const [hourlyTrafficTrend, setHourlyTrafficTrend] =
    useState(HOURLY_TRAFFIC_TREND);
  const [defectsOverTimeTrend, setDefectsOverTimeTrend] = useState(
    DEFECTS_OVER_TIME_TREND,
  );
  const [busLeaderboard, setBusLeaderboard] = useState(
    BUS_CONTRIBUTION_LEADERBOARD,
  );

  const [backendConnected, setBackendConnected] = useState(false);

  // Edge AI Connection & Ingestion Live State
  const [lastEdgeEvent, setLastEdgeEvent] = useState(null);
  const [edgeEventsCount, setEdgeEventsCount] = useState(0);
  const [lastEdgeReceivedTime, setLastEdgeReceivedTime] = useState(null);

  // Selection drawers / modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [trackingVehicleIncident, setTrackingVehicleIncident] = useState(null);

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [mapFilters, setMapFilters] = useState({
    eventType: "ALL",
    severity: "ALL",
    timeRange: "TODAY",
    busId: "ALL",
  });

  // Notifications & Toast system
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Live event ticker feed
  const [liveTickerFeed, setLiveTickerFeed] = useState([
    {
      id: "TICK_01",
      time: "10:32:14",
      bus: "BUS_17",
      type: "Pothole",
      location: "MG Road",
    },
    {
      id: "TICK_02",
      time: "10:31:52",
      bus: "BUS_12",
      type: "Waterlogging",
      location: "Sector 14",
    },
    {
      id: "TICK_03",
      time: "10:30:41",
      bus: "BUS_31",
      type: "Traffic Jam",
      location: "Dhaula Kuan",
    },
    {
      id: "TICK_04",
      time: "10:29:17",
      bus: "BUS_07",
      type: "Missing Divider",
      location: "NH-48",
    },
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
      if (eventRes && eventRes.events && eventRes.events.length > 0) {
        const normalizedFetched = eventRes.events.map((e) =>
          normalizeEventData(e),
        );
        setEvents((prev) => {
          const map = new Map(normalizedFetched.map((e) => [e.id, e]));
          // Retain any live events in state that may not be in fetched list yet
          prev.forEach((e) => {
            if (!map.has(e.id)) {
              map.set(e.id, e);
            }
          });
          return Array.from(map.values());
        });
      }

      const roadRes = await fetchRoadConditions();
      if (roadRes && roadRes.roadDefects) {
        const mergedDefects = [
          ...roadRes.roadDefects,
          ...(roadRes.waterlogging || []).map((w) => ({
            ...w,
            type: "Waterlogging",
          })),
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
      console.warn(
        "[AppContext] Could not connect to backend, running in static fallback mode.",
        err,
      );
      setBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();

    // Setup Socket.IO listener for real-time updates
    const socket = io(BACKEND_URL, {
      reconnectionAttempts: 5,
      timeout: 3000,
    });

    socket.on("connect", () => {
      console.log("[Socket.IO] Connected to backend WebSocket server");
      setBackendConnected(true);
    });

    socket.on("event:new", (rawEvent) => {
      console.log("[Socket.IO] New Event received in real time:", rawEvent);

      const norm = normalizeEventData(rawEvent);
      const timeStr = new Date().toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      norm.receivedAt = timeStr;

      setLastEdgeEvent(norm);
      setEdgeEventsCount((prev) => prev + 1);
      setLastEdgeReceivedTime(timeStr);

      // Immediately update events state in React
      setEvents((prev) => {
        const exists = prev.some((e) => e.id === norm.id);
        if (exists) {
          return prev.map((e) => (e.id === norm.id ? { ...e, ...norm } : e));
        }
        return [norm, ...prev];
      });

      // Update incidents if critical/safety incident
      if (
        norm.severity === "CRITICAL" ||
        norm.type.includes("Hit-and-Run") ||
        norm.category === "SAFETY_INCIDENT"
      ) {
        setIncidents((prev) => {
          const exists = prev.some((i) => i.id === norm.id);
          if (exists) return prev;
          return [
            {
              id: norm.id,
              type: norm.type,
              busId: norm.busId,
              location: norm.location,
              latitude: norm.latitude,
              longitude: norm.longitude,
              timestamp: norm.timestamp,
              severity: norm.severity,
              confidence: norm.confidence,
              status: norm.status,
              offendingVehicleReg: norm.offendingVehicleReg,
              offendingVehicleDetails: norm.offendingVehicleDetails,
              evidenceImage: norm.evidenceImage,
              description:
                norm.description ||
                `${norm.type} detected by ${norm.busId} at ${norm.location}.`,
            },
            ...prev,
          ];
        });
      }

      const newTicker = {
        id: `TICK_${Date.now()}`,
        time: timeStr,
        bus: norm.busId,
        type: norm.type,
        location: norm.location,
      };
      setLiveTickerFeed((prev) => [newTicker, ...prev.slice(0, 5)]);

      showToast(
        `New Edge AI event received: ${norm.type} from ${norm.busId} (${norm.location})`,
        "info",
      );
    });

    socket.on("alert:new", (newAlert) => {
      console.log("[Socket.IO] New Alert received:", newAlert);
      showToast(
        `${newAlert.severity} ALERT: ${newAlert.message}`,
        newAlert.severity === "CRITICAL" ? "warning" : "info",
      );
    });

    socket.on("defect:new", () => {
      loadBackendData();
    });

    socket.on("incident:new", () => {
      loadBackendData();
    });

    socket.on("disconnect", () => {
      console.log("[Socket.IO] WebSocket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [loadBackendData, showToast]);

  // Demo event trigger helper
  const triggerDemoEvent = async (type = "POTHOLE", details = {}) => {
    showToast(`Generating ${type} AI Detection Event...`, "info");
    const res = await generateDemoEventApi(type, details);
    if (res && res.success) {
      showToast(`AI Event '${type}' generated successfully!`, "success");
      loadBackendData();
    } else {
      showToast(`Failed to generate ${type} event`, "warning");
    }
  };

  // Interactive Maintenance Workflow State Machine:
  // Detected -> Assigned -> In Progress -> Resolved
  const updateDefectStatus = async (defectId, newStatus, assignedCrew = "") => {
    // Optimistic UI update
    setDefects((prev) =>
      prev.map((d) => {
        if (d.id === defectId) {
          const updated = {
            ...d,
            status: newStatus,
            assignedTo:
              assignedCrew || d.assignedTo || "Municipal Maintenance Crew 1",
          };
          if (selectedDefect && selectedDefect.id === defectId) {
            setSelectedDefect(updated);
          }
          return updated;
        }
        return d;
      }),
    );

    showToast(`Defect ${defectId} status updated to '${newStatus}'`, "success");

    // Call backend endpoint
    await fetchApi(`/road-conditions/${defectId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus, assignedTo: assignedCrew }),
    });
  };

  // Incident Actions
  const acknowledgeIncident = async (incidentId) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updated = { ...inc, status: "Acknowledged" };
          if (selectedIncident && selectedIncident.id === incidentId)
            setSelectedIncident(updated);
          return updated;
        }
        return inc;
      }),
    );

    showToast(`Incident ${incidentId} acknowledged by Operator`, "success");

    await fetchApi(`/incidents/${incidentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Acknowledged" }),
    });
  };

  const escalateIncident = async (incidentId) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updated = { ...inc, status: "Escalated to Traffic Police" };
          if (selectedIncident && selectedIncident.id === incidentId)
            setSelectedIncident(updated);
          return updated;
        }
        return inc;
      }),
    );

    showToast(
      `Incident ${incidentId} escalated to Traffic Police Command`,
      "warning",
    );

    await fetchApi(`/incidents/${incidentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "Escalated to Traffic Police" }),
    });
  };

  return (
    <AppContext.Provider
      value={{
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
        lastEdgeEvent,
        edgeEventsCount,
        lastEdgeReceivedTime,
        triggerDemoEvent,
        selectedEvent,
        setSelectedEvent,
        selectedBus,
        setSelectedBus,
        selectedDefect,
        setSelectedDefect,
        selectedIncident,
        setSelectedIncident,
        trackingVehicleIncident,
        setTrackingVehicleIncident,
        searchQuery,
        setSearchQuery,
        mapFilters,
        setMapFilters,
        liveTickerFeed,
        updateDefectStatus,
        acknowledgeIncident,
        escalateIncident,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

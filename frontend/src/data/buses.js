// Bus Fleet Data - 50 Public Transport Sensing Units
// Each bus operates as an Edge AI mobile sensor platform

const ROUTES = [
  { id: "Route 101", name: "Connaught Place → MG Road → Cyber Hub" },
  { id: "Route 204", name: "AIIMS → Dhaula Kuan → Airport T3" },
  { id: "Route 305", name: "Ring Road Express (Nehru Place → Lajpat Nagar)" },
  { id: "Route 402", name: "NH-48 Suburban Feeder (Mahipalpur → Sector 21)" },
  { id: "Route 509", name: "East-West Transit (Akshardham → Rajiv Chowk)" }
];

// Helper to generate 50 realistic buses
export const MOCK_BUSES = Array.from({ length: 50 }, (_, i) => {
  const busNum = String(i + 1).padStart(2, "0");
  const busId = `BUS_${busNum}`;
  const route = ROUTES[i % ROUTES.length];
  
  // Base coordinates scattered around New Delhi NCR center (28.6139, 77.2090)
  const latOffset = (Math.sin(i * 1.5) * 0.08) + (Math.random() * 0.02 - 0.01);
  const lngOffset = (Math.cos(i * 1.3) * 0.09) + (Math.random() * 0.02 - 0.01);
  const latitude = +(28.6139 + latOffset).toFixed(4);
  const longitude = +(77.2090 + lngOffset).toFixed(4);

  // Status distribution: 42 online, 5 offline, 3 warning
  let status = "ONLINE";
  if (i === 11 || i === 24 || i === 38) status = "WARNING";
  if (i === 22 || i === 30 || i === 41 || i === 47 || i === 49) status = "OFFLINE";

  // Camera health for 5-camera array
  const cameraStatus = {
    front: status === "OFFLINE" ? "DISCONNECTED" : (i === 11 ? "DEGRADED" : "ACTIVE"),
    rear: status === "OFFLINE" ? "DISCONNECTED" : "ACTIVE",
    left: status === "OFFLINE" ? "DISCONNECTED" : (i === 24 ? "DIRTY_LENS" : "ACTIVE"),
    right: status === "OFFLINE" ? "DISCONNECTED" : "ACTIVE",
    cabin: status === "OFFLINE" ? "DISCONNECTED" : (i === 38 ? "DEGRADED" : "ACTIVE"),
  };

  const edgeAiHealth = status === "OFFLINE" ? "OFFLINE" : (status === "WARNING" ? "DEGRADED" : "OPTIMAL");
  const network = status === "OFFLINE" ? "NO_SIGNAL" : (status === "WARNING" ? "4G_WEAK" : "5G_ACTIVE");
  const speed = status === "OFFLINE" ? 0 : Math.floor(18 + Math.random() * 28);
  const eventsToday = status === "OFFLINE" ? Math.floor(Math.random() * 5) : Math.floor(15 + Math.random() * 35);
  const cpuLoad = status === "OFFLINE" ? 0 : Math.floor(35 + Math.random() * 45);
  const gpuUsage = status === "OFFLINE" ? 0 : Math.floor(48 + Math.random() * 40);

  return {
    id: busId,
    vehicleReg: `DL01PC${1000 + i}`,
    routeId: route.id,
    routeName: route.name,
    status,
    latitude,
    longitude,
    speed,
    heading: Math.floor(Math.random() * 360),
    cameraStatus,
    edgeAiHealth,
    network,
    cpuLoad,
    gpuUsage,
    eventsToday,
    driverName: `Driver ${['Ramesh', 'Suresh', 'Vikram', 'Anil', 'Rajesh', 'Praveen', 'Sunil'][i % 7]} Kumar`,
    lastSync: `${Math.floor(Math.random() * 59)}s ago`,
    bandwidthSaved: "82.4%",
    firmwareVersion: "BEL-EDGE-AI-v4.2.1"
  };
});

export const FLEET_SUMMARY = {
  total: 50,
  online: 42,
  offline: 5,
  warning: 3,
  eventsTodayTotal: 1284,
  avgBandwidthSaved: "82.1% (Estimated / Demo Metric)"
};

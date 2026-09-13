// Traffic Intelligence Data
// Vehicle counting, classification, spatial congestion index, and route performance

export const VEHICLE_CLASSIFICATION = [
  { name: "Passenger Cars", count: 9840, percentage: 53.4, color: "#3b82f6" },
  { name: "Motorcycles / 2W", count: 4720, percentage: 25.6, color: "#10b981" },
  { name: "Public Buses", count: 1850, percentage: 10.0, color: "#8b5cf6" },
  { name: "Auto Rickshaws", count: 1120, percentage: 6.1, color: "#f59e0b" },
  { name: "Commercial Trucks", count: 890, percentage: 4.8, color: "#ef4444" }
];

export const CONGESTED_ZONES = [
  {
    zone: "Dhaula Kuan Intersection",
    trafficLevel: "CRITICAL",
    trafficIndex: 88,
    avgSpeed: "9 km/h",
    vehicleCount: 3420,
    trend: "+18%",
    status: "Severe Jam"
  },
  {
    zone: "MG Road - Sector 14 Node",
    trafficLevel: "HIGH",
    trafficIndex: 76,
    avgSpeed: "14 km/h",
    vehicleCount: 2890,
    trend: "+12%",
    status: "Congested"
  },
  {
    zone: "AIIMS Flyover Ring Road",
    trafficLevel: "HIGH",
    trafficIndex: 74,
    avgSpeed: "16 km/h",
    vehicleCount: 2650,
    trend: "+5%",
    status: "Congested"
  },
  {
    zone: "Connaught Place Outer Circle",
    trafficLevel: "MEDIUM",
    trafficIndex: 58,
    avgSpeed: "22 km/h",
    vehicleCount: 1980,
    trend: "-4%",
    status: "Moderate"
  },
  {
    zone: "NH-48 Mahipalpur Expressway",
    trafficLevel: "LOW",
    trafficIndex: 32,
    avgSpeed: "52 km/h",
    vehicleCount: 4120,
    trend: "-15%",
    status: "Smooth Flow"
  }
];

export const ROUTE_PERFORMANCE = [
  {
    route: "Route 101 (CP → MG Road)",
    normalTime: "32 min",
    currentTime: "47 min",
    delay: "+15 min",
    trafficLevel: "High",
    status: "Delayed",
    trafficIndex: 78
  },
  {
    route: "Route 204 (AIIMS → Airport T3)",
    normalTime: "28 min",
    currentTime: "41 min",
    delay: "+13 min",
    trafficLevel: "High",
    status: "Delayed",
    trafficIndex: 75
  },
  {
    route: "Route 305 (Ring Road Express)",
    normalTime: "40 min",
    currentTime: "44 min",
    delay: "+4 min",
    trafficLevel: "Moderate",
    status: "On Schedule",
    trafficIndex: 54
  },
  {
    route: "Route 402 (NH-48 Feeder)",
    normalTime: "25 min",
    currentTime: "26 min",
    delay: "+1 min",
    trafficLevel: "Low",
    status: "Optimal",
    trafficIndex: 28
  }
];

export const HOURLY_TRAFFIC_TREND = [
  { time: "06:00", volume: 2400, speed: 48, densityIndex: 28 },
  { time: "07:00", volume: 4800, speed: 38, densityIndex: 45 },
  { time: "08:00", volume: 8900, speed: 24, densityIndex: 68 },
  { time: "09:00", volume: 14200, speed: 18, densityIndex: 84 },
  { time: "10:00", volume: 18420, speed: 14, densityIndex: 88 },
  { time: "11:00", volume: 16100, speed: 20, densityIndex: 76 },
  { time: "12:00", volume: 13500, speed: 26, densityIndex: 62 },
  { time: "13:00", volume: 12800, speed: 29, densityIndex: 58 },
  { time: "14:00", volume: 13900, speed: 25, densityIndex: 64 },
  { time: "15:00", volume: 15400, speed: 22, densityIndex: 71 },
  { time: "16:00", volume: 17200, speed: 17, densityIndex: 82 },
  { time: "17:00", volume: 19100, speed: 12, densityIndex: 92 }
];

export const TRAFFIC_SUMMARY = {
  vehiclesDetectedToday: 18420,
  trafficIndex: 72,
  congestedZonesCount: 18,
  avgFleetSpeed: "31 km/h"
};

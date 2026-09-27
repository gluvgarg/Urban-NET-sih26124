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
    id: "ZONE-01",
    zone: "Dhaula Kuan Intersection",
    trafficLevel: "CRITICAL",
    trafficIndex: 88,
    avgSpeed: "9 km/h",
    vehicleCount: 3420,
    trend: "+18%",
    status: "Severe Jam",
    lat: 28.5921,
    lng: 77.1611,
    queueLength: "850 m",
    corridor: "Ring Road - Vande Mataram Marg",
    recommendedAction: "Adaptive signal priority to east corridor"
  },
  {
    id: "ZONE-02",
    zone: "MG Road - IFFCO Chowk Node",
    trafficLevel: "HIGH",
    trafficIndex: 78,
    avgSpeed: "14 km/h",
    vehicleCount: 2890,
    trend: "+12%",
    status: "Congested",
    lat: 28.4735,
    lng: 77.0601,
    queueLength: "620 m",
    corridor: "Gurugram Transit Corridor",
    recommendedAction: "Bus lane enforcement active"
  },
  {
    id: "ZONE-03",
    zone: "AIIMS Flyover & Ring Road",
    trafficLevel: "HIGH",
    trafficIndex: 76,
    avgSpeed: "16 km/h",
    vehicleCount: 2650,
    trend: "+5%",
    status: "Congested",
    lat: 28.5672,
    lng: 77.2100,
    queueLength: "540 m",
    corridor: "South Delhi Arterial Ring",
    recommendedAction: "Divert light traffic to Aurobindo Marg"
  },
  {
    id: "ZONE-04",
    zone: "ITO Intersection & Vikas Minar",
    trafficLevel: "CRITICAL",
    trafficIndex: 91,
    avgSpeed: "7 km/h",
    vehicleCount: 3950,
    trend: "+24%",
    status: "Severe Jam",
    lat: 28.6304,
    lng: 77.2435,
    queueLength: "1,100 m",
    corridor: "Yamuna Crossing East-West",
    recommendedAction: "Emergency corridor clear for buses"
  },
  {
    id: "ZONE-05",
    zone: "Connaught Place Outer Circle",
    trafficLevel: "MEDIUM",
    trafficIndex: 58,
    avgSpeed: "22 km/h",
    vehicleCount: 1980,
    trend: "-4%",
    status: "Moderate Flow",
    lat: 28.6315,
    lng: 77.2167,
    queueLength: "280 m",
    corridor: "Central Business District Ring",
    recommendedAction: "Normal cyclic signaling"
  },
  {
    id: "ZONE-06",
    zone: "Laxmi Nagar Metro - Vikas Marg",
    trafficLevel: "HIGH",
    trafficIndex: 82,
    avgSpeed: "12 km/h",
    vehicleCount: 3100,
    trend: "+14%",
    status: "Congested",
    lat: 28.6278,
    lng: 77.2800,
    queueLength: "750 m",
    corridor: "Trans-Yamuna Commuter Link",
    recommendedAction: "Traffic police deployment active"
  },
  {
    id: "ZONE-07",
    zone: "Kashmiri Gate ISBT Junction",
    trafficLevel: "HIGH",
    trafficIndex: 79,
    avgSpeed: "13 km/h",
    vehicleCount: 2780,
    trend: "+8%",
    status: "Congested",
    lat: 28.6675,
    lng: 77.2285,
    queueLength: "680 m",
    corridor: "Interstate Bus Terminal Gateway",
    recommendedAction: "Transit bay segregation active"
  },
  {
    id: "ZONE-08",
    zone: "Nehru Place Outer Ring Node",
    trafficLevel: "MEDIUM",
    trafficIndex: 62,
    avgSpeed: "21 km/h",
    vehicleCount: 2240,
    trend: "+2%",
    status: "Moderate Flow",
    lat: 28.5491,
    lng: 77.2519,
    queueLength: "350 m",
    corridor: "Commercial Hub Connector",
    recommendedAction: "Real-time variable message update"
  },
  {
    id: "ZONE-09",
    zone: "Karol Bagh - Pusa Road",
    trafficLevel: "MEDIUM",
    trafficIndex: 55,
    avgSpeed: "24 km/h",
    vehicleCount: 1820,
    trend: "-3%",
    status: "Moderate Flow",
    lat: 28.6448,
    lng: 77.1895,
    queueLength: "220 m",
    corridor: "West Delhi Commercial Belt",
    recommendedAction: "Enforce curbside parking restrictions"
  },
  {
    id: "ZONE-10",
    zone: "NH-48 Mahipalpur Expressway",
    trafficLevel: "LOW",
    trafficIndex: 28,
    avgSpeed: "56 km/h",
    vehicleCount: 4120,
    trend: "-15%",
    status: "Smooth Flow",
    lat: 28.5410,
    lng: 77.1290,
    queueLength: "0 m",
    corridor: "Airport Expressway Corridor",
    recommendedAction: "High-speed lane maintenance monitor"
  },
  {
    id: "ZONE-11",
    zone: "Barapullah Elevated Corridor",
    trafficLevel: "LOW",
    trafficIndex: 32,
    avgSpeed: "52 km/h",
    vehicleCount: 2850,
    trend: "-10%",
    status: "Smooth Flow",
    lat: 28.5815,
    lng: 77.2450,
    queueLength: "0 m",
    corridor: "INA to Mayur Vihar Expressway",
    recommendedAction: "Free flow green passage"
  },
  {
    id: "ZONE-12",
    zone: "Noida Tollway Gateway DND",
    trafficLevel: "LOW",
    trafficIndex: 35,
    avgSpeed: "49 km/h",
    vehicleCount: 3600,
    trend: "-8%",
    status: "Smooth Flow",
    lat: 28.5830,
    lng: 77.2910,
    queueLength: "50 m",
    corridor: "DND Flyway Intercity Arterial",
    recommendedAction: "Smart fast-tag gates clear"
  }
];

// Heatmap points data representing spatial traffic density across the city network
export const TRAFFIC_HEATMAP_POINTS = [
  // High / Critical Congestion Points (Red: Index 75 - 95, Speed 5 - 15 km/h)
  { lat: 28.5921, lng: 77.1611, intensity: 0.92, index: 88, speed: 9, label: "Dhaula Kuan Junction", level: "CRITICAL" },
  { lat: 28.5950, lng: 77.1650, intensity: 0.88, index: 84, speed: 11, label: "Dhaula Kuan North Bay", level: "CRITICAL" },
  { lat: 28.6304, lng: 77.2435, intensity: 0.95, index: 91, speed: 7, label: "ITO Intersection", level: "CRITICAL" },
  { lat: 28.6280, lng: 77.2410, intensity: 0.90, index: 89, speed: 8, label: "Vikas Minar Bottleneck", level: "CRITICAL" },
  { lat: 28.6278, lng: 77.2800, intensity: 0.84, index: 82, speed: 12, label: "Laxmi Nagar Vikas Marg", level: "HIGH" },
  { lat: 28.6675, lng: 77.2285, intensity: 0.82, index: 79, speed: 13, label: "Kashmiri Gate ISBT", level: "HIGH" },
  { lat: 28.4735, lng: 77.0601, intensity: 0.81, index: 78, speed: 14, label: "MG Road IFFCO Chowk", level: "HIGH" },
  { lat: 28.5672, lng: 77.2100, intensity: 0.79, index: 76, speed: 16, label: "AIIMS Flyover Ring Road", level: "HIGH" },
  { lat: 28.5650, lng: 77.2050, intensity: 0.77, index: 74, speed: 17, label: "Safdarjung Hospital Node", level: "HIGH" },
  { lat: 28.5690, lng: 77.2180, intensity: 0.75, index: 72, speed: 18, label: "South Extension Ring Road", level: "HIGH" },
  { lat: 28.6500, lng: 77.2300, intensity: 0.80, index: 77, speed: 15, label: "Old Delhi Railway Stn Link", level: "HIGH" },

  // Medium / Moderate Congestion Points (Yellow / Amber: Index 45 - 70, Speed 20 - 38 km/h)
  { lat: 28.6315, lng: 77.2167, intensity: 0.60, index: 58, speed: 22, label: "Connaught Place Outer Circle", level: "MEDIUM" },
  { lat: 28.6340, lng: 77.2190, intensity: 0.58, index: 56, speed: 24, label: "Barakhamba Radial Node", level: "MEDIUM" },
  { lat: 28.5491, lng: 77.2519, intensity: 0.64, index: 62, speed: 21, label: "Nehru Place Outer Ring", level: "MEDIUM" },
  { lat: 28.5420, lng: 77.2580, intensity: 0.55, index: 53, speed: 27, label: "Kalkaji Mandir Underpass", level: "MEDIUM" },
  { lat: 28.6448, lng: 77.1895, intensity: 0.57, index: 55, speed: 24, label: "Karol Bagh Pusa Road", level: "MEDIUM" },
  { lat: 28.6410, lng: 77.1950, intensity: 0.52, index: 50, speed: 28, label: "Rajendra Place Arterial", level: "MEDIUM" },
  { lat: 28.5700, lng: 77.2400, intensity: 0.62, index: 60, speed: 23, label: "Lajpat Nagar Central Market", level: "MEDIUM" },
  { lat: 28.5800, lng: 77.2200, intensity: 0.50, index: 48, speed: 30, label: "Lodhi Road Transit Point", level: "MEDIUM" },
  { lat: 28.6180, lng: 77.2320, intensity: 0.54, index: 52, speed: 26, label: "India Gate Hexagon North", level: "MEDIUM" },

  // Low Congestion / Smooth Flow Points (Green: Index 15 - 40, Speed 45 - 65 km/h)
  { lat: 28.5410, lng: 77.1290, intensity: 0.28, index: 28, speed: 56, label: "NH-48 Mahipalpur Expressway", level: "LOW" },
  { lat: 28.5550, lng: 77.1050, intensity: 0.24, index: 24, speed: 60, label: "IGI Airport T3 Approach", level: "LOW" },
  { lat: 28.5815, lng: 77.2450, intensity: 0.32, index: 32, speed: 52, label: "Barapullah Elevated Bypass", level: "LOW" },
  { lat: 28.5830, lng: 77.2910, intensity: 0.35, index: 35, speed: 49, label: "Noida Tollway DND Gateway", level: "LOW" },
  { lat: 28.6050, lng: 77.2750, intensity: 0.30, index: 30, speed: 54, label: "Akshardham Flyover Link", level: "LOW" },
  { lat: 28.6850, lng: 77.2150, intensity: 0.36, index: 36, speed: 47, label: "Civil Lines Mall Road", level: "LOW" },
  { lat: 28.5200, lng: 77.1400, intensity: 0.29, index: 29, speed: 55, label: "Vasant Kunj Nelson Mandela Marg", level: "LOW" }
];

// Major road corridors with polylines and traffic status
export const TRAFFIC_CORRIDORS = [
  {
    id: "COR-01",
    name: "Ring Road (Dhaula Kuan → AIIMS → South Ext)",
    trafficLevel: "CRITICAL",
    trafficIndex: 86,
    avgSpeed: "11 km/h",
    color: "#ef4444", // Red
    coordinates: [
      [28.5921, 77.1611],
      [28.5800, 77.1750],
      [28.5720, 77.1920],
      [28.5672, 77.2100],
      [28.5690, 77.2180],
      [28.5700, 77.2400]
    ]
  },
  {
    id: "COR-02",
    name: "Vikas Marg (ITO → Laxmi Nagar → Anand Vihar)",
    trafficLevel: "CRITICAL",
    trafficIndex: 89,
    avgSpeed: "9 km/h",
    color: "#ef4444", // Red
    coordinates: [
      [28.6304, 77.2435],
      [28.6290, 77.2600],
      [28.6278, 77.2800],
      [28.6350, 77.3050]
    ]
  },
  {
    id: "COR-03",
    name: "Outer Ring Road (Nehru Place → Kalkaji → Modi Mill)",
    trafficLevel: "MEDIUM",
    trafficIndex: 59,
    avgSpeed: "23 km/h",
    color: "#f59e0b", // Amber/Yellow
    coordinates: [
      [28.5491, 77.2519],
      [28.5420, 77.2580],
      [28.5520, 77.2720],
      [28.5600, 77.2790]
    ]
  },
  {
    id: "COR-04",
    name: "Pusa Road & Karol Bagh Arterial Link",
    trafficLevel: "MEDIUM",
    trafficIndex: 54,
    avgSpeed: "26 km/h",
    color: "#eab308", // Yellow
    coordinates: [
      [28.6448, 77.1895],
      [28.6410, 77.1950],
      [28.6380, 77.2050],
      [28.6315, 77.2167]
    ]
  },
  {
    id: "COR-05",
    name: "NH-48 Airport Expressway (Dhaula Kuan → Mahipalpur → IGI T3)",
    trafficLevel: "LOW",
    trafficIndex: 29,
    avgSpeed: "55 km/h",
    color: "#10b981", // Green
    coordinates: [
      [28.5921, 77.1611],
      [28.5650, 77.1450],
      [28.5410, 77.1290],
      [28.5550, 77.1050]
    ]
  },
  {
    id: "COR-06",
    name: "Barapullah Elevated Bypass (INA Market → Mayur Vihar DND)",
    trafficLevel: "LOW",
    trafficIndex: 31,
    avgSpeed: "53 km/h",
    color: "#10b981", // Green
    coordinates: [
      [28.5720, 77.2150],
      [28.5815, 77.2450],
      [28.5850, 77.2700],
      [28.5830, 77.2910]
    ]
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

// Helper to get color by traffic score (0 to 100)
export const getCongestionColor = (index) => {
  if (index >= 80) return "#dc2626"; // Crimson Red (Severe Jam)
  if (index >= 65) return "#ef4444"; // Red (High Congestion)
  if (index >= 50) return "#f97316"; // Orange (Heavy)
  if (index >= 35) return "#eab308"; // Yellow / Amber (Moderate)
  if (index >= 20) return "#84cc16"; // Lime (Mild)
  return "#22c55e"; // Green (Smooth Flow)
};

export const getCongestionGradientStops = () => [
  { stop: 0.0, color: "rgba(34, 197, 94, 0.7)", label: "0 - Free Flow (< 25)" },
  { stop: 0.35, color: "rgba(234, 179, 8, 0.75)", label: "35 - Moderate (25-50)" },
  { stop: 0.65, color: "rgba(249, 115, 22, 0.8)", label: "65 - Heavy (50-75)" },
  { stop: 1.0, color: "rgba(220, 38, 38, 0.9)", label: "100 - Severe Jam (> 75)" }
];

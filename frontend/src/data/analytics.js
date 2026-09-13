// Analytics & Reports Central Data Model
// Origin-Destination Matrix, Route Delay Analysis, Actionable Urban Insights, and Municipal Report Generator

export const ORIGIN_DESTINATION_MATRIX = {
  zones: ["Zone A (CP/Central)", "Zone B (South/AIIMS)", "Zone C (West/Dhaula)", "Zone D (Airport/NH48)", "Zone E (East/Ring)"],
  matrix: [
    [0, 420, 210, 130, 310], // From Zone A
    [380, 0, 310, 190, 440], // From Zone B
    [190, 330, 0, 250, 280], // From Zone C
    [120, 180, 240, 0, 160], // From Zone D
    [290, 410, 260, 140, 0]  // From Zone E
  ],
  topCorridors: [
    { rank: 1, corridor: "Zone B (AIIMS) → Zone E (Ring Road)", volume: "440 vehicles/hr", flowRate: "Heavy Peak" },
    { rank: 2, corridor: "Zone A (CP) → Zone B (AIIMS)", volume: "420 vehicles/hr", flowRate: "High Congestion" },
    { rank: 3, corridor: "Zone E (Ring Road) → Zone B (AIIMS)", volume: "410 vehicles/hr", flowRate: "High Congestion" },
    { rank: 4, corridor: "Zone A (CP) → Zone E (Ring Road)", volume: "310 vehicles/hr", flowRate: "Moderate" }
  ]
};

export const ACTIONABLE_URBAN_INSIGHTS = [
  {
    id: "INS_01",
    title: "Critical Pothole Cluster Detected on MG Road Corridor",
    category: "Infrastructure Repair",
    urgency: "HIGH",
    summary: "14 road surface defects detected by 6 distinct transit buses within a 400m radius of Sector 14 junction over the past 24 hours. Bitumen degradation is expanding rapidly.",
    recommendedAction: "Dispatch Municipal Rapid Asphalt Paving Unit 2 before predicted rainfall."
  },
  {
    id: "INS_02",
    title: "Route 101 Commute Delay Surge (+28% Peak Time)",
    category: "Traffic Engineering",
    urgency: "HIGH",
    summary: "Transit buses report severe bottlenecking at Dhaula Kuan junction between 08:30 and 10:15 AM due to signal timing mismatch and unauthorized roadside parking.",
    recommendedAction: "Adjust green light signal duration by +15s on Southbound lane and deploy traffic marshal."
  },
  {
    id: "INS_03",
    title: "Repeated Waterlogging Detections in Sector 14 Underpass",
    category: "Drainage Management",
    urgency: "CRITICAL",
    summary: "3 independent buses (BUS_12, BUS_17, BUS_31) logged standing water exceeding 20cm depth. Edge AI waterlogging classifier confidence: 98.1%.",
    recommendedAction: "Activate auxiliary drainage pumps and clear clogged storm drain grates immediately."
  },
  {
    id: "INS_04",
    title: "Multi-Bus Verification: Missing Traffic Signboard on NH-48",
    category: "Public Safety",
    urgency: "MEDIUM",
    summary: "Four separate buses traversing NH-48 Expressway independently logged a missing speed-limit warning sign within 3 hours.",
    recommendedAction: "Issue maintenance work order to Signage Division for replacement installation."
  }
];

export const BUS_CONTRIBUTION_LEADERBOARD = [
  { busId: "BUS_17", route: "Route 101", eventsLogged: 42, defectsCount: 18, incidentsLogged: 3, uptime: "99.8%" },
  { busId: "BUS_12", route: "Route 204", eventsLogged: 38, defectsCount: 14, incidentsLogged: 2, uptime: "99.4%" },
  { busId: "BUS_31", route: "Route 101", eventsLogged: 35, defectsCount: 12, incidentsLogged: 1, uptime: "98.9%" },
  { busId: "BUS_07", route: "Route 402", eventsLogged: 31, defectsCount: 11, incidentsLogged: 1, uptime: "97.5%" },
  { busId: "BUS_01", route: "Route 509", eventsLogged: 29, defectsCount: 9, incidentsLogged: 0, uptime: "99.1%" }
];

export const DEFECTS_OVER_TIME_TREND = [
  { day: "Mon", potholes: 12, waterlogging: 4, infrastructure: 8 },
  { day: "Tue", potholes: 18, waterlogging: 7, infrastructure: 11 },
  { day: "Wed", potholes: 15, waterlogging: 5, infrastructure: 9 },
  { day: "Thu", potholes: 22, waterlogging: 9, infrastructure: 14 },
  { day: "Fri", potholes: 28, waterlogging: 12, infrastructure: 18 },
  { day: "Sat", potholes: 19, waterlogging: 6, infrastructure: 10 },
  { day: "Sun", potholes: 14, waterlogging: 3, infrastructure: 7 }
];

export const REPORT_TYPES = [
  { id: "ROAD_DEFECTS", title: "Road Defects & Pothole Repair Audit", desc: "Comprehensive breakdown of all detected potholes, waterlogging, and asphalt damage with GPS coordinates." },
  { id: "TRAFFIC_BOTTLENECK", title: "Traffic Congestion & Route Delay Analysis", desc: "Vehicle count trends, bottleneck heatmaps, average fleet speeds, and delay indices." },
  { id: "INFRASTRUCTURE_AUDIT", title: "Infrastructure Deficiency Report", desc: "Missing dividers, missing zebra crossings, damaged signboards, and safety risks." },
  { id: "SAFETY_INCIDENTS", title: "Public Safety & Hit-and-Run Investigation Log", desc: "Offending vehicle tracking details, speed violations, and pedestrian risk incidents." },
  { id: "FLEET_EDGE_HEALTH", title: "Bus Fleet & Edge AI Sensing Telemetry", desc: "5-camera array operational status, edge bandwidth savings (~82%), and hardware uptime." }
];

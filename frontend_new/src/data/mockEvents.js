// mockEvents.js - Edge AI Event observations gathered by transit buses

export const MOCK_EVENTS = [
  {
    observationId: "EVT-2026-1001",
    busId: "BUS-101",
    category: "ROAD",
    type: "POTHOLE",
    handling: "PERSISTENT",
    severity: "HIGH",
    confidence: 0.94,
    location: { lat: 28.5672, lng: 77.21, address: "Ring Road near AIIMS Flyover Northbound, New Delhi" },
    capturedAt: "2026-09-26T10:15:00Z",
    status: "NEW",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
    },
    model: "YOLOv8-RoadNet-v2.1",
    detectionCount: 14,
    detectedBy: ["BUS-101", "BUS-104", "BUS-112"],
    firstDetectedAt: "2026-09-24T08:30:00Z",
    lastDetectedAt: "2026-09-26T10:15:00Z"
  },
  {
    observationId: "EVT-2026-1002",
    busId: "BUS-105",
    category: "SAFETY",
    type: "VEHICLE_ACCIDENT",
    handling: "REAL_TIME",
    severity: "CRITICAL",
    confidence: 0.98,
    location: { lat: 28.6278, lng: 77.28, address: "Vikas Marg near Laxmi Nagar Metro Station, Delhi" },
    capturedAt: "2026-09-26T10:42:00Z",
    status: "NEW",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80"
    },
    model: "YOLOv8-SafetyVision-v3.0",
    detectionCount: 3,
    detectedBy: ["BUS-105", "BUS-107"],
    firstDetectedAt: "2026-09-26T10:40:00Z",
    lastDetectedAt: "2026-09-26T10:42:00Z"
  },
  {
    observationId: "EVT-2026-1003",
    busId: "BUS-102",
    category: "INFRASTRUCTURE",
    type: "WATERLOGGING",
    handling: "PERSISTENT",
    severity: "HIGH",
    confidence: 0.89,
    location: { lat: 28.6512, lng: 77.2311, address: "Underpass near Kashmiri Gate ISBT, Delhi" },
    capturedAt: "2026-09-26T09:50:00Z",
    status: "ACKNOWLEDGED",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80"
    },
    model: "DeepWater-SegNet-v1.4",
    detectionCount: 22,
    detectedBy: ["BUS-102", "BUS-108", "BUS-118"],
    firstDetectedAt: "2026-09-25T16:00:00Z",
    lastDetectedAt: "2026-09-26T09:50:00Z"
  },
  {
    observationId: "EVT-2026-1004",
    busId: "BUS-109",
    category: "TRAFFIC",
    type: "TRAFFIC_CONGESTION",
    handling: "REAL_TIME",
    severity: "MEDIUM",
    confidence: 0.91,
    location: { lat: 28.5491, lng: 77.2519, address: "Nehru Place Outer Ring Road Intersection, New Delhi" },
    capturedAt: "2026-09-26T10:35:00Z",
    status: "IN_PROGRESS",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80"
    },
    model: "FlowSense-Traffic-v2.0",
    detectionCount: 8,
    detectedBy: ["BUS-109", "BUS-104"],
    firstDetectedAt: "2026-09-26T10:10:00Z",
    lastDetectedAt: "2026-09-26T10:35:00Z"
  },
  {
    observationId: "EVT-2026-1005",
    busId: "BUS-103",
    category: "INFRASTRUCTURE",
    type: "STREETLIGHT_DEFECT",
    handling: "PERSISTENT",
    severity: "LOW",
    confidence: 0.86,
    location: { lat: 28.5244, lng: 77.1855, address: "Mehrauli-Badarpur Road Pole #MB-142, New Delhi" },
    capturedAt: "2026-09-25T21:10:00Z",
    status: "RESOLVED",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80"
    },
    model: "CityInfra-LightNet-v1.1",
    detectionCount: 5,
    detectedBy: ["BUS-103"],
    firstDetectedAt: "2026-09-24T20:00:00Z",
    lastDetectedAt: "2026-09-25T21:10:00Z"
  },
  {
    observationId: "EVT-2026-1006",
    busId: "BUS-111",
    category: "ROAD",
    type: "ROAD_CRACK",
    handling: "PERSISTENT",
    severity: "MEDIUM",
    confidence: 0.88,
    location: { lat: 28.5921, lng: 77.1611, address: "Dhaula Kuan Elevated Corridor Westbound, Delhi" },
    capturedAt: "2026-09-26T08:20:00Z",
    status: "NEW",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
    },
    model: "YOLOv8-RoadNet-v2.1",
    detectionCount: 9,
    detectedBy: ["BUS-111", "BUS-116"],
    firstDetectedAt: "2026-09-25T09:00:00Z",
    lastDetectedAt: "2026-09-26T08:20:00Z"
  },
  {
    observationId: "EVT-2026-1007",
    busId: "BUS-108",
    category: "SAFETY",
    type: "ILLEGAL_PARKING",
    handling: "REAL_TIME",
    severity: "MEDIUM",
    confidence: 0.95,
    location: { lat: 28.66, lng: 77.227, address: "Janpath Market Main Bus Stop Lane, New Delhi" },
    capturedAt: "2026-09-26T10:25:00Z",
    status: "NEW",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80"
    },
    model: "YOLOv8-SafetyVision-v3.0",
    detectionCount: 4,
    detectedBy: ["BUS-108"],
    firstDetectedAt: "2026-09-26T10:05:00Z",
    lastDetectedAt: "2026-09-26T10:25:00Z"
  },
  {
    observationId: "EVT-2026-1008",
    busId: "BUS-110",
    category: "INFRASTRUCTURE",
    type: "GARBAGE_DUMP",
    handling: "PERSISTENT",
    severity: "HIGH",
    confidence: 0.92,
    location: { lat: 28.539, lng: 77.1585, address: "Vasant Kunj Sec-B Roadside Waste Point, New Delhi" },
    capturedAt: "2026-09-26T07:45:00Z",
    status: "ACKNOWLEDGED",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80"
    },
    model: "CleanCity-WasteNet-v1.8",
    detectionCount: 18,
    detectedBy: ["BUS-110"],
    firstDetectedAt: "2026-09-23T11:00:00Z",
    lastDetectedAt: "2026-09-26T07:45:00Z"
  },
  {
    observationId: "EVT-2026-1009",
    busId: "BUS-112",
    category: "ROAD",
    type: "POTHOLE",
    handling: "PERSISTENT",
    severity: "CRITICAL",
    confidence: 0.97,
    location: { lat: 28.65, lng: 77.19, address: "Patel Nagar Main Road Near Metro Station, Delhi" },
    capturedAt: "2026-09-26T10:02:00Z",
    status: "IN_PROGRESS",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
    },
    model: "YOLOv8-RoadNet-v2.1",
    detectionCount: 31,
    detectedBy: ["BUS-112", "BUS-102", "BUS-114"],
    firstDetectedAt: "2026-09-22T07:15:00Z",
    lastDetectedAt: "2026-09-26T10:02:00Z"
  },
  {
    observationId: "EVT-2026-1010",
    busId: "BUS-115",
    category: "SAFETY",
    type: "STRAY_ANIMALS",
    handling: "REAL_TIME",
    severity: "HIGH",
    confidence: 0.89,
    location: { lat: 28.5695, lng: 77.241, address: "Lajpat Nagar Ring Road Junction, New Delhi" },
    capturedAt: "2026-09-26T10:30:00Z",
    status: "NEW",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80"
    },
    model: "YOLOv8-SafetyVision-v3.0",
    detectionCount: 2,
    detectedBy: ["BUS-115"],
    firstDetectedAt: "2026-09-26T10:28:00Z",
    lastDetectedAt: "2026-09-26T10:30:00Z"
  },
  {
    observationId: "EVT-2026-1011",
    busId: "BUS-117",
    category: "INFRASTRUCTURE",
    type: "DAMAGED_SIGNBOARD",
    handling: "PERSISTENT",
    severity: "LOW",
    confidence: 0.84,
    location: { lat: 28.5561, lng: 77.0991, address: "NH-48 Mahipalpur Expressway Exit Sign, Delhi" },
    capturedAt: "2026-09-25T14:15:00Z",
    status: "ACKNOWLEDGED",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80"
    },
    model: "CityInfra-LightNet-v1.1",
    detectionCount: 7,
    detectedBy: ["BUS-117", "BUS-105"],
    firstDetectedAt: "2026-09-24T12:00:00Z",
    lastDetectedAt: "2026-09-25T14:15:00Z"
  },
  {
    observationId: "EVT-2026-1012",
    busId: "BUS-106",
    category: "TRAFFIC",
    type: "BUS_LANE_OBSTRUCTION",
    handling: "REAL_TIME",
    severity: "HIGH",
    confidence: 0.93,
    location: { lat: 28.7041, lng: 77.1025, address: "Outer Ring Road Rohini Sector 18, Delhi" },
    capturedAt: "2026-09-26T10:18:00Z",
    status: "NEW",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80"
    },
    model: "FlowSense-Traffic-v2.0",
    detectionCount: 6,
    detectedBy: ["BUS-106"],
    firstDetectedAt: "2026-09-26T10:00:00Z",
    lastDetectedAt: "2026-09-26T10:18:00Z"
  },
  {
    observationId: "EVT-2026-1013",
    busId: "BUS-114",
    category: "ROAD",
    type: "POTHOLE",
    handling: "PERSISTENT",
    severity: "MEDIUM",
    confidence: 0.91,
    location: { lat: 28.6315, lng: 77.2195, address: "Connaught Place Outer Circle near Block M, New Delhi" },
    capturedAt: "2026-09-26T09:10:00Z",
    status: "ACKNOWLEDGED",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
    },
    model: "YOLOv8-RoadNet-v2.1",
    detectionCount: 11,
    detectedBy: ["BUS-114", "BUS-101"],
    firstDetectedAt: "2026-09-25T10:00:00Z",
    lastDetectedAt: "2026-09-26T09:10:00Z"
  },
  {
    observationId: "EVT-2026-1014",
    busId: "BUS-118",
    category: "SAFETY",
    type: "DEBRIS_ON_ROAD",
    handling: "REAL_TIME",
    severity: "HIGH",
    confidence: 0.87,
    location: { lat: 28.582, lng: 77.259, address: "Mathura Road Ashram Flyover Slope, New Delhi" },
    capturedAt: "2026-09-26T10:38:00Z",
    status: "NEW",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80"
    },
    model: "YOLOv8-SafetyVision-v3.0",
    detectionCount: 1,
    detectedBy: ["BUS-118"],
    firstDetectedAt: "2026-09-26T10:38:00Z",
    lastDetectedAt: "2026-09-26T10:38:00Z"
  },
  {
    observationId: "EVT-2026-1015",
    busId: "BUS-119",
    category: "INFRASTRUCTURE",
    type: "DRAIN_COVER_MISSING",
    handling: "PERSISTENT",
    severity: "CRITICAL",
    confidence: 0.96,
    location: { lat: 28.6291, lng: 77.242, address: "ITO Intersection Service Lane, New Delhi" },
    capturedAt: "2026-09-26T10:45:00Z",
    status: "NEW",
    evidence: {
      imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80"
    },
    model: "DeepWater-SegNet-v1.4",
    detectionCount: 16,
    detectedBy: ["BUS-119", "BUS-105", "BUS-107"],
    firstDetectedAt: "2026-09-24T18:20:00Z",
    lastDetectedAt: "2026-09-26T10:45:00Z"
  }
];

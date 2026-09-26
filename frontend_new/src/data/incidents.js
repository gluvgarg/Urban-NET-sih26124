// Safety & Incidents Data
// Handles Hit-and-Run, Rash Driving, Pedestrian Hazards, and Vehicle Tracking Trajectories

export const MOCK_INCIDENTS = [
  {
    id: "INC_00982",
    type: "Hit-and-Run Incident",
    busId: "BUS_17",
    location: "Inner Ring Road near AIIMS Flyover",
    latitude: 28.5672,
    longitude: 77.2100,
    timestamp: "2026-08-31 10:29:10",
    severity: "CRITICAL",
    confidence: 0.942,
    status: "Under Investigation",
    offendingVehicle: {
      registrationNo: "DL01AB1234",
      regConfidence: 0.917,
      makeModel: "Sedan (Black)",
      speedDetected: "84 km/h",
      firstDetected: "10:28:45",
      lastDetected: "10:29:40",
      direction: "North-West towards Dhaula Kuan",
      status: "Tracked across 3 Bus Sensors",
      trajectory: [
        { time: "10:28:45", lat: 28.5620, lng: 77.2150, speed: 72, sensor: "BUS_05 Camera 1" },
        { time: "10:29:10", lat: 28.5672, lng: 77.2100, speed: 84, sensor: "BUS_17 Camera 1 (Collision)" },
        { time: "10:29:32", lat: 28.5740, lng: 77.1980, speed: 89, sensor: "BUS_17 Camera 3 (Fleeing)" },
        { time: "10:29:55", lat: 28.5830, lng: 77.1810, speed: 81, sensor: "BUS_12 Camera 1 (Interception Alert)" }
      ]
    },
    evidenceImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80",
    description: "Black sedan struck non-motorized cyclist near AIIMS slip road. Bus BUS_17 Edge AI extracted license plate DL01AB1234 with 91.7% OCR confidence and transmitted tracking telemetry to Central Command."
  },
  {
    id: "INC_00981",
    type: "Rash & Dangerous Driving",
    busId: "BUS_42",
    location: "Nehru Place Flyover",
    latitude: 28.5492,
    longitude: 77.2510,
    timestamp: "2026-08-31 09:58:19",
    severity: "HIGH",
    confidence: 0.938,
    status: "Escalated to Traffic Police",
    offendingVehicle: {
      registrationNo: "HR26CE9988",
      regConfidence: 0.941,
      makeModel: "SUV (White)",
      speedDetected: "78 km/h",
      firstDetected: "09:57:30",
      lastDetected: "09:58:45",
      direction: "Eastbound towards Kalkaji",
      status: "Challan Issued",
      trajectory: [
        { time: "09:57:30", lat: 28.5450, lng: 77.2450, speed: 75, sensor: "BUS_42 Camera 1" },
        { time: "09:58:19", lat: 28.5492, lng: 77.2510, speed: 78, sensor: "BUS_42 Camera 2" }
      ]
    },
    evidenceImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80",
    description: "Vehicle weaving sharply across bus lanes without signaling."
  },
  {
    id: "INC_00980",
    type: "Vulnerable Pedestrian Hazard",
    busId: "BUS_15",
    location: "Subroto Park School Zone",
    latitude: 28.5830,
    longitude: 77.1550,
    timestamp: "2026-08-31 09:30:15",
    severity: "CRITICAL",
    confidence: 0.970,
    status: "Active Alert",
    offendingVehicle: null,
    evidenceImage: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80",
    description: "Group of school children crossing unlit highway segment due to broken pedestrian signal."
  }
];

export const SAFETY_STATS = {
  criticalIncidents: 12,
  hitAndRunCases: 3,
  rashDrivingAlerts: 18,
  pedestrianRiskAlerts: 7
};

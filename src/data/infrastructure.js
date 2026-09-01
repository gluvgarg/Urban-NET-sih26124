// Infrastructure Deficiencies Data
// Handles: Missing Road Dividers, Missing Zebra Crossings, Damaged/Missing Traffic Signboards

export const MOCK_INFRASTRUCTURE = [
  {
    id: "INF_9012",
    type: "Missing Road Divider",
    location: "NH-48 Expressway Segment B",
    latitude: 28.5910,
    longitude: 77.1850,
    busId: "BUS_07",
    confidence: 0.923,
    severity: "MEDIUM",
    detectedAt: "2026-08-31 10:17:12",
    status: "Assigned",
    assignedAuthority: "National Highways Authority Maintenance",
    evidenceImage: "https://images.unsplash.com/photo-1506521782020-18925f46c0be?w=600&auto=format&fit=crop&q=80",
    description: "Concrete jersey barrier divider section missing over 8 meters due to previous vehicle collision."
  },
  {
    id: "INF_9011",
    type: "Missing Zebra Crossing",
    location: "Connaught Place Outer Circle (Gate 3)",
    latitude: 28.6328,
    longitude: 77.2197,
    busId: "BUS_01",
    confidence: 0.895,
    severity: "MEDIUM",
    detectedAt: "2026-08-31 10:05:33",
    status: "Pending Inspection",
    assignedAuthority: "NDMC Traffic Engineering Cell",
    evidenceImage: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80",
    description: "Thermo-plastic road paint completely eroded. High pedestrian crossing volume."
  },
  {
    id: "INF_9010",
    type: "Damaged Signboard",
    location: "Janpath Road Crossing",
    latitude: 28.6210,
    longitude: 77.2150,
    busId: "BUS_09",
    confidence: 0.912,
    severity: "LOW",
    detectedAt: "2026-08-31 09:42:00",
    status: "Resolved",
    assignedAuthority: "Municipal Signage Division",
    evidenceImage: "https://images.unsplash.com/photo-1506521782020-18925f46c0be?w=600&auto=format&fit=crop&q=80",
    description: "Overhead direction signboard support post bent after storm winds."
  },
  {
    id: "INF_9009",
    type: "Missing Traffic Sign",
    location: "Subroto Park School Zone",
    latitude: 28.5830,
    longitude: 77.1550,
    busId: "BUS_15",
    confidence: 0.965,
    severity: "HIGH",
    detectedAt: "2026-08-31 09:12:40",
    status: "Action Required",
    assignedAuthority: "Delhi Traffic Police Safety Cell",
    evidenceImage: "https://images.unsplash.com/photo-1506521782020-18925f46c0be?w=600&auto=format&fit=crop&q=80",
    description: "'School Ahead - 20 km/h Speed Limit' sign post knocked down/stolen."
  }
];

export const INFRASTRUCTURE_STATS = {
  missingDividers: 14,
  missingZebraCrossings: 28,
  damagedSigns: 33,
  missingSigns: 19,
  totalDeficiencies: 94
};

const initSchema = require('./schema');
const getDb = require('./connection');

function seedDatabase() {
  console.log('[Seed] Initializing database schema...');
  initSchema();

  const db = getDb();

  // Clear existing tables
  db.exec(`
    DELETE FROM buses;
    DELETE FROM cameras;
    DELETE FROM events;
    DELETE FROM road_defects;
    DELETE FROM waterlogging;
    DELETE FROM infrastructure_issues;
    DELETE FROM traffic_observations;
    DELETE FROM incidents;
    DELETE FROM alerts;
  `);

  console.log('[Seed] Wiping old data...');

  const ROUTES = [
    { id: "Route 101", name: "Connaught Place → MG Road → Cyber Hub" },
    { id: "Route 204", name: "AIIMS → Dhaula Kuan → Airport T3" },
    { id: "Route 305", name: "Ring Road Express (Nehru Place → Lajpat Nagar)" },
    { id: "Route 402", name: "NH-48 Suburban Feeder (Mahipalpur → Sector 21)" },
    { id: "Route 509", name: "East-West Transit (Akshardham → Rajiv Chowk)" }
  ];

  // 1. Seed 50 Buses (42 ONLINE, 5 OFFLINE, 3 WARNING)
  const insertBus = db.prepare(`
    INSERT INTO buses (id, vehicleReg, routeId, routeName, status, latitude, longitude, speed, heading, cameraStatus, edgeAiHealth, network, cpuLoad, gpuUsage, eventsToday, driverName, lastSync, bandwidthSaved, firmwareVersion)
    VALUES (@id, @vehicleReg, @routeId, @routeName, @status, @latitude, @longitude, @speed, @heading, @cameraStatus, @edgeAiHealth, @network, @cpuLoad, @gpuUsage, @eventsToday, @driverName, @lastSync, @bandwidthSaved, @firmwareVersion)
  `);

  const insertCamera = db.prepare(`
    INSERT INTO cameras (id, busId, cameraType, status, lastStream)
    VALUES (?, ?, ?, ?, ?)
  `);

  const drivers = ['Ramesh Kumar', 'Suresh Kumar', 'Vikram Singh', 'Anil Sharma', 'Rajesh Verma', 'Praveen Yadav', 'Sunil Gupta'];

  for (let i = 0; i < 50; i++) {
    const busNum = String(i + 1).padStart(2, "0");
    const busId = `BUS_${busNum}`;
    const route = ROUTES[i % ROUTES.length];

    const latOffset = (Math.sin(i * 1.5) * 0.08) + ((i % 5) * 0.005 - 0.01);
    const lngOffset = (Math.cos(i * 1.3) * 0.09) + ((i % 7) * 0.005 - 0.01);
    const latitude = +(28.6139 + latOffset).toFixed(4);
    const longitude = +(77.2090 + lngOffset).toFixed(4);

    let status = "ONLINE";
    if (i === 11 || i === 24 || i === 38) status = "WARNING";
    if (i === 22 || i === 30 || i === 41 || i === 47 || i === 49) status = "OFFLINE";

    const cameraStatusObj = {
      front: status === "OFFLINE" ? "DISCONNECTED" : (i === 11 ? "DEGRADED" : "ACTIVE"),
      rear: status === "OFFLINE" ? "DISCONNECTED" : "ACTIVE",
      left: status === "OFFLINE" ? "DISCONNECTED" : (i === 24 ? "DIRTY_LENS" : "ACTIVE"),
      right: status === "OFFLINE" ? "DISCONNECTED" : "ACTIVE",
      cabin: status === "OFFLINE" ? "DISCONNECTED" : (i === 38 ? "DEGRADED" : "ACTIVE")
    };

    const edgeAiHealth = status === "OFFLINE" ? "OFFLINE" : (status === "WARNING" ? "DEGRADED" : "OPTIMAL");
    const network = status === "OFFLINE" ? "NO_SIGNAL" : (status === "WARNING" ? "4G_WEAK" : "5G_ACTIVE");
    const speed = status === "OFFLINE" ? 0 : Math.floor(18 + (i * 3) % 25);
    const eventsToday = status === "OFFLINE" ? Math.floor((i * 2) % 5) : Math.floor(15 + (i * 7) % 35);
    const cpuLoad = status === "OFFLINE" ? 0 : Math.floor(35 + (i * 4) % 45);
    const gpuUsage = status === "OFFLINE" ? 0 : Math.floor(48 + (i * 5) % 40);

    insertBus.run({
      id: busId,
      vehicleReg: `DL01PC${1000 + i}`,
      routeId: route.id,
      routeName: route.name,
      status,
      latitude,
      longitude,
      speed,
      heading: (i * 35) % 360,
      cameraStatus: JSON.stringify(cameraStatusObj),
      edgeAiHealth,
      network,
      cpuLoad,
      gpuUsage,
      eventsToday,
      driverName: drivers[i % drivers.length],
      lastSync: `${(i % 59)}s ago`,
      bandwidthSaved: "82.4%",
      firmwareVersion: "BEL-EDGE-AI-v4.2.1"
    });

    ['front', 'rear', 'left', 'right', 'cabin'].forEach(cam => {
      insertCamera.run(`CAM_${busId}_${cam}`, busId, cam, cameraStatusObj[cam], `${(i % 10)}s ago`);
    });
  }

  console.log('[Seed] 50 Buses & 250 Camera array inserted.');

  // 2. Seed Events
  const insertEvent = db.prepare(`
    INSERT INTO events (id, type, category, busId, location, latitude, longitude, timestamp, timeAgo, confidence, severity, status, description, evidenceImage, aiModel, metadata)
    VALUES (@id, @type, @category, @busId, @location, @latitude, @longitude, @timestamp, @timeAgo, @confidence, @severity, @status, @description, @evidenceImage, @aiModel, @metadata)
  `);

  const mockEvents = [
    {
      id: "EVT_001324",
      type: "POTHOLE",
      category: "ROAD_DEFECT",
      busId: "BUS_17",
      location: "MG Road, Sector 14",
      latitude: 28.6139,
      longitude: 77.2090,
      timestamp: "2026-08-31T10:31:24",
      timeAgo: "2 min ago",
      confidence: 0.964,
      severity: "HIGH",
      status: "Pending Maintenance",
      description: "Deep pothole detected on right lane of MG Road corridor near Sector 14 junction. High risk for two-wheelers.",
      evidenceImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "EVT_001323",
      type: "HIT_AND_RUN",
      category: "SAFETY_INCIDENT",
      busId: "BUS_17",
      location: "Inner Ring Road near AIIMS Flyover",
      latitude: 28.5672,
      longitude: 77.2100,
      timestamp: "2026-08-31T10:29:10",
      timeAgo: "4 min ago",
      confidence: 0.942,
      severity: "CRITICAL",
      status: "Under Investigation",
      description: "Offending vehicle struck a cyclist and fled north towards Dhaula Kuan at excessive speed (84 km/h).",
      evidenceImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "EVT_001322",
      type: "WATERLOGGING",
      category: "ROAD_DEFECT",
      busId: "BUS_12",
      location: "Sector 14 Underpass",
      latitude: 28.6250,
      longitude: 77.2180,
      timestamp: "2026-08-31T10:23:45",
      timeAgo: "10 min ago",
      confidence: 0.981,
      severity: "HIGH",
      status: "Pending Maintenance",
      description: "Substantial water accumulation (approx 25cm depth) detected covering left two lanes. Traffic slowdown observed.",
      evidenceImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "EVT_test_001321",
      type: "MISSING_DIVIDER",
      category: "INFRASTRUCTURE",
      busId: "BUS_07",
      location: "NH-48 Expressway Segment B",
      latitude: 28.5910,
      longitude: 77.1850,
      timestamp: "2026-08-31T10:17:12",
      timeAgo: "16 min ago",
      confidence: 0.923,
      severity: "MEDIUM",
      status: "Assigned",
      description: "Concrete jersey barrier divider section missing/broken over 8 meters. Creates head-on collision risk.",
      evidenceImage: "https://images.unsplash.com/photo-1506521782020-18925f46c0be?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "EVT_001320",
      type: "TRAFFIC_BOTTLENECK",
      category: "TRAFFIC",
      busId: "BUS_31",
      location: "Dhaula Kuan Intersection",
      latitude: 28.5921,
      longitude: 77.1612,
      timestamp: "2026-08-31T10:12:00",
      timeAgo: "21 min ago",
      confidence: 0.955,
      severity: "HIGH",
      status: "Active Alert",
      description: "Average speed dropped to 8 km/h. Queue length > 600m on Southbound approach.",
      evidenceImage: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "EVT_001319",
      type: "MISSING_ZEBRA_CROSSING",
      category: "INFRASTRUCTURE",
      busId: "BUS_01",
      location: "Connaught Place Outer Circle",
      latitude: 28.6328,
      longitude: 77.2197,
      timestamp: "2026-08-31T10:05:33",
      timeAgo: "28 min ago",
      confidence: 0.895,
      severity: "MEDIUM",
      status: "Pending Maintenance",
      description: "Pedestrian zebra crossing paint severely faded/worn out near Metro Gate 3.",
      evidenceImage: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80"
    }
  ];

  mockEvents.forEach(evt => {
    insertEvent.run({ ...evt, aiModel: 'YOLOv8-BEL-Edge', metadata: '{}' });
  });

  console.log('[Seed] Mock Events inserted.');

  // 3. Seed Road Defects
  const insertDefect = db.prepare(`
    INSERT INTO road_defects (id, type, location, latitude, longitude, busId, confidence, severity, detectedAt, status, assignedTo, estimatedCost, workOrder, evidenceImage, description, detectionCount, firstDetectedAt, lastDetectedAt)
    VALUES (@id, @type, @location, @latitude, @longitude, @busId, @confidence, @severity, @detectedAt, @status, @assignedTo, @estimatedCost, @workOrder, @evidenceImage, @description, @detectionCount, @firstDetectedAt, @lastDetectedAt)
  `);

  const mockDefects = [
    {
      id: "DEF_2026_0891",
      type: "Pothole",
      location: "MG Road, Sector 14",
      latitude: 28.6139,
      longitude: 77.2090,
      busId: "BUS_17",
      confidence: 0.964,
      severity: "HIGH",
      detectedAt: "2026-08-31 10:31:24",
      status: "Detected",
      assignedTo: "Unassigned",
      estimatedCost: "₹14,500",
      workOrder: "WO-PENDING",
      evidenceImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      description: "Severe pothole (45cm x 60cm, depth 12cm) in primary bus corridor.",
      detectionCount: 3,
      firstDetectedAt: "2026-08-31 08:15:00",
      lastDetectedAt: "2026-08-31 10:31:24"
    },
    {
      id: "DEF_2026_0889",
      type: "Damaged Road",
      location: "Mahipalpur Bypass",
      latitude: 28.5410,
      longitude: 77.1290,
      busId: "BUS_23",
      confidence: 0.908,
      severity: "MEDIUM",
      detectedAt: "2026-08-31 09:15:40",
      status: "In Progress",
      assignedTo: "South District Paving Crew B",
      estimatedCost: "₹85,000",
      workOrder: "WO-2026-4392",
      evidenceImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      description: "Surface crumbling and bitumen stripping over 15m stretch.",
      detectionCount: 1,
      firstDetectedAt: "2026-08-31 09:15:40",
      lastDetectedAt: "2026-08-31 09:15:40"
    },
    {
      id: "DEF_2026_0888",
      type: "Pothole",
      location: "Ring Road near Lajpat Nagar",
      latitude: 28.5680,
      longitude: 77.2410,
      busId: "BUS_05",
      confidence: 0.932,
      severity: "CRITICAL",
      detectedAt: "2026-08-31 08:45:10",
      status: "Assigned",
      assignedTo: "Central Division Maintenance",
      estimatedCost: "₹18,000",
      workOrder: "WO-2026-4389",
      evidenceImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      description: "Deep edge crater near bus stop bay causing severe vehicular sway.",
      detectionCount: 2,
      firstDetectedAt: "2026-08-31 07:30:00",
      lastDetectedAt: "2026-08-31 08:45:10"
    }
  ];

  mockDefects.forEach(def => insertDefect.run(def));

  // 4. Seed Waterlogging
  const insertWaterlogging = db.prepare(`
    INSERT INTO waterlogging (id, location, latitude, longitude, busId, waterDepthCm, confidence, severity, status, assignedTo, evidenceImage, description, detectionCount, firstDetectedAt, lastDetectedAt)
    VALUES (@id, @location, @latitude, @longitude, @busId, @waterDepthCm, @confidence, @severity, @status, @assignedTo, @evidenceImage, @description, @detectionCount, @firstDetectedAt, @lastDetectedAt)
  `);

  const mockWaterlogging = [
    {
      id: "DEF_2026_0890",
      location: "Sector 14 Underpass",
      latitude: 28.6250,
      longitude: 77.2180,
      busId: "BUS_12",
      waterDepthCm: 25,
      confidence: 0.981,
      severity: "HIGH",
      status: "Assigned",
      assignedTo: "Drainage Rapid Response Team 3",
      evidenceImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80",
      description: "Stormwater pump failure causing 25cm deep puddle across two traffic lanes.",
      detectionCount: 4,
      firstDetectedAt: "2026-08-31 08:00:00",
      lastDetectedAt: "2026-08-31 10:23:45"
    },
    {
      id: "DEF_2026_0887",
      location: "Dhaula Kuan Junction East",
      latitude: 28.5915,
      longitude: 77.1625,
      busId: "BUS_31",
      waterDepthCm: 15,
      confidence: 0.954,
      severity: "MEDIUM",
      status: "Resolved",
      assignedTo: "PWD Municipal Drain Crew",
      evidenceImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80",
      description: "Clogged stormwater inlet cleared by municipal team. Road now dry.",
      detectionCount: 2,
      firstDetectedAt: "2026-08-31 06:30:00",
      lastDetectedAt: "2026-08-31 07:55:00"
    }
  ];

  mockWaterlogging.forEach(w => insertWaterlogging.run(w));

  // 5. Seed Infrastructure Issues
  const insertInfra = db.prepare(`
    INSERT INTO infrastructure_issues (id, type, location, latitude, longitude, busId, confidence, severity, detectedAt, status, assignedAuthority, evidenceImage, description, detectionCount, firstDetectedAt, lastDetectedAt)
    VALUES (@id, @type, @location, @latitude, @longitude, @busId, @confidence, @severity, @detectedAt, @status, @assignedAuthority, @evidenceImage, @description, @detectionCount, @firstDetectedAt, @lastDetectedAt)
  `);

  const mockInfra = [
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
      description: "Concrete jersey barrier divider section missing over 8 meters due to previous vehicle collision.",
      detectionCount: 2,
      firstDetectedAt: "2026-08-31 08:00:00",
      lastDetectedAt: "2026-08-31 10:17:12"
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
      description: "Thermo-plastic road paint completely eroded. High pedestrian crossing volume.",
      detectionCount: 1,
      firstDetectedAt: "2026-08-31 10:05:33",
      lastDetectedAt: "2026-08-31 10:05:33"
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
      description: "'School Ahead - 20 km/h Speed Limit' sign post knocked down/stolen.",
      detectionCount: 1,
      firstDetectedAt: "2026-08-31 09:12:40",
      lastDetectedAt: "2026-08-31 09:12:40"
    }
  ];

  mockInfra.forEach(inf => insertInfra.run(inf));

  // 6. Seed Traffic Observations
  const insertTraffic = db.prepare(`
    INSERT INTO traffic_observations (id, zone, trafficLevel, trafficIndex, avgSpeed, vehicleCount, trend, status, timestamp)
    VALUES (@id, @zone, @trafficLevel, @trafficIndex, @avgSpeed, @vehicleCount, @trend, @status, @timestamp)
  `);

  const mockTraffic = [
    {
      id: "TRF_01",
      zone: "Dhaula Kuan Intersection",
      trafficLevel: "CRITICAL",
      trafficIndex: 88,
      avgSpeed: "9 km/h",
      vehicleCount: 3420,
      trend: "+18%",
      status: "Severe Jam",
      timestamp: "2026-08-31 10:30:00"
    },
    {
      id: "TRF_02",
      zone: "MG Road - Sector 14 Node",
      trafficLevel: "HIGH",
      trafficIndex: 76,
      avgSpeed: "14 km/h",
      vehicleCount: 2890,
      trend: "+12%",
      status: "Congested",
      timestamp: "2026-08-31 10:30:00"
    },
    {
      id: "TRF_03",
      zone: "AIIMS Flyover Ring Road",
      trafficLevel: "HIGH",
      trafficIndex: 74,
      avgSpeed: "16 km/h",
      vehicleCount: 2650,
      trend: "+5%",
      status: "Congested",
      timestamp: "2026-08-31 10:30:00"
    }
  ];

  mockTraffic.forEach(t => insertTraffic.run(t));

  // 7. Seed Incidents
  const insertIncident = db.prepare(`
    INSERT INTO incidents (id, type, busId, location, latitude, longitude, timestamp, severity, confidence, status, offendingVehicleReg, offendingVehicleDetails, evidenceImage, description)
    VALUES (@id, @type, @busId, @location, @latitude, @longitude, @timestamp, @severity, @confidence, @status, @offendingVehicleReg, @offendingVehicleDetails, @evidenceImage, @description)
  `);

  const hitAndRunData = {
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
  };

  const rashData = {
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
  };

  const mockIncidents = [
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
      offendingVehicleReg: "DL01AB1234",
      offendingVehicleDetails: JSON.stringify(hitAndRunData),
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
      offendingVehicleReg: "HR26CE9988",
      offendingVehicleDetails: JSON.stringify(rashData),
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
      offendingVehicleReg: null,
      offendingVehicleDetails: null,
      evidenceImage: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80",
      description: "Group of school children crossing unlit highway segment due to broken pedestrian signal."
    }
  ];

  mockIncidents.forEach(inc => insertIncident.run(inc));

  // 8. Seed Alerts
  const insertAlert = db.prepare(`
    INSERT INTO alerts (id, eventId, title, severity, category, message, status, timestamp)
    VALUES (@id, @eventId, @title, @severity, @category, @message, @status, @timestamp)
  `);

  const mockAlerts = [
    {
      id: "ALT_001",
      eventId: "EVT_001323",
      title: "CRITICAL ALERT: Hit-and-Run Incident",
      severity: "CRITICAL",
      category: "SAFETY_INCIDENT",
      message: "Black sedan DL01AB1234 fled AIIMS slip road after collision. Trajectory active.",
      status: "ACTIVE",
      timestamp: "2026-08-31 10:29:10"
    },
    {
      id: "ALT_002",
      eventId: "EVT_001324",
      title: "HIGH SEVERITY: Pothole Cluster MG Road",
      severity: "HIGH",
      category: "ROAD_DEFECT",
      message: "Severe pothole (12cm depth) detected on MG Road Sector 14 node.",
      status: "ACTIVE",
      timestamp: "2026-08-31 10:31:24"
    }
  ];

  mockAlerts.forEach(alt => insertAlert.run(alt));

  console.log('[Seed] Database seeding completed successfully!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

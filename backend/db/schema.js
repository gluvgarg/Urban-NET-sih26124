const getDb = require('./connection');

function initSchema() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS buses (
      id TEXT PRIMARY KEY,
      vehicleReg TEXT NOT NULL,
      routeId TEXT NOT NULL,
      routeName TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ONLINE',
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      speed INTEGER NOT NULL DEFAULT 0,
      heading INTEGER NOT NULL DEFAULT 0,
      cameraStatus TEXT NOT NULL,
      edgeAiHealth TEXT NOT NULL DEFAULT 'OPTIMAL',
      network TEXT NOT NULL DEFAULT '5G_ACTIVE',
      cpuLoad INTEGER NOT NULL DEFAULT 0,
      gpuUsage INTEGER NOT NULL DEFAULT 0,
      eventsToday INTEGER NOT NULL DEFAULT 0,
      driverName TEXT NOT NULL,
      lastSync TEXT NOT NULL,
      bandwidthSaved TEXT NOT NULL DEFAULT '82.4%',
      firmwareVersion TEXT NOT NULL DEFAULT 'BEL-EDGE-AI-v4.2.1',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cameras (
      id TEXT PRIMARY KEY,
      busId TEXT NOT NULL,
      cameraType TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      lastStream TEXT,
      FOREIGN KEY (busId) REFERENCES buses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      busId TEXT NOT NULL,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp TEXT NOT NULL,
      timeAgo TEXT,
      confidence REAL NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      description TEXT,
      evidenceImage TEXT,
      aiModel TEXT DEFAULT 'YOLOv8-BEL-Edge',
      metadata TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS road_defects (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      busId TEXT NOT NULL,
      confidence REAL NOT NULL,
      severity TEXT NOT NULL,
      detectedAt TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Detected',
      assignedTo TEXT DEFAULT 'Unassigned',
      estimatedCost TEXT DEFAULT '₹15,000',
      workOrder TEXT DEFAULT 'WO-PENDING',
      evidenceImage TEXT,
      description TEXT,
      detectionCount INTEGER NOT NULL DEFAULT 1,
      firstDetectedAt TEXT,
      lastDetectedAt TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS waterlogging (
      id TEXT PRIMARY KEY,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      busId TEXT NOT NULL,
      waterDepthCm INTEGER DEFAULT 20,
      confidence REAL NOT NULL,
      severity TEXT NOT NULL DEFAULT 'HIGH',
      status TEXT NOT NULL DEFAULT 'Detected',
      assignedTo TEXT DEFAULT 'Drainage Response Unit',
      evidenceImage TEXT,
      description TEXT,
      detectionCount INTEGER NOT NULL DEFAULT 1,
      firstDetectedAt TEXT,
      lastDetectedAt TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS infrastructure_issues (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      busId TEXT NOT NULL,
      confidence REAL NOT NULL,
      severity TEXT NOT NULL,
      detectedAt TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Assigned',
      assignedAuthority TEXT NOT NULL,
      evidenceImage TEXT,
      description TEXT,
      detectionCount INTEGER NOT NULL DEFAULT 1,
      firstDetectedAt TEXT,
      lastDetectedAt TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS traffic_observations (
      id TEXT PRIMARY KEY,
      zone TEXT NOT NULL,
      trafficLevel TEXT NOT NULL,
      trafficIndex INTEGER NOT NULL,
      avgSpeed TEXT NOT NULL,
      vehicleCount INTEGER NOT NULL,
      trend TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      busId TEXT NOT NULL,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp TEXT NOT NULL,
      severity TEXT NOT NULL,
      confidence REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Under Investigation',
      offendingVehicleReg TEXT,
      offendingVehicleDetails TEXT,
      evidenceImage TEXT,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      eventId TEXT,
      title TEXT NOT NULL,
      severity TEXT NOT NULL,
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      timestamp TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('[DB] Schema initialized successfully.');
}

module.exports = initSchema;

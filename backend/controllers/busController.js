const getDb = require('../db/connection');

function getBuses(req, res) {
  const db = getDb();
  const buses = db.prepare(`SELECT * FROM buses`).all();
  
  const parsed = buses.map(bus => ({
    ...bus,
    cameraStatus: typeof bus.cameraStatus === 'string' ? JSON.parse(bus.cameraStatus) : bus.cameraStatus
  }));

  res.json({
    success: true,
    total: parsed.length,
    buses: parsed
  });
}

function getBusById(req, res) {
  const db = getDb();
  const bus = db.prepare(`SELECT * FROM buses WHERE id = ?`).get(req.params.id);

  if (!bus) {
    return res.status(404).json({ success: false, message: 'Bus not found' });
  }

  bus.cameraStatus = typeof bus.cameraStatus === 'string' ? JSON.parse(bus.cameraStatus) : bus.cameraStatus;
  
  const cameras = db.prepare(`SELECT * FROM cameras WHERE busId = ?`).all(req.params.id);
  const events = db.prepare(`SELECT * FROM events WHERE busId = ? ORDER BY id DESC LIMIT 10`).all(req.params.id);

  res.json({
    success: true,
    bus: {
      ...bus,
      cameras,
      recentEvents: events
    }
  });
}

function getBusTelemetry(req, res) {
  const db = getDb();
  const bus = db.prepare(`SELECT * FROM buses WHERE id = ?`).get(req.params.id);

  if (!bus) {
    return res.status(404).json({ success: false, message: 'Bus not found' });
  }

  res.json({
    success: true,
    telemetry: {
      busId: bus.id,
      edgeAiHealth: bus.edgeAiHealth,
      network: bus.network,
      cpuLoad: bus.cpuLoad,
      gpuUsage: bus.gpuUsage,
      speed: bus.speed,
      eventsToday: bus.eventsToday,
      bandwidthSaved: bus.bandwidthSaved,
      lastSync: bus.lastSync,
      firmwareVersion: bus.firmwareVersion
    }
  });
}

module.exports = {
  getBuses,
  getBusById,
  getBusTelemetry
};

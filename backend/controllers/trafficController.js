const getDb = require('../db/connection');

function getCurrentTraffic(req, res) {
  const db = getDb();
  const observations = db.prepare(`SELECT * FROM traffic_observations ORDER BY id DESC`).all();

  res.json({
    success: true,
    summary: {
      vehiclesDetectedToday: 18420,
      trafficIndex: 72,
      congestedZonesCount: observations.length,
      avgFleetSpeed: '31 km/h'
    },
    observations
  });
}

function getTrafficObservations(req, res) {
  const db = getDb();
  const observations = db.prepare(`SELECT * FROM traffic_observations ORDER BY id DESC`).all();

  res.json({
    success: true,
    total: observations.length,
    observations
  });
}

function getCongestion(req, res) {
  const db = getDb();
  const congestedZones = db.prepare(`SELECT * FROM traffic_observations WHERE trafficLevel IN ('HIGH', 'CRITICAL') ORDER BY trafficIndex DESC`).all();

  res.json({
    success: true,
    total: congestedZones.length,
    congestedZones
  });
}

module.exports = {
  getCurrentTraffic,
  getTrafficObservations,
  getCongestion
};

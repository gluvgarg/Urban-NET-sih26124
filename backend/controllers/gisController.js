const getDb = require('../db/connection');

function getMapEvents(req, res) {
  const db = getDb();
  const buses = db.prepare(`SELECT id, latitude, longitude, status, speed, routeId FROM buses`).all();
  const defects = db.prepare(`SELECT id, type, location, latitude, longitude, confidence, severity, status FROM road_defects`).all();
  const waterlogging = db.prepare(`SELECT id, location, latitude, longitude, confidence, severity, status FROM waterlogging`).all();
  const infrastructure = db.prepare(`SELECT id, type, location, latitude, longitude, confidence, severity, status FROM infrastructure_issues`).all();
  const incidents = db.prepare(`SELECT id, type, location, latitude, longitude, confidence, severity, status FROM incidents`).all();

  res.json({
    success: true,
    mapData: {
      buses,
      defects,
      waterlogging,
      infrastructure,
      incidents
    }
  });
}

module.exports = {
  getMapEvents
};

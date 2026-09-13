const config = require('../config');
const getDb = require('../db/connection');

/**
 * Calculate distance in meters between two (lat, lon) coordinates using Haversine formula
 */
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find existing defect nearby within threshold radius
 * @param {string} table Name of table ('road_defects', 'waterlogging', 'infrastructure_issues')
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @param {string} defectType Type of defect (e.g. 'Pothole')
 * @param {number} radiusMeters Radius in meters (default 30m)
 */
function findNearbyDefect(table, lat, lon, defectType = null, radiusMeters = config.geoDeduplicationRadiusMeters) {
  const db = getDb();
  let records;
  
  if (table === 'waterlogging') {
    records = db.prepare(`SELECT * FROM waterlogging WHERE status != 'Resolved'`).all();
  } else if (table === 'infrastructure_issues') {
    if (defectType) {
      records = db.prepare(`SELECT * FROM infrastructure_issues WHERE type = ? AND status != 'Resolved'`).all(defectType);
    } else {
      records = db.prepare(`SELECT * FROM infrastructure_issues WHERE status != 'Resolved'`).all();
    }
  } else {
    // road_defects
    if (defectType) {
      records = db.prepare(`SELECT * FROM road_defects WHERE type = ? AND status != 'Resolved'`).all(defectType);
    } else {
      records = db.prepare(`SELECT * FROM road_defects WHERE status != 'Resolved'`).all();
    }
  }

  for (const record of records) {
    const dist = calculateDistanceMeters(lat, lon, record.latitude, record.longitude);
    if (dist <= radiusMeters) {
      return { existing: record, distanceMeters: dist };
    }
  }

  return null;
}

module.exports = {
  calculateDistanceMeters,
  findNearbyDefect
};

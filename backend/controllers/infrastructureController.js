const getDb = require('../db/connection');

function getInfrastructure(req, res) {
  const db = getDb();
  const issues = db.prepare(`SELECT * FROM infrastructure_issues ORDER BY id DESC`).all();

  const missingDividers = issues.filter(i => i.type.toLowerCase().includes('divider')).length;
  const missingZebraCrossings = issues.filter(i => i.type.toLowerCase().includes('zebra')).length;
  const damagedSigns = issues.filter(i => i.type.toLowerCase().includes('sign')).length;

  res.json({
    success: true,
    stats: {
      totalDeficiencies: issues.length,
      missingDividers,
      missingZebraCrossings,
      damagedSigns
    },
    infrastructure: issues
  });
}

function getFootpaths(req, res) {
  const db = getDb();
  const footpaths = db.prepare(`SELECT * FROM infrastructure_issues WHERE type LIKE '%Footpath%' OR type LIKE '%Pedestrian%' ORDER BY id DESC`).all();

  res.json({
    success: true,
    total: footpaths.length,
    footpaths
  });
}

module.exports = {
  getInfrastructure,
  getFootpaths
};

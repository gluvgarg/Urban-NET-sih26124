const getDb = require('../db/connection');

function getRoadConditions(req, res) {
  const db = getDb();
  const roadDefects = db.prepare(`SELECT * FROM road_defects ORDER BY id DESC`).all();
  const waterlogging = db.prepare(`SELECT * FROM waterlogging ORDER BY id DESC`).all();

  res.json({
    success: true,
    stats: {
      totalIssues: roadDefects.length + waterlogging.length,
      potholes: roadDefects.filter(d => d.type === 'Pothole').length,
      waterlogging: waterlogging.length,
      resolvedToday: roadDefects.filter(d => d.status === 'Resolved').length + waterlogging.filter(w => w.status === 'Resolved').length
    },
    roadDefects,
    waterlogging
  });
}

function getPotholes(req, res) {
  const db = getDb();
  const potholes = db.prepare(`SELECT * FROM road_defects WHERE type = 'Pothole' ORDER BY id DESC`).all();

  res.json({
    success: true,
    total: potholes.length,
    potholes
  });
}

function getWaterlogging(req, res) {
  const db = getDb();
  const records = db.prepare(`SELECT * FROM waterlogging ORDER BY id DESC`).all();

  res.json({
    success: true,
    total: records.length,
    waterlogging: records
  });
}

function updateDefectStatus(req, res) {
  const db = getDb();
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  // Check in road_defects first
  let defect = db.prepare(`SELECT * FROM road_defects WHERE id = ?`).get(id);
  let table = 'road_defects';

  if (!defect) {
    defect = db.prepare(`SELECT * FROM waterlogging WHERE id = ?`).get(id);
    table = 'waterlogging';
  }

  if (!defect) {
    return res.status(404).json({ success: false, message: 'Defect record not found' });
  }

  const assigned = assignedTo || defect.assignedTo || 'Municipal Maintenance Crew';
  db.prepare(`UPDATE ${table} SET status = ?, assignedTo = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`).run(status, assigned, id);

  const updated = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);

  res.json({
    success: true,
    message: `Defect status updated to ${status}`,
    defect: updated
  });
}

module.exports = {
  getRoadConditions,
  getPotholes,
  getWaterlogging,
  updateDefectStatus
};

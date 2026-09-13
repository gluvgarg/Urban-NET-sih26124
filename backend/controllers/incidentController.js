const getDb = require('../db/connection');

function getIncidents(req, res) {
  const db = getDb();
  const rawIncidents = db.prepare(`SELECT * FROM incidents ORDER BY id DESC`).all();

  const incidents = rawIncidents.map(inc => {
    let offendingVehicle = null;
    if (inc.offendingVehicleDetails) {
      try {
        offendingVehicle = JSON.parse(inc.offendingVehicleDetails);
      } catch (e) {
        offendingVehicle = null;
      }
    } else if (inc.offendingVehicleReg) {
      offendingVehicle = { registrationNo: inc.offendingVehicleReg };
    }

    return {
      ...inc,
      offendingVehicle
    };
  });

  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL').length;
  const hitAndRunCases = incidents.filter(i => i.type.toLowerCase().includes('hit') || i.type.toLowerCase().includes('run')).length;
  const rashDrivingAlerts = incidents.filter(i => i.type.toLowerCase().includes('rash')).length;
  const pedestrianRiskAlerts = incidents.filter(i => i.type.toLowerCase().includes('pedestrian')).length;

  res.json({
    success: true,
    stats: {
      criticalIncidents,
      hitAndRunCases,
      rashDrivingAlerts,
      pedestrianRiskAlerts
    },
    incidents
  });
}

function getIncidentById(req, res) {
  const db = getDb();
  const inc = db.prepare(`SELECT * FROM incidents WHERE id = ?`).get(req.params.id);

  if (!inc) {
    return res.status(404).json({ success: false, message: 'Incident not found' });
  }

  let offendingVehicle = null;
  if (inc.offendingVehicleDetails) {
    try {
      offendingVehicle = JSON.parse(inc.offendingVehicleDetails);
    } catch (e) {
      offendingVehicle = null;
    }
  }

  res.json({
    success: true,
    incident: {
      ...inc,
      offendingVehicle
    }
  });
}

function updateIncidentStatus(req, res) {
  const db = getDb();
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const inc = db.prepare(`SELECT * FROM incidents WHERE id = ?`).get(id);
  if (!inc) {
    return res.status(404).json({ success: false, message: 'Incident not found' });
  }

  db.prepare(`UPDATE incidents SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`).run(status, id);

  res.json({
    success: true,
    message: `Incident ${id} status updated to '${status}'`
  });
}

module.exports = {
  getIncidents,
  getIncidentById,
  updateIncidentStatus
};

const getDb = require('../db/connection');

function getDashboardOverview(req, res) {
  const db = getDb();

  const totalBuses = db.prepare(`SELECT COUNT(*) as count FROM buses`).get().count;
  const activeBuses = db.prepare(`SELECT COUNT(*) as count FROM buses WHERE status = 'ONLINE'`).get().count;
  const eventsTotal = db.prepare(`SELECT COUNT(*) as count FROM events`).get().count;
  const roadDefectsTotal = db.prepare(`SELECT COUNT(*) as count FROM road_defects`).get().count;
  const potholesTotal = db.prepare(`SELECT COUNT(*) as count FROM road_defects WHERE type = 'Pothole'`).get().count;
  const waterloggingTotal = db.prepare(`SELECT COUNT(*) as count FROM waterlogging`).get().count;
  const infrastructureTotal = db.prepare(`SELECT COUNT(*) as count FROM infrastructure_issues`).get().count;
  const criticalIncidents = db.prepare(`SELECT COUNT(*) as count FROM incidents WHERE severity = 'CRITICAL'`).get().count;

  const recentEvents = db.prepare(`SELECT * FROM events ORDER BY id DESC LIMIT 10`).all();
  const alerts = db.prepare(`SELECT * FROM alerts ORDER BY id DESC LIMIT 5`).all();

  res.json({
    success: true,
    summary: {
      totalBuses,
      activeBuses,
      offlineBuses: totalBuses - activeBuses,
      eventsTotal,
      roadDefectsTotal,
      potholesTotal,
      waterloggingTotal,
      infrastructureTotal,
      criticalIncidents,
      bandwidthSaved: '82.4%'
    },
    recentEvents,
    alerts
  });
}

module.exports = {
  getDashboardOverview
};

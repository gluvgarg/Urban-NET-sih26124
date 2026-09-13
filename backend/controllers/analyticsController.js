const getDb = require('../db/connection');

function getAnalyticsSummary(req, res) {
  const db = getDb();
  
  const totalEvents = db.prepare(`SELECT COUNT(*) as count FROM events`).get().count;
  const totalDefects = db.prepare(`SELECT COUNT(*) as count FROM road_defects`).get().count;
  const totalWaterlogging = db.prepare(`SELECT COUNT(*) as count FROM waterlogging`).get().count;
  const totalInfra = db.prepare(`SELECT COUNT(*) as count FROM infrastructure_issues`).get().count;
  const totalIncidents = db.prepare(`SELECT COUNT(*) as count FROM incidents`).get().count;

  res.json({
    success: true,
    summary: {
      totalEvents,
      totalDefects,
      totalWaterlogging,
      totalInfra,
      totalIncidents,
      estimatedBandwidthSaved: '82.4%'
    }
  });
}

function getEventsByType(req, res) {
  const db = getDb();
  const rows = db.prepare(`SELECT type, category, COUNT(*) as count FROM events GROUP BY type, category`).all();

  res.json({
    success: true,
    eventsByType: rows
  });
}

function getEventsByDay(req, res) {
  const weeklyTrend = [
    { day: 'Mon', potholes: 12, waterlogging: 4, infrastructure: 8 },
    { day: 'Tue', potholes: 18, waterlogging: 7, infrastructure: 11 },
    { day: 'Wed', potholes: 15, waterlogging: 5, infrastructure: 9 },
    { day: 'Thu', potholes: 22, waterlogging: 9, infrastructure: 14 },
    { day: 'Fri', potholes: 28, waterlogging: 12, infrastructure: 18 },
    { day: 'Sat', potholes: 19, waterlogging: 6, infrastructure: 10 },
    { day: 'Sun', potholes: 14, waterlogging: 3, infrastructure: 7 }
  ];

  res.json({
    success: true,
    weeklyTrend
  });
}

function getBusPerformance(req, res) {
  const leaderboard = [
    { busId: 'BUS_17', route: 'Route 101', eventsLogged: 42, defectsCount: 18, incidentsLogged: 3, uptime: '99.8%' },
    { busId: 'BUS_12', route: 'Route 204', eventsLogged: 38, defectsCount: 14, incidentsLogged: 2, uptime: '99.4%' },
    { busId: 'BUS_31', route: 'Route 101', eventsLogged: 35, defectsCount: 12, incidentsLogged: 1, uptime: '98.9%' },
    { busId: 'BUS_07', route: 'Route 402', eventsLogged: 31, defectsCount: 11, incidentsLogged: 1, uptime: '97.5%' },
    { busId: 'BUS_01', route: 'Route 509', eventsLogged: 29, defectsCount: 9, incidentsLogged: 0, uptime: '99.1%' }
  ];

  res.json({
    success: true,
    leaderboard
  });
}

function getCongestionAnalytics(req, res) {
  const hourlyTrend = [
    { time: '06:00', volume: 2400, speed: 48, densityIndex: 28 },
    { time: '07:00', volume: 4800, speed: 38, densityIndex: 45 },
    { time: '08:00', volume: 8900, speed: 24, densityIndex: 68 },
    { time: '09:00', volume: 14200, speed: 18, densityIndex: 84 },
    { time: '10:00', volume: 18420, speed: 14, densityIndex: 88 },
    { time: '11:00', volume: 16100, speed: 20, densityIndex: 76 },
    { time: '12:00', volume: 13500, speed: 26, densityIndex: 62 },
    { time: '13:00', volume: 12800, speed: 29, densityIndex: 58 },
    { time: '14:00', volume: 13900, speed: 25, densityIndex: 64 },
    { time: '15:00', volume: 15400, speed: 22, densityIndex: 71 },
    { time: '16:00', volume: 17200, speed: 17, densityIndex: 82 },
    { time: '17:00', volume: 19100, speed: 12, densityIndex: 92 }
  ];

  res.json({
    success: true,
    hourlyTrend
  });
}

module.exports = {
  getAnalyticsSummary,
  getEventsByType,
  getEventsByDay,
  getBusPerformance,
  getCongestionAnalytics
};

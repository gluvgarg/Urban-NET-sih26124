const getDb = require('../db/connection');

function getEvents(req, res) {
  const db = getDb();
  const { category, severity, busId, limit } = req.query;

  let query = `SELECT * FROM events WHERE 1=1`;
  const params = [];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }
  if (severity) {
    query += ` AND severity = ?`;
    params.push(severity);
  }
  if (busId) {
    query += ` AND busId = ?`;
    params.push(busId);
  }

  query += ` ORDER BY id DESC`;

  if (limit) {
    query += ` LIMIT ?`;
    params.push(parseInt(limit, 10));
  }

  const events = db.prepare(query).all(...params);

  res.json({
    success: true,
    total: events.length,
    events
  });
}

function getEventById(req, res) {
  const db = getDb();
  const event = db.prepare(`SELECT * FROM events WHERE id = ?`).get(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  res.json({
    success: true,
    event
  });
}

module.exports = {
  getEvents,
  getEventById
};

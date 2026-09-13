const path = require('path');
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  aiMode: process.env.AI_MODE || 'mock',
  geoDeduplicationRadiusMeters: parseFloat(process.env.GEO_DEDUPLICATION_RADIUS_METERS) || 30,
  dbPath: path.resolve(__dirname, '..', process.env.DB_PATH || './db/database.sqlite')
};

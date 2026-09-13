const { processAiAnalysis } = require('../services/ai/aiAdapter');

async function handleAiAnalysis(req, res, next, defaultFeature) {
  try {
    const file = req.file;
    const { busId, location, latitude, longitude, timestamp, ...metadata } = req.body;
    const feature = defaultFeature || req.params.feature || 'POTHOLE';

    const result = await processAiAnalysis({
      feature,
      imagePath: file ? file.filename : null,
      busId: busId || 'BUS_17',
      location: location || 'MG Road, Sector 14',
      latitude: latitude ? parseFloat(latitude) : 28.6139,
      longitude: longitude ? parseFloat(longitude) : 77.2090,
      timestamp,
      metadata
    });

    // Broadcast via Socket.IO if io instance is attached to app
    const io = req.app.get('io');
    if (io) {
      io.emit('event:new', result.event);
      if (result.entityDetails) {
        io.emit('defect:new', result.entityDetails);
      }
      if (result.alert) {
        io.emit('alert:new', result.alert);
      }
    }

    res.json({
      success: true,
      message: `${feature} AI analysis completed successfully`,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function analyzePothole(req, res, next) {
  return handleAiAnalysis(req, res, next, 'POTHOLE');
}

async function analyzeWaterlogging(req, res, next) {
  return handleAiAnalysis(req, res, next, 'WATERLOGGING');
}

async function analyzeInfrastructure(req, res, next) {
  return handleAiAnalysis(req, res, next, 'FOOTPATH_DAMAGE');
}

async function analyzeHitAndRun(req, res, next) {
  return handleAiAnalysis(req, res, next, 'HIT_AND_RUN');
}

async function generateDemoEvent(req, res, next) {
  try {
    const { type, busId, location, latitude, longitude, metadata } = req.body;
    const selectedType = (type || 'POTHOLE').toUpperCase();

    const sampleLocations = {
      POTHOLE: { location: 'MG Road, Sector 14', lat: 28.6139, lng: 77.2090 },
      WATERLOGGING: { location: 'Sector 14 Underpass', lat: 28.6250, lng: 77.2180 },
      FOOTPATH_DAMAGE: { location: 'Connaught Place Outer Circle', lat: 28.6328, lng: 77.2197 },
      HIT_AND_RUN: { location: 'Inner Ring Road near AIIMS Flyover', lat: 28.5672, lng: 77.2100 }
    };

    const defaultLoc = sampleLocations[selectedType] || sampleLocations.POTHOLE;

    const result = await processAiAnalysis({
      feature: selectedType,
      imagePath: null,
      busId: busId || `BUS_${String(Math.floor(Math.random() * 50) + 1).padStart(2, '0')}`,
      location: location || defaultLoc.location,
      latitude: latitude ? parseFloat(latitude) : defaultLoc.lat,
      longitude: longitude ? parseFloat(longitude) : defaultLoc.lng,
      metadata: metadata || {}
    });

    // Broadcast via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('event:new', result.event);
      if (result.entityDetails) {
        io.emit('defect:new', result.entityDetails);
      }
      if (result.alert) {
        io.emit('alert:new', result.alert);
      }
    }

    res.json({
      success: true,
      message: `Demo event '${selectedType}' generated successfully`,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  analyzePothole,
  analyzeWaterlogging,
  analyzeInfrastructure,
  analyzeHitAndRun,
  generateDemoEvent
};
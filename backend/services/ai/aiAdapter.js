const config = require('../../config');
const getDb = require('../../db/connection');
const { findNearbyDefect } = require('../geoService');
const { analyzePothole } = require('./potholeService');
const { analyzeWaterlogging } = require('./waterloggingService');
const { analyzeInfrastructure } = require('./infrastructureService');
const { analyzeHitAndRun } = require('./hitAndRunService');

/**
 * Shared Persistence & Geo-Deduplication Engine
 * Takes normalized aiResult, creates Event, checks for nearby duplicates within 30m,
 * inserts domain entities (road_defects, waterlogging, infrastructure_issues, incidents),
 * and creates HIGH/CRITICAL alerts.
 */
function saveEventAndDeduplicate({ feature, aiResult, imagePath, busId = 'BUS_17', location = 'MG Road, Sector 14', latitude = 28.6139, longitude = 77.2090, timestamp = null, metadata = {} }) {
  const now = new Date();
  const timeStr = timestamp || now.toISOString().replace('T', ' ').substring(0, 19);
  const featUpper = (feature || 'POTHOLE').toUpperCase();

  const db = getDb();
  const eventId = `EVT_${Date.now()}`;
  
  let defaultImage = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80';
  if (imagePath) {
    defaultImage = (imagePath.startsWith('http') || imagePath.startsWith('/')) ? imagePath : `/uploads/${imagePath}`;
  }

  // 1. Create Event Record
  const eventRecord = {
    id: eventId,
    type: aiResult.type,
    category: aiResult.category,
    busId,
    location,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    timestamp: timeStr,
    timeAgo: 'Just now',
    confidence: parseFloat(aiResult.confidence),
    severity: aiResult.severity,
    status: aiResult.severity === 'CRITICAL' ? 'Under Investigation' : 'Pending Maintenance',
    description: aiResult.description,
    evidenceImage: defaultImage,
    aiModel: aiResult.metadata?.aiModel || 'YOLOv8-BEL-Edge',
    metadata: JSON.stringify(aiResult.metadata || {})
  };

  db.prepare(`
    INSERT INTO events (id, type, category, busId, location, latitude, longitude, timestamp, timeAgo, confidence, severity, status, description, evidenceImage, aiModel, metadata)
    VALUES (@id, @type, @category, @busId, @location, @latitude, @longitude, @timestamp, @timeAgo, @confidence, @severity, @status, @description, @evidenceImage, @aiModel, @metadata)
  `).run(eventRecord);

  // 2. Geo-Deduplication & Domain Entity Creation
  let entityDetails = null;
  let isDuplicate = false;

  if (featUpper === 'POTHOLE' || aiResult.type === 'Pothole' || aiResult.type === 'Damaged Road') {
    const nearby = findNearbyDefect('road_defects', latitude, longitude, aiResult.type);
    if (nearby) {
      isDuplicate = true;
      const existing = nearby.existing;
      const newCount = (existing.detectionCount || 1) + 1;
      db.prepare(`
        UPDATE road_defects 
        SET detectionCount = ?, lastDetectedAt = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newCount, timeStr, existing.id);

      entityDetails = { table: 'road_defects', id: existing.id, deduplicated: true, detectionCount: newCount };
    } else {
      const defectId = `DEF_${Date.now()}`;
      db.prepare(`
        INSERT INTO road_defects (id, type, location, latitude, longitude, busId, confidence, severity, detectedAt, status, assignedTo, estimatedCost, workOrder, evidenceImage, description, detectionCount, firstDetectedAt, lastDetectedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(defectId, aiResult.type, location, latitude, longitude, busId, aiResult.confidence, aiResult.severity, timeStr, 'Detected', 'Unassigned', '₹15,000', 'WO-PENDING', defaultImage, aiResult.description, timeStr, timeStr);

      entityDetails = { table: 'road_defects', id: defectId, deduplicated: false, detectionCount: 1 };
    }
  } else if (featUpper === 'WATERLOGGING' || aiResult.type === 'Waterlogging') {
    const nearby = findNearbyDefect('waterlogging', latitude, longitude);
    if (nearby) {
      isDuplicate = true;
      const existing = nearby.existing;
      const newCount = (existing.detectionCount || 1) + 1;
      db.prepare(`
        UPDATE waterlogging 
        SET detectionCount = ?, lastDetectedAt = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newCount, timeStr, existing.id);

      entityDetails = { table: 'waterlogging', id: existing.id, deduplicated: true, detectionCount: newCount };
    } else {
      const waterId = `DEF_${Date.now()}`;
      db.prepare(`
        INSERT INTO waterlogging (id, location, latitude, longitude, busId, waterDepthCm, confidence, severity, status, assignedTo, evidenceImage, description, detectionCount, firstDetectedAt, lastDetectedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(waterId, location, latitude, longitude, busId, aiResult.metadata?.waterDepthCm || 20, aiResult.confidence, aiResult.severity, 'Detected', 'Drainage Response Unit', defaultImage, aiResult.description, timeStr, timeStr);

      entityDetails = { table: 'waterlogging', id: waterId, deduplicated: false, detectionCount: 1 };
    }
  } else if (featUpper === 'FOOTPATH_DAMAGE' || featUpper === 'INFRASTRUCTURE' || aiResult.category === 'INFRASTRUCTURE') {
    const nearby = findNearbyDefect('infrastructure_issues', latitude, longitude, aiResult.type);
    if (nearby) {
      isDuplicate = true;
      const existing = nearby.existing;
      const newCount = (existing.detectionCount || 1) + 1;
      db.prepare(`
        UPDATE infrastructure_issues 
        SET detectionCount = ?, lastDetectedAt = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newCount, timeStr, existing.id);

      entityDetails = { table: 'infrastructure_issues', id: existing.id, deduplicated: true, detectionCount: newCount };
    } else {
      const infraId = `INF_${Date.now()}`;
      db.prepare(`
        INSERT INTO infrastructure_issues (id, type, location, latitude, longitude, busId, confidence, severity, detectedAt, status, assignedAuthority, evidenceImage, description, detectionCount, firstDetectedAt, lastDetectedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(infraId, aiResult.type, location, latitude, longitude, busId, aiResult.confidence, aiResult.severity, timeStr, 'Assigned', aiResult.assignedAuthority || 'NDMC Civil Dept', defaultImage, aiResult.description, timeStr, timeStr);

      entityDetails = { table: 'infrastructure_issues', id: infraId, deduplicated: false, detectionCount: 1 };
    }
  } else if (featUpper === 'HIT_AND_RUN' || aiResult.category === 'SAFETY_INCIDENT') {
    const incId = `INC_${Date.now()}`;
    const offendingObj = aiResult.offendingVehicle || null;
    db.prepare(`
      INSERT INTO incidents (id, type, busId, location, latitude, longitude, timestamp, severity, confidence, status, offendingVehicleReg, offendingVehicleDetails, evidenceImage, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      incId, 
      aiResult.type, 
      busId, 
      location, 
      latitude, 
      longitude, 
      timeStr, 
      aiResult.severity, 
      aiResult.confidence, 
      'Under Investigation', 
      offendingObj?.registrationNo || null, 
      offendingObj ? JSON.stringify(offendingObj) : null, 
      defaultImage, 
      aiResult.description
    );

    entityDetails = { table: 'incidents', id: incId, deduplicated: false };
  }

  // 3. Generate Alert if HIGH or CRITICAL severity
  let alertRecord = null;
  if (aiResult.severity === 'HIGH' || aiResult.severity === 'CRITICAL') {
    const alertId = `ALT_${Date.now()}`;
    alertRecord = {
      id: alertId,
      eventId,
      title: `${aiResult.severity} Alert: ${aiResult.type}`,
      severity: aiResult.severity,
      category: aiResult.category,
      message: `${aiResult.type} detected by ${busId} at ${location}.`,
      status: 'ACTIVE',
      timestamp: timeStr
    };

    db.prepare(`
      INSERT INTO alerts (id, eventId, title, severity, category, message, status, timestamp)
      VALUES (@id, @eventId, @title, @severity, @category, @message, @status, @timestamp)
    `).run(alertRecord);
  }

  return {
    event: eventRecord,
    aiResult,
    entityDetails,
    isDuplicate,
    alert: alertRecord
  };
}

/**
 * Process AI analysis via backend AI mock service (for /api/ai/* routes)
 */
async function processAiAnalysis({ feature, imagePath, busId = 'BUS_17', location = 'MG Road, Sector 14', latitude = 28.6139, longitude = 77.2090, timestamp = null, metadata = {} }) {
  let aiResult;
  const featUpper = (feature || 'POTHOLE').toUpperCase();

  switch (featUpper) {
    case 'POTHOLE':
      aiResult = await analyzePothole(imagePath, metadata);
      break;
    case 'WATERLOGGING':
      aiResult = await analyzeWaterlogging(imagePath, metadata);
      break;
    case 'FOOTPATH_DAMAGE':
    case 'INFRASTRUCTURE':
      aiResult = await analyzeInfrastructure(imagePath, metadata);
      break;
    case 'HIT_AND_RUN':
    case 'SAFETY_INCIDENT':
      aiResult = await analyzeHitAndRun(imagePath, { ...metadata, busId, latitude, longitude });
      break;
    default:
      aiResult = await analyzePothole(imagePath, metadata);
      break;
  }

  return saveEventAndDeduplicate({
    feature,
    aiResult,
    imagePath,
    busId,
    location,
    latitude,
    longitude,
    timestamp,
    metadata
  });
}

/**
 * Process Edge AI payload directly (WITHOUT running backend AI model inference)
 */
async function processEdgeEvent(payload) {
  const featUpper = (payload.eventType || 'POTHOLE').toUpperCase();
  let type = 'Pothole';
  let category = 'ROAD_DEFECT';
  let defaultImg = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80';

  if (featUpper === 'POTHOLE') {
    type = 'Pothole';
    category = 'ROAD_DEFECT';
  } else if (featUpper === 'WATERLOGGING') {
    type = 'Waterlogging';
    category = 'ROAD_DEFECT';
    defaultImg = 'http://localhost:5000/uploads/waterlogging_image.jpeg';
  } else if (featUpper === 'FOOTPATH_DAMAGE' || featUpper === 'INFRASTRUCTURE') {
    type = payload.metadata?.type || 'Damaged Footpath';
    category = 'INFRASTRUCTURE';
    defaultImg = 'https://images.unsplash.com/photo-1506521782020-18925f46c0be?w=600&auto=format&fit=crop&q=80';
  } else if (featUpper === 'HIT_AND_RUN') {
    type = 'Hit-and-Run Incident';
    category = 'SAFETY_INCIDENT';
    defaultImg = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80';
  }

  const modelName = payload.model?.name || 'edge-model';
  const modelVersion = payload.model?.version ? ` v${payload.model.version}` : '';
  const aiModel = `${modelName}${modelVersion}`;
  
  const imagePath = payload.evidence?.imageUrl || defaultImg;
  const address = payload.location?.address || `${payload.location?.latitude}, ${payload.location?.longitude}`;
  
  let timeStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  if (payload.timestamp) {
    timeStr = payload.timestamp.replace('T', ' ').replace('Z', '').substring(0, 19);
  }

  const aiResult = {
    feature: featUpper,
    type,
    category,
    confidence: payload.detection.confidence,
    severity: payload.detection.severity.toUpperCase(),
    assignedAuthority: payload.metadata?.assignedAuthority || (category === 'INFRASTRUCTURE' ? 'Municipal Civil Works' : null),
    offendingVehicle: payload.metadata?.offendingVehicle || (featUpper === 'HIT_AND_RUN' ? {
      registrationNo: payload.metadata?.registrationNo || "DL01AB1234",
      regConfidence: payload.detection.confidence,
      makeModel: payload.metadata?.makeModel || "Sedan (Black)",
      speedDetected: payload.metadata?.speedDetected || "84 km/h"
    } : null),
    metadata: {
      ...payload.metadata,
      cameraId: payload.cameraId || 'CAM_FRONT',
      aiModel,
      edgeSource: true
    },
    description: payload.metadata?.description || `${type} detected by Edge AI (${aiModel}) on ${payload.busId} near ${address}.`
  };

  return saveEventAndDeduplicate({
    feature: featUpper,
    aiResult,
    imagePath,
    busId: payload.busId,
    location: address,
    latitude: payload.location.latitude,
    longitude: payload.location.longitude,
    timestamp: timeStr,
    metadata: aiResult.metadata
  });
}

module.exports = {
  processAiAnalysis,
  processEdgeEvent
};

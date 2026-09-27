const Bus = require('../models/Bus');
const { emitBusUpdated } = require('../sockets/socket');

/**
 * GET /api/v1/buses
 * Get list of buses with optional filters
 */
const getBuses = async (req, res, next) => {
  try {
    const { status, route } = req.query;
    const query = {};

    if (status) query.status = status;
    if (route) query.route = route;

    const buses = await Bus.find(query).sort({ busId: 1 }).lean();

    return res.status(200).json({
      success: true,
      data: buses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/buses/:busId
 * Get bus details by busId
 */
const getBusById = async (req, res, next) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findOne({ busId });
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: `Bus not found with busId: ${busId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/buses
 * Create or upsert a bus record
 */
const createBus = async (req, res, next) => {
  try {
    const { busId, route, status, location, speed } = req.body;

    if (!busId || typeof busId !== 'string' || !busId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'busId is required'
      });
    }

    let geoPoint = undefined;
    if (location) {
      if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
        geoPoint = {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        };
      } else if (location.type === 'Point' && Array.isArray(location.coordinates)) {
        geoPoint = location;
      }
    }

    const updateFields = {
      busId: busId.trim(),
      lastSeenAt: new Date()
    };

    if (route !== undefined) updateFields.route = route;
    if (status !== undefined) updateFields.status = status;
    if (geoPoint) updateFields.location = geoPoint;
    if (speed !== undefined) updateFields.speed = Number(speed);

    const bus = await Bus.findOneAndUpdate(
      { busId: busId.trim() },
      { $set: updateFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    emitBusUpdated(bus);

    return res.status(201).json({
      success: true,
      data: bus
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/buses/:busId
 * Update bus telemetry / details
 */
const updateBus = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const { route, status, location, speed } = req.body;

    const bus = await Bus.findOne({ busId });
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: `Bus not found with busId: ${busId}`
      });
    }

    if (route !== undefined) bus.route = route;
    if (status !== undefined) bus.status = status;
    if (speed !== undefined) bus.speed = Number(speed);
    bus.lastSeenAt = new Date();

    if (location) {
      if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
        bus.location = {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        };
      } else if (location.type === 'Point' && Array.isArray(location.coordinates)) {
        bus.location = location;
      }
    }

    await bus.save();

    emitBusUpdated(bus);

    return res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBuses,
  getBusById,
  createBus,
  updateBus
};

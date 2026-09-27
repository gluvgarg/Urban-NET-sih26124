const Event = require('../models/Event');
const eventService = require('../services/eventService');
const { ALLOWED_STATUSES } = require('../utils/validators');
const { emitEventUpdated } = require('../sockets/socket');
const mongoose = require('mongoose');

/**
 * POST /api/v1/edge/events
 * Ingest AI event from Edge Bus device
 */
const handleEdgeEvent = async (req, res, next) => {
  try {
    const result = await eventService.ingestEdgeEvent(req.body);
    return res.status(200).json({
      success: true,
      message: result.isDuplicateObservation
        ? 'Idempotent response: observation already processed'
        : result.isNew
        ? 'New event recorded successfully'
        : 'Persistent event deduplicated and updated successfully',
      deduplicated: !result.isNew && !result.isDuplicateObservation,
      data: result.event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/events
 * Retrieve list of events with filtering and pagination
 */
const getEvents = async (req, res, next) => {
  try {
    const {
      category,
      type,
      severity,
      status,
      handling,
      busId,
      from,
      to,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (type) query.type = type.toUpperCase();
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (handling) query.handling = handling;
    if (busId) query.busId = busId;

    if (from || to) {
      query.capturedAt = {};
      if (from) query.capturedAt.$gte = new Date(from);
      if (to) query.capturedAt.$lte = new Date(to);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ capturedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Event.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/events/:id
 * Get single event by Mongoose ObjectId or observationId
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let event = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findById(id);
    }

    if (!event) {
      event = await Event.findOne({ observationId: id });
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with ID or observationId: ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/events/:id/status
 * Update status of an event
 */
const updateEventStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    let query = { observationId: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { observationId: id }] };
    }

    const updatedEvent = await Event.findOneAndUpdate(
      query,
      { $set: { status } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: `Event not found with ID or observationId: ${id}`
      });
    }

    // Emit Socket.IO real-time update
    emitEventUpdated(updatedEvent);

    return res.status(200).json({
      success: true,
      message: `Event status updated to ${status}`,
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleEdgeEvent,
  getEvents,
  getEventById,
  updateEventStatus
};

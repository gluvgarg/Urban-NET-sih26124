const Bus = require('../models/Bus');
const Event = require('../models/Event');

/**
 * GET /api/v1/dashboard/summary
 * Summary metrics for dashboard
 */
const getSummary = async (req, res, next) => {
  try {
    const [
      activeBusCount,
      totalEventCount,
      criticalEventCount,
      persistentEventCount,
      recentEvents
    ] = await Promise.all([
      Bus.countDocuments({ status: 'ONLINE' }),
      Event.countDocuments(),
      Event.countDocuments({ severity: 'CRITICAL' }),
      Event.countDocuments({ handling: 'PERSISTENT' }),
      Event.find().sort({ capturedAt: -1 }).limit(10).lean()
    ]);

    return res.status(200).json({
      success: true,
      data: {
        activeBusCount,
        totalEventCount,
        criticalEventCount,
        persistentEventCount,
        recentEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary
};

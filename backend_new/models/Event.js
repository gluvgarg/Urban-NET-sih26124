const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  observationId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  busId: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['ROAD', 'INFRASTRUCTURE', 'SAFETY', 'TRAFFIC'],
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  handling: {
    type: String,
    enum: ['REAL_TIME', 'PERSISTENT'],
    required: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  capturedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'],
    default: 'NEW'
  },
  evidence: {
    imageUrl: {
      type: String,
      default: ''
    }
  },
  vehicleNumber: {
    type: String,
    default: '',
    trim: true
  },
  model: {
    name: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    }
  },
  detectionCount: {
    type: Number,
    default: 1
  },
  detectedBy: [{
    type: String
  }],
  firstDetectedAt: {
    type: Date,
    default: Date.now
  },
  lastDetectedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

eventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Event', eventSchema);

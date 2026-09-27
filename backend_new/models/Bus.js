const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  route: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['ONLINE', 'OFFLINE'],
    default: 'OFFLINE'
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
  speed: {
    type: Number,
    default: 0
  },
  lastSeenAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

busSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Bus', busSchema);

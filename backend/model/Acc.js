const mongoose = require("mongoose");

const accSchema = new mongoose.Schema({
  bus_id: {
    type: String,
    required: true,
  },

  route_id: {
    type: String,
    required: true,
    unique: true,
  },

  latitude: {
    type: Number,
    required: true,
  },

  longitude: {
    type: Number,
    required: true,
  },

  time: {
    type: Date,
    default: Date.now,
  },

  acc_type: {
    type: String,
    required: true,
  },

  acc_no_plate: {
    type: String,
  },

  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
});

const Acc = mongoose.model("Acc", accSchema);

module.exports = Acc;

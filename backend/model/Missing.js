
const mongoose = require("mongoose");

const missingSchema = new mongoose.Schema({

  bus_id: {
    type: String,
    required: true
  },

  route_id: {
    type: String,
    required: true
  },

  defect_type: {
    type: String,
    required: true
  },

  latitude: {
    type: Number,
    required: true
  },

  longitude: {
    type: Number,
    required: true
  },

  time: {
    type: Date,
    default: Date.now
  },

  num_cnt: {
    type: Number,
    required: true
  },

  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  }

});

const Defect = mongoose.model("Defect", missingSchema);

module.exports = Defect;

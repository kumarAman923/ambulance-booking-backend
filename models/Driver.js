const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  ambulanceNumber: {
    type: String,
    required: true
  },

  location: {
    lat: Number,
    lng: Number
  },

  status: {
    type: String,
    default: "available"
  }

}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);
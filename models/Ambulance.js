const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({

  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver"
  },

  vehicleNumber: String,

  location: {
    lat: Number,
    lng: Number
  },

  status: {
    type: String,
    default: "available"
  }

});

module.exports = mongoose.model("Ambulance", ambulanceSchema);
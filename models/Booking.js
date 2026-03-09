const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  ambulanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver"
  },

  pickupLocation: {
    lat: Number,
    lng: Number
  },

  hospital: String,

  status: {
    type: String,
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
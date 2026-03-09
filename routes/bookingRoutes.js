const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,        // ✅ for driver dashboard
  getUserBookings,       // ✅ for user's my bookings
  cancelBooking,
  acceptBooking,
  completeBooking
} = require("../controllers/bookingController");

// GET routes
router.get("/", getAllBookings);                // driver dashboard
router.get("/user/:userId", getUserBookings);   // user's bookings

// POST routes
router.post("/", createBooking);
router.post("/accept", acceptBooking);
router.post("/complete", completeBooking);
router.post("/cancel", cancelBooking);

module.exports = router;
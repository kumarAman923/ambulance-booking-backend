const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const calculateDistance = require("../utils/distanceCalculator");
const mongoose = require("mongoose");

// 🚑 Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { userId, pickupLocation, hospital } = req.body;

    // ✅ Validate required fields
    if (!userId || !pickupLocation || !hospital) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const drivers = await Driver.find({ status: "available" });

    if (drivers.length === 0) {
      return res.status(404).json({ message: "No ambulance available" });
    }

    let nearestDriver = null;
    let minDistance = Infinity;

    drivers.forEach(driver => {
      if (!driver.location) return;

      const distance = calculateDistance(
        pickupLocation.lat,
        pickupLocation.lng,
        driver.location.lat,
        driver.location.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver;
      }
    });

    if (!nearestDriver) {
      return res.status(404).json({ message: "No nearby ambulance found" });
    }

    const booking = new Booking({
      userId,
      ambulanceId: nearestDriver._id,
      pickupLocation,
      hospital,
      status: "pending"
    });

    await booking.save();

    // driver busy
    nearestDriver.status = "busy";
    await nearestDriver.save();

    // ✅ Socket.io emit – naye booking ke baare mein sabhi connected drivers ko batao
    const io = req.app.get('socketio');
    if (io) {
      io.emit('newBooking', booking);
      console.log('📢 newBooking emitted:', booking._id);
    }

    res.status(201).json({
      message: "Ambulance booked successfully",
      driver: nearestDriver,
      booking
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// 📄 Get All Bookings (for Driver Dashboard)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("ambulanceId")
      .sort({ createdAt: -1 }); // latest first
    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📄 Get User Bookings (for MyBookings page)
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const bookings = await Booking.find({ userId })
      .populate("ambulanceId")
      .sort({ createdAt: -1 });

    res.json({ bookings });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    const driver = await Driver.findById(booking.ambulanceId);
    if (driver) {
      driver.status = "available";
      await driver.save();
    }

    res.json({ message: "Booking Cancelled" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Driver Accept Booking
exports.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "accepted";
    await booking.save();

    res.json({ message: "Booking accepted", booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🏁 Complete Booking
exports.completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "completed";
    await booking.save();

    const driver = await Driver.findById(booking.ambulanceId);
    if (driver) {
      driver.status = "available";
      await driver.save();
    }

    res.json({ message: "Booking Completed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
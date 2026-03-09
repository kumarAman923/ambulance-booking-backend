const Driver = require("../models/Driver");

exports.addDriver = async (req, res) => {

  try {

    console.log("Request Body:", req.body);

    const { name, phone, ambulanceNumber, location } = req.body;

    const driver = new Driver({
      name,
      phone,
      ambulanceNumber,
      location
    });

    await driver.save();

    console.log("Driver saved:", driver);

    res.status(201).json({
      message: "Driver added successfully",
      driver
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

};


exports.completeRide = async (req, res) => {

  try {

    const { driverId } = req.body;

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // driver fir se available ho jayega
    driver.status = "available";

    await driver.save();

    res.json({
      message: "Ride completed successfully",
      driver
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

};

exports.updateLocation = async (req, res) => {

  try {

    const { driverId, lat, lng } = req.body;

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.location = {
      lat,
      lng
    };

    await driver.save();

    res.json({
      message: "Driver location updated",
      driver
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

};
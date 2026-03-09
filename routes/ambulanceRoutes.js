const express = require("express");
const router = express.Router();

// const { addDriver } = require("../controllers/ambulanceController");
// const { addDriver, completeRide,updatelocation } = require("../controllers/ambulanceController");
const { addDriver, completeRide, updateLocation } = require("../controllers/ambulanceController");


router.post("/driver", addDriver);
router.post("/complete-ride", completeRide);
router.post("/update-location", updateLocation);

module.exports = router;
const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

router.get("/", async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});

module.exports = router;
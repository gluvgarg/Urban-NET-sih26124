const express = require("express");

const Acc = require("../model/Acc");
const { validateAccInput } = require("../halper/valid");

const router = express.Router();


// Calculate distance between two GPS coordinates in meters
function getDistanceInMeters(lat1, lon1, lat2, lon2) {

  const R = 6371000; // Earth radius in meters

  const toRadians = (degree) => degree * Math.PI / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return R * c;
}


// POST - Add accident
router.post("/", async (req, res) => {

  try {

    // Validate input
    const validation = validateAccInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: validation.errors
      });
    }

    // Get GPS coordinates
    const { latitude, longitude } = req.body;


    // Check GPS coordinates
    if (
      latitude === undefined ||
      longitude === undefined ||
      latitude === null ||
      longitude === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    // Convert coordinates to numbers
    const lat = Number(latitude);
    const lon = Number(longitude);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers"
      });
    }

    // Find all existing accidents
    const existingAccidents = await Acc.find({});

    let nearbyAccident = null;
    let nearestDistance = Infinity;

    // Check distance from every existing accident
    for (const accident of existingAccidents) {
      const existingLat = Number(accident.latitude);
      const existingLon = Number(accident.longitude);

      // Skip records with invalid coordinates
      if (isNaN(existingLat) || isNaN(existingLon)) {
        continue;
      }

      const distance = getDistanceInMeters(lat, lon, existingLat, existingLon);

      // Keep nearest accident
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearbyAccident = accident;
      }
    }

    // Accident already exists within 5 meters
    if (nearbyAccident && nearestDistance <= 5) {
      return res.status(409).json({
        success: false,
        message: "Accident already exists within 5 meters",
        distance: Number(nearestDistance.toFixed(2)),
        existingAccident: nearbyAccident
      });
    }

    // No accident within 5 meters
    // Create new accident
    const acc = await Acc.create({
      ...req.body,
      latitude: lat,
      longitude: lon
    });

    return res.status(201).json({
      success: true,
      message: "Accident added successfully",
      data: acc
    });

  } catch (error) {
    console.error(
      "Accident creation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// GET - Get all accidents
router.get("/", async (req, res) => {
  try {
    const accidents = await Acc.find();

    res.status(200).json({
      success: true,
      count: accidents.length,
      data: accidents
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
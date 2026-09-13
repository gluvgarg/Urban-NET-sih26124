const express = require("express");
const Defect = require("../model/Missing");

const router = express.Router();

// Calculate distance between two GPS coordinates in meters
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const toRadians = (degree) => {
    return degree * Math.PI / 180;
  };

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

// POST - Add Defect / Hit and Run Detection

router.post("/", async (req, res) => {
  try {

    const {
      bus_id,
      route_id,
      defect_type,
      latitude,
      longitude,
      time,
      num_cnt,
      confidence
    } = req.body;

    // Validate required fields

    if (!bus_id) {
      return res.status(400).json({
        success: false,
        message: "bus_id is required"
      });
    }

    if (!route_id) {
      return res.status(400).json({
        success: false,
        message: "route_id is required"
      });
    }

    if (!defect_type) {
      return res.status(400).json({
        success: false,
        message: "defect_type is required"
      });
    }

    if (latitude === undefined || latitude === null || longitude === undefined || longitude === null ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    if (num_cnt === undefined || num_cnt === null) {
      return res.status(400).json({
        success: false,
        message: "num_cnt is required"
      });
    }

    if (confidence === undefined || confidence === null) {
      return res.status(400).json({
        success: false,
        message: "confidence is required"
      });
    }


    // Convert values to numbers

    const lat = Number(latitude);
    const lon = Number(longitude);
    const count = Number(num_cnt);
    const conf = Number(confidence);


    // Validate latitude/longitude

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers"
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90"
      });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180"
      });
    }


    // Validate num_cnt

    if (isNaN(count) || count < 0) {
      return res.status(400).json({
        success: false,
        message: "num_cnt must be a valid non-negative number"
      });
    }


    // Validate confidence

    if (isNaN(conf) || conf < 0 || conf > 1) {
      return res.status(400).json({
        success: false,
        message: "confidence must be between 0 and 1"
      });
    }


    // Find existing defects

    const existingDefects = await Defect.find({});

    let nearbyDefect = null;
    let nearestDistance = Infinity;


    // Check distance

    for (const defect of existingDefects) {

      const existingLat = Number(defect.latitude);
      const existingLon = Number(defect.longitude);

      // Skip invalid coordinates
      if (
        isNaN(existingLat) ||
        isNaN(existingLon)
      ) {
        continue;
      }

      const distance = getDistanceInMeters(
        lat,
        lon,
        existingLat,
        existingLon
      );


      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearbyDefect = defect;
      }
    }


    // Duplicate within 5 meters

    if (
      nearbyDefect &&
      nearestDistance <= 5
    ) {
      return res.status(409).json({
        success: false,
        message: "Defect already exists within 5 meters",
        distance: Number(nearestDistance.toFixed(2)),
        existingDefect: nearbyDefect
      });
    }


    // Create new defect

    const newDefect = {
      bus_id: bus_id,
      route_id: route_id,
      defect_type: defect_type,
      latitude: lat,
      longitude: lon,
      num_cnt: count,
      confidence: conf
    };


    // Add time only if provided
    if (time) {
      newDefect.time = new Date(time);
    }


    const defect = await Defect.create(newDefect);


    // Success response

    return res.status(201).json({
      success: true,
      message: "Defect added successfully",
      data: defect
    });

  } catch (error) {

    console.error("Defect creation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// GET - Get All Defects

router.get("/", async (req, res) => {
  try {

    const defects = await Defect.find()
      .sort({ time: -1 });

    return res.status(200).json({
      success: true,
      count: defects.length,
      data: defects
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// GET - Get Defects by Bus ID

router.get("/bus/:bus_id", async (req, res) => {
  try {

    const defects = await Defect.find({
      bus_id: req.params.bus_id
    }).sort({ time: -1 });

    return res.status(200).json({
      success: true,
      count: defects.length,
      data: defects
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// GET - Get Defects by Route ID

router.get("/route/:route_id", async (req, res) => {
  try {

    const defects = await Defect.find({
      route_id: req.params.route_id
    }).sort({ time: -1 });

    return res.status(200).json({
      success: true,
      count: defects.length,
      data: defects
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



// GET - Get Defects formatted as GeoJSON for React Map libraries (Leaflet, Mapbox, Google Maps)
router.get("/map-data", async (req, res) => {
  try {
    // We use .lean() to get raw JSON objects which is faster and cleaner
    const defects = await Defect.find().lean();

    const geojson = {
      type: "FeatureCollection",
      features: defects
        // Ensure coordinates are valid numbers before adding to map
        .filter(d => !isNaN(Number(d.latitude)) && !isNaN(Number(d.longitude)))
        .map(defect => ({
          type: "Feature",
          geometry: {
            type: "Point",
            // GeoJSON format requires [longitude, latitude] array order
            coordinates: [Number(defect.longitude), Number(defect.latitude)]
          },
          properties: {
            id: defect._id,
            bus_id: defect.bus_id,
            route_id: defect.route_id,
            defect_type: defect.defect_type,
            time: defect.time,
            num_cnt: defect.num_cnt,
            confidence: defect.confidence
          }
        }))
    };

    return res.status(200).json({
      success: true,
      count: geojson.features.length,
      data: geojson
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;


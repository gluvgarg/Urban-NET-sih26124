const express = require("express");
const Pothole = require("../model/Pothole");
const { validatePotholeInput } = require("../halper/valid");

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

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};


// POST - Add pothole
router.post("/", async (req, res) => {
    try {

        // Validate input
        const validation = validatePotholeInput(req.body);

        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: validation.errors
            });
        }

        const { latitude, longitude } = req.body;

        // Check latitude and longitude
        if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        const lat = Number(latitude);
        const lon = Number(longitude);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude must be valid numbers"
            });
        }

        // Find nearby potholes
        const existingPotholes = await Pothole.find({});

        let nearbyPothole = null;
        let nearestDistance = Infinity;

        for (const pothole of existingPotholes) {

            const existingLat = Number(pothole.latitude);
            const existingLon = Number(pothole.longitude);

            if (isNaN(existingLat) || isNaN(existingLon)) {
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
                nearbyPothole = pothole;
            }
        }

        // If pothole exists within 5 meters, don't add
        if (nearbyPothole && nearestDistance <= 5) {
            return res.status(409).json({
                success: false,
                message: "Pothole already exists within 5 meters",
                distance: Number(nearestDistance.toFixed(2)),
                existingPothole: nearbyPothole
            });
        }

        // No pothole within 5 meters → create new pothole
        const pothole = await Pothole.create({
            ...req.body,
            latitude: lat,
            longitude: lon
        });

        return res.status(201).json({
            success: true,
            message: "Pothole added successfully",
            data: pothole
        });

    } catch (error) {

        console.error("Pothole creation error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;



router.get("/", async (req, res) => {
    try {
        const potholes = await Pothole.find();

        res.status(200).json({
            success: true,
            count: potholes.length,
            data: potholes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

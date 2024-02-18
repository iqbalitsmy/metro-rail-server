const express = require("express")
const router = express.Router();
const { adminAuth } = require("../middleware/auth");
const { addStation, stations, deleteStation, updateStation, deleteStations, station, adminStations } = require("../controllers/stationController");


// Station route
router.route("/add-station").post(adminAuth, addStation);
router.route("/stations").get(stations);

// admin station
router.route("/admin/stations").get(adminAuth, adminStations);

// gat a station
router.route("/station/:id").get(adminAuth, station);
router.route("/update-station/:id").put(adminAuth, updateStation);

// Delete station
router.route("/delete-station/:id").delete(adminAuth, deleteStation);

// delete many from admin
router.route("/delete-stations").delete(adminAuth, deleteStations);



module.exports = router
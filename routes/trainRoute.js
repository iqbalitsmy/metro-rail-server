const express = require("express")
const router = express.Router();
const { adminAuth } = require("../middleware/auth");
const { addStation, stations, deleteStation, updateStation, deleteStations, station } = require("../controllers/stationController");


// Station route
router.route("/add-station").post(adminAuth, addStation);
router.route("/stations").get(stations);

// gat a station
router.route("/station/:id").get(adminAuth, station);
router.route("/update-station/:id").put(adminAuth, updateStation);

// Delete station
router.route("/delete-station/:id").delete(adminAuth, deleteStation);
router.route("/delete-stations").delete(adminAuth, deleteStations);



module.exports = router
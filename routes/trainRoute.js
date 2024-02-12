const express = require("express")
const router = express.Router();
const { adminAuth } = require("../middleware/auth");
const { addStation, stations, deleteStation, updateStation, deleteStations } = require("../controllers/stationController");


// Station route
router.route("/add-station").post(adminAuth, addStation);
router.route("/stations").get(stations);
router.route("/update-station").put(adminAuth, updateStation);
router.route("/delete-station").delete(adminAuth, deleteStation);
router.route("/delete-stations").delete(adminAuth, deleteStations);



module.exports = router
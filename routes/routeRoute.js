const express = require("express")
const router = express.Router();
const { adminAuth, userAuth } = require("../middleware/auth");
const { addRoute, stationRoutes, updateRoute, deleteRoute, deleteRoutes } = require("../controllers/routeController");


// Route route
router.route("/add-route").post(adminAuth, addRoute);
router.route("/routes").get(stationRoutes);
router.route("/update-route").put(adminAuth, updateRoute);
router.route("/delete-route").delete(adminAuth, deleteRoute);
router.route("/delete-routes").delete(adminAuth, deleteRoutes);



module.exports = router
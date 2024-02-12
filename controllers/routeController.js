const Route = require('../models/routeModel');
const genarateQr = require('../utils/qrCodeMaker');
const sendMail = require('../utils/sendMail');

// -------add Route-------------
exports.addRoute = async (req, res, next) => {
    const { name, stations, startTime, endTime } = req.body;
    await Route.create({
        name,
        stations,
        startTime,
        endTime,
    })
        .then((route) => {
            res.status(201).json({
                message: "Route successfully added",
                route: route._id,
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Route not successfully added",
                error: error.message,
            })
        });
}


// --------get all route-------------------------
exports.stationRoutes = async (req, res, next) => {
    // sendMail();
    // genarateQr();
    try {
        const route = await Route.find();
        res.status(200).json(route);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// --------update route-------------------------
exports.updateRoute = async (req, res, next) => {
    const { id, name, stations, startTime, endTime } = req.body;
    try {
        const route = await Route.findById(id);

        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }

        // Update the 'name' field if provided
        if (name) {
            route.name = name;
        }

        // Update the 'stations' field if provided
        if (stations) {
            // Assuming stations is an array of objects
            route.stations = [...stations];
        }

        // Update the 'startTime' field if provided
        if (startTime) {
            route.startTime = startTime;
        }

        // Update the 'endTime' field if provided
        if (endTime) {
            route.endTime = endTime;
        }

        // Save the updated route
        const updatedRoute = await route.save();

        res.status(200).json({ message: "Route successfully updated", route: updatedRoute });
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};


// --------delete route-------------------------
exports.deleteRoute = async (req, res, next) => {
    const { id } = req.body
    await Route.findById(id)
        .then(route => route.deleteOne())
        .then(route =>
            res.status(201).json({ message: "Route successfully deleted", route })
        )
        .catch(error =>
            res
                .status(400)
                .json({ message: "An error occurred", error: error.message })
        )
}


// --------delete routes-------------------------
exports.deleteRoutes = async (req, res, next) => {
    const { ids } = req.body;

    try {
        // Use deleteMany to delete multiple route
        const result = await Route.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Routes successfully deleted", deletedCount: result.deletedCount });
        } else {
            res.status(404).json({ message: "No routes found with the provided IDs" });
        }
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

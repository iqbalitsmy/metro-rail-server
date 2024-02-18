const Station = require('../models/stationModel');

// -------add Station-------------
exports.addStation = async (req, res, next) => {
    const { name, location, status } = req.body;
    await Station.create({
        name,
        location,
        status
    })
        .then((station) => {
            res.status(201).json({
                message: "Station successfully added",
                station: station._id,
            });
        })
        .catch((error) => {
            res.status(400).json({
                message: "Station not successfully added",
                error: error.message,
            })
        });
}

// --------get a station from admin-------------------------
exports.station = async (req, res, next) => {
    const id = req.params.id;
    try {
        const station = await Station.findById(id);

        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        res.status(200).json(station);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// --------get all station-------------------------
exports.stations = async (req, res, next) => {

    try {
        const station = await Station.find({ status: 'active' });
        res.status(200).json(station);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// --------get all station-------------------------
exports.adminStations = async (req, res, next) => {

    try {
        const station = await Station.find();
        res.status(200).json(station);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// --------update station-------------------------
exports.updateStation = async (req, res, next) => {
    const id = req.params.id;
    const { name, location, status } = req.body;

    try {
        const station = await Station.findById(id);

        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        // Update the 'name' field if provided
        if (name) {
            station.name = name;
        }

        // Update the 'location' field if provided
        if (location) {
            station.location = location;
        }

        // Update the 'location' field if provided
        if (status) {
            station.status = status;
        }

        // Save the updated station
        const updatedStation = await station.save();

        res.status(200).json({ message: "Station successfully updated", station: updatedStation });
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};


// --------delete station-------------------------
exports.deleteStation = async (req, res, next) => {
    const id = req.params.id;
    await Station.findById(id)
        .then(station => station.deleteOne())
        .then(station =>
            res.status(201).json({ message: "Station successfully deleted", station })
        )
        .catch(error =>
            res
                .status(400)
                .json({ message: "An error occurred", error: error.message })
        )
}


// --------delete stations-------------------------
exports.deleteStations = async (req, res, next) => {
    const { ids } = req.body;

    try {
        // Use deleteMany to delete multiple stations
        const result = await Station.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Stations successfully deleted", deletedCount: result.deletedCount });
        } else {
            res.status(404).json({ message: "No stations found with the provided IDs" });
        }
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

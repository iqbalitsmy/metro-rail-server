// models/Route.js
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    stations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
    }],
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;

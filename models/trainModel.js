
const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    trainNumber: {
        type: String,
        required: true,
        unique: true,
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true,
    },
    currentStationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station',
    },
    currentStatus: {
        type: String,
        enum: ['moving', 'stopped'],
        default: 'stopped',
    },
    lastUpdateTime: {
        type: Date,
        default: Date.now,
    },
});

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;

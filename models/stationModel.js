// models/Station.js
const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        um: ['active', 'deactive'],
        default: 'active',
    },
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;

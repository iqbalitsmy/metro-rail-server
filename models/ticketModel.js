const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    fromStationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station', // Station model
        required: true,
    },
    toStationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station', // Station model
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station', // User model
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    payment: {
        type: String,
        default: "Paid"
    },
    time: {
        type: String,
        default: Date.now,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    refundPaymentMethods: {
        type: String,
    },
    refundPaymentMobNumb: {
        type: Number,
    },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

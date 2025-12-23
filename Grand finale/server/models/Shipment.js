const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    driver: {
        name: String,
        phone: String
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['In Transit', 'Delayed', 'Arrived', 'Scheduled'],
        default: 'Scheduled'
    },
    eta: {
        type: String
    },
    cargo: {
        crop: String,
        quantity: Number
    },
    progress: {
        type: Number,
        default: 0
    },
    currentCoords: {
        lat: Number,
        lng: Number
    },
    path: [{
        lat: Number,
        lng: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Shipment', ShipmentSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: {
        state: String,
        district: String
    },
    cropDetails: [{
        cropName: String,
        sowingDate: Date,
        expectedHarvestDate: Date,
        acreage: Number
    }],
    role: { type: String, enum: ['farmer', 'buyer', 'policymaker', 'processor'], default: 'farmer' },
    trustScore: { type: Number, default: 500 },
    creditBadge: { type: String, enum: ['Bronze', 'Silver', 'Gold'], default: 'Bronze' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
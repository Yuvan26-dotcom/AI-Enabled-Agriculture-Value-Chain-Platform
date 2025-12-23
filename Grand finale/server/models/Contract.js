const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    counterparty: { type: String, required: true }, // Could be another User ID or external entity name
    crop: { type: String, required: true },
    quantity: { type: Number, required: true }, // In Quintals/Tons
    price: { type: Number, required: true }, // Agreed price
    maturityDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'active', 'settled', 'defaulted'], default: 'pending' },
    contractHash: { type: String }, // For Blockchain integration later
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', contractSchema);
const express = require('express');
const router = express.Router();
const { warehouses, activeTrips } = require('../data/logistics_real');

// GET /api/logistics/dashboard - Get real-time logistics data
router.get('/dashboard', (req, res) => {
    res.json({
        warehouses,
        activeTrips
    });
});

// POST /api/logistics/request
router.post('/request', (req, res) => {
    const { crop, quantity, pickupDate } = req.body;
    
    // In a real app, we would save this to the database and trigger a job to find trucks.
    // For this demo, we just return a success response with the generated pass details.
    
    const passId = `GP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    res.json({
        msg: 'Pickup request received successfully',
        passId: passId,
        truckDetails: {
            number: 'TRUCK-GJ-12-AB-9988',
            driver: 'Vikram Singh',
            eta: 'Tomorrow, 10:30 AM'
        }
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pestHeatmapData = require('../data/pest_heatmap_data');
const { readDb, writeDb } = require('../utils/jsonDb');
const crypto = require('crypto');

// POST /api/pest-reports - Submit a new pest report
router.post('/', auth, async (req, res) => {
    try {
        const { latitude, longitude, pestType, severity } = req.body;
        const db = readDb();

        const newReport = {
            _id: crypto.randomUUID(),
            location: {
                type: 'Point',
                coordinates: [longitude, latitude] // GeoJSON expects [lng, lat]
            },
            pestType,
            severity,
            reporterId: req.user.id,
            timestamp: new Date().toISOString()
        };

        // We don't have a pestReports array in db.json yet, let's add it if missing or just push to it
        if (!db.pestReports) {
            db.pestReports = [];
        }
        db.pestReports.push(newReport);
        writeDb(db);

        res.json(newReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/pest-reports - Get all reports (optionally filtered by bounds or time)
router.get('/', async (req, res) => {
    try {
        const db = readDb();
        // Combine real DB reports with mock heatmap data for the demo
        const dbReports = (db.pestReports || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 100);
        
        // Transform mock data to match schema structure
        const mockReports = pestHeatmapData.map(p => ({
            location: { coordinates: [p.lng, p.lat] },
            severity: p.severity > 0.7 ? 'High' : 'Low',
            pestType: p.pestType
        }));

        res.json([...dbReports, ...mockReports]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

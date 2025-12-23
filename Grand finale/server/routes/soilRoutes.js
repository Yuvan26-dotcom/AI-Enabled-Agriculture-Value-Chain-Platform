const express = require('express');
const router = express.Router();
const axios = require('axios');
const soilController = require('../controllers/soilController');

const AI_SERVICE_URL = 'http://localhost:8000';

// Get Soil Card Data by District
router.get('/:district', soilController.getSoilData);

// Proxy to AI Service for Soil Recommendations
router.post('/recommend/soil', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/recommend/soil`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("AI Service Error:", error.message);
        res.status(500).json({ error: "AI Service Unavailable" });
    }
});

module.exports = router;

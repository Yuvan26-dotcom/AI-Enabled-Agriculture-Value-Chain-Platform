const express = require('express');
const router = express.Router();
const axios = require('axios');

const AI_SERVICE_URL = 'http://localhost:8000';

router.post('/predict/yield', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/predict/yield`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("AI Service Error:", error.message);
        res.status(500).json({ error: "AI Service Unavailable" });
    }
});

router.post('/predict/spoilage', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/predict/spoilage`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("AI Service Error:", error.message);
        res.status(500).json({ error: "AI Service Unavailable" });
    }
});

router.post('/logistics/eta', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/logistics/eta`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("AI Service Error:", error.message);
        res.status(500).json({ error: "AI Service Unavailable" });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const advisoryController = require('../controllers/advisoryController');
const auth = require('../middleware/auth');

// Endpoint to simulate pest attack alert
router.post('/simulate-pest-attack', auth, advisoryController.simulatePestAttack);

module.exports = router;
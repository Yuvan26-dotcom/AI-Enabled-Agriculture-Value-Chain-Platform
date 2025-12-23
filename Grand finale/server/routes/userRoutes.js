const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/trust-score', auth, userController.calculateTrustScore);
router.get('/farmers', userController.getFarmers);

module.exports = router;
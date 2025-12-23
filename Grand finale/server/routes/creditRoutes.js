const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');
const auth = require('../middleware/auth');

router.get('/score', auth, creditController.getPerformanceScore);
router.post('/apply-scheme', auth, creditController.applyForScheme);

module.exports = router;
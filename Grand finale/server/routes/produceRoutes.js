const express = require('express');
const router = express.Router();
const produceController = require('../controllers/produceController');
const auth = require('../middleware/auth'); // Optional: Use if you want to protect routes

// Public routes for now, or add 'auth' middleware if needed
router.get('/', produceController.getAllProduce);
router.post('/', produceController.createProduce); // Add 'auth' middleware here if you want to link to logged-in user
router.post('/verify-certificate', produceController.verifyCertificate);

module.exports = router;

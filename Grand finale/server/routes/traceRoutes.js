const express = require('express');
const router = express.Router();
const traceController = require('../controllers/traceController');

// Public endpoint to verify product journey
router.get('/track/:batchId', traceController.getTrace);

// Farmer sells produce -> Generate Batch & QR
router.post('/sell', traceController.createBatch);

// Processor adds data
router.post('/process', traceController.addProcessingData);

// Legacy endpoint (optional to keep)
router.post('/add', traceController.addTraceEntry);

module.exports = router;
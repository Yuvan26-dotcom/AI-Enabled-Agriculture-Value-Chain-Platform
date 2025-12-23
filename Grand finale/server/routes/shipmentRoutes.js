const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getShipments, createShipment, updateLocation } = require('../controllers/shipmentController');

router.get('/', auth, getShipments);
router.post('/', auth, createShipment);
router.put('/:id/location', auth, updateLocation);

module.exports = router;

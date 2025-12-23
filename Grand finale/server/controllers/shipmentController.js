const { readDb, writeDb } = require('../utils/jsonDb');
const crypto = require('crypto');

// @desc    Get all shipments for a buyer
// @route   GET /api/shipments
// @access  Private
exports.getShipments = async (req, res) => {
    try {
        const db = readDb();
        // Filter by buyer ID if needed, or return all for demo visibility
        // Assuming req.user.id is available
        const shipments = db.shipments
            .filter(s => s.buyer === req.user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
        res.json(shipments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Private
exports.createShipment = async (req, res) => {
    try {
        const { driver, origin, destination, cargo, path } = req.body;
        const db = readDb();
        
        const trackingId = 'TRK-' + Date.now();

        const newShipment = {
            _id: crypto.randomUUID(),
            trackingId,
            buyer: req.user.id,
            driver,
            origin,
            destination,
            cargo,
            path,
            currentCoords: path ? path[0] : null,
            status: 'In Transit',
            progress: 0,
            createdAt: new Date().toISOString()
        };

        db.shipments.push(newShipment);
        writeDb(db);

        res.json(newShipment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update shipment location
// @route   PUT /api/shipments/:id/location
// @access  Private (or System/Driver)
exports.updateLocation = async (req, res) => {
    try {
        const { lat, lng, progress } = req.body;
        const db = readDb();
        
        const shipmentIndex = db.shipments.findIndex(s => s._id === req.params.id);
        
        if (shipmentIndex === -1) {
             return res.status(404).json({ msg: 'Shipment not found' });
        }

        db.shipments[shipmentIndex].currentCoords = { lat, lng };
        if (progress) db.shipments[shipmentIndex].progress = progress;

        writeDb(db);
        res.json(db.shipments[shipmentIndex]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

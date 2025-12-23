const { readDb, writeDb } = require('../utils/jsonDb');
const crypto = require('crypto');

// @desc    Create a new bid
// @route   POST /api/bids
// @access  Private (Buyer)
exports.createBid = async (req, res) => {
    try {
        const { crop, quantity, price, location } = req.body;
        const db = readDb();

        const newBid = {
            _id: crypto.randomUUID(),
            buyer: req.user.id,
            crop,
            quantity,
            price,
            location,
            status: 'Active',
            responses: [],
            createdAt: new Date().toISOString()
        };

        db.bids.push(newBid);
        writeDb(db);

        res.json(newBid);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all bids (with optional filters)
// @route   GET /api/bids
// @access  Public/Private
exports.getBids = async (req, res) => {
    try {
        const { crop, location } = req.query;
        const db = readDb();
        
        let bids = db.bids.filter(b => b.status === 'Active');

        if (crop) {
            const regex = new RegExp(crop, 'i');
            bids = bids.filter(b => regex.test(b.crop));
        }
        if (location) {
            const regex = new RegExp(location, 'i');
            bids = bids.filter(b => regex.test(b.location));
        }
        
        // Populate buyer details (name, location)
        bids = bids.map(bid => {
            const buyer = db.users.find(u => u._id === bid.buyer);
            return {
                ...bid,
                buyer: buyer ? { name: buyer.name, location: buyer.location } : null
            };
        });

        bids.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(bids);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get bids for the current buyer
// @route   GET /api/bids/my-bids
// @access  Private (Buyer)
exports.getMyBids = async (req, res) => {
    try {
        const db = readDb();
        const bids = db.bids
            .filter(b => b.buyer === req.user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
        res.json(bids);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
